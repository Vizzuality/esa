## Resource: S3 Bucket for public uploads (CMS media and map layers)
resource "aws_s3_bucket" "this" {
  bucket = "${var.project}-${var.environment}-public"
  ## Beware: This allows TF to destroy the resource even if the bucket is not empty
  force_destroy = true

  tags = merge({
    Name = "${var.project}-${var.environment}-public"
  })
}

## Ownership Controls - Disable ACLs (recommended by AWS)
resource "aws_s3_bucket_ownership_controls" "this" {
  bucket = aws_s3_bucket.this.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

## Public Access Block - Allow public access
resource "aws_s3_bucket_public_access_block" "app_bucket_block" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false

  depends_on = [aws_s3_bucket_ownership_controls.this]
}

## Bucket Policy - Allow public read access
resource "aws_s3_bucket_policy" "public_read" {
  bucket = aws_s3_bucket.this.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.this.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.app_bucket_block]
}

## CORS Configuration
resource "aws_s3_bucket_cors_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

## IAM User for S3 bucket access (for CMS uploads)
resource "aws_iam_user" "s3_upload_user" {
  name = "${var.project}-${var.environment}-s3-upload-user"

  tags = merge({
    Name = "${var.project}-${var.environment}-s3-upload-user"
  })
}

## IAM Access Key for S3 upload user
resource "aws_iam_access_key" "s3_upload_user_access_key" {
  user = aws_iam_user.s3_upload_user.name
}

## IAM Policy for S3 bucket read/write access
resource "aws_iam_user_policy" "s3_upload_policy" {
  name = "${var.project}-${var.environment}-s3-upload-policy"
  user = aws_iam_user.s3_upload_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:ListAllMyBuckets"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ]
        Resource = [
          aws_s3_bucket.this.arn,
          "${aws_s3_bucket.this.arn}/*"
        ]
      }
    ]
  })
}
