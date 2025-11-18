resource "random_password" "access_token_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "access_token_salt" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "transfer_token_salt" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "app_keys_1" {
  length           = 16
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "app_keys_2" {
  length           = 16
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

locals {
  cms_secret_env_vars = {
    # Single DATABASE_URL instead of separate DATABASE_* variables - with SSL handling for AWS RDS  
    DATABASE_URL = "postgresql://${module.postgresql.username}:${module.postgresql.password}@${module.postgresql.host}:${module.postgresql.port}/${module.postgresql.db_name}?ssl=true&sslmode=prefer&sslrootcert=/etc/ssl/certs/rds-global-bundle.pem"

    # Keep individual variables for backward compatibility if needed
    DATABASE_HOST     = module.postgresql.host
    DATABASE_NAME     = module.postgresql.db_name
    DATABASE_PASSWORD = module.postgresql.password
    DATABASE_USERNAME = module.postgresql.username
    DATABASE_PORT     = module.postgresql.port

    ADMIN_JWT_SECRET    = random_password.access_token_secret.result
    API_TOKEN_SALT      = random_password.access_token_salt.result
    JWT_SECRET          = random_password.jwt_secret.result
    TRANSFER_TOKEN_SALT = random_password.transfer_token_salt.result
    APP_KEYS            = "${random_password.app_keys_1.result},${random_password.app_keys_2.result}"

    # S3 Bucket credentials for CMS uploads
    BUCKET_ACCESS_KEY = module.s3_public.s3_access_key_id
    BUCKET_SECRET_KEY = module.s3_public.s3_secret_access_key

    PORT = 1337
  }
  cms_env_vars = {
    NODE_ENV = "production"
    CMS_URL  = "https://${var.domain}${var.base_path}/cms"

    DATABASE_SSL                     = true
    DATABASE_SSL_REJECT_UNAUTHORIZED = false

    # S3 Bucket configuration (for Strapi AWS S3 provider)
    BUCKET_BUCKET                 = module.s3_public.bucket_name
    BUCKET_REGION                 = module.s3_public.bucket_region
    BUCKET_ENDPOINT               = "https://s3.${module.s3_public.bucket_region}.amazonaws.com"
    STRAPI_MEDIA_LIBRARY_PROVIDER = "aws-s3"
    STRAPI_ADMIN_API_BASE_URL     = "https://${var.domain}${var.base_path}/cms/api"
  }
}
