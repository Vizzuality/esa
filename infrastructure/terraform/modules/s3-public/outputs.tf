output "bucket_name" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.this.bucket
}

output "bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.this.arn
}

output "bucket_region" {
  description = "S3 bucket region"
  value       = aws_s3_bucket.this.region
}

output "bucket_domain_name" {
  description = "S3 bucket domain name"
  value       = aws_s3_bucket.this.bucket_domain_name
}

output "bucket_regional_domain_name" {
  description = "S3 bucket regional domain name"
  value       = aws_s3_bucket.this.bucket_regional_domain_name
}

output "s3_access_key_id" {
  description = "Access key ID for S3 upload user"
  value       = aws_iam_access_key.s3_upload_user_access_key.id
  sensitive   = true
}

output "s3_secret_access_key" {
  description = "Secret access key for S3 upload user"
  value       = aws_iam_access_key.s3_upload_user_access_key.secret
  sensitive   = true
}
