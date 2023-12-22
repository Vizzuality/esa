# DO allows to have only one container registry per account
# skip this action if registry already exists
module "container_registry" {
  source = "./modules/container_registry"

  registry_name      = var.container_registry_name
  do_region          = var.do_region
}

resource "random_password" "api_token_salt" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "random_password" "admin_jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "random_password" "transfer_token_salt" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "random_password" "jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "random_password" "preview_secret" {
  length           = 12
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

locals {
  staging_cms_env = {
    HOST                             = "0.0.0.0"
    PORT                             = 1337
    APP_KEYS                         = "toBeModified1,toBeModified2"
    API_TOKEN_SALT                   = random_password.api_token_salt.result
    ADMIN_JWT_SECRET                 = random_password.admin_jwt_secret.result
    TRANSFER_TOKEN_SALT              = random_password.transfer_token_salt.result
    JWT_SECRET                       = random_password.jwt_secret.result
    CMS_URL                          = "${module.staging.app_url}/impact-sphere/cms"
    STRAPI_ADMIN_API_BASE_URL        = "${module.staging.app_url}/impact-sphere/cms/api"
    STRAPI_ADMIN_MAPBOX_ACCESS_TOKEN = var.mapbox_api_token
    STRAPI_ADMIN_PREVIEW_URL         = "${module.staging.app_url}/impact-sphere"
    STRAPI_ADMIN_PREVIEW_SECRET      = random_password.preview_secret.result
    STRAPI_MEDIA_LIBRARY_PROVIDER    = "digitalocean"
    STRAPI_ADMIN_MAPBOX_USERNAME     = var.mapbox_username
    STRAPI_ADMIN_MAPBOX_STYLE_ID     = var.mapbox_style_id

    # DigitalOcean Spaces to store media content
    BUCKET_ACCESS_KEY              = var.do_spaces_client_id
    BUCKET_SECRET_KEY              = var.do_spaces_secret_key
    BUCKET_REGION                  = var.do_region
    BUCKET_BUCKET                  = "${var.project_name}-staging-cms"
    BUCKET_ENDPOINT                = "https://${var.do_region}.digitaloceanspaces.com"

    # Database
    DATABASE_CLIENT                  = "postgres"
    DATABASE_HOST                    = module.staging.postgresql_host
    DATABASE_PORT                    = module.staging.postgresql_port
    DATABASE_NAME                    = var.postgres_db_name
    DATABASE_USERNAME                = module.staging.postgresql_username
    DATABASE_PASSWORD                = module.staging.postgresql_password
    DATABASE_SSL                     = true
    DATABASE_SSL_REJECT_UNAUTHORIZED = false

  }
  staging_client_env = {
    NEXT_PUBLIC_URL                            = "${module.staging.app_url}/impact-sphere"
    NEXT_PUBLIC_BASE_PATH                      = "/impact-sphere"
    NEXT_PUBLIC_ENVIRONMENT                    = "production"
    NEXT_PUBLIC_API_URL                        = "${module.staging.app_url}/impact-sphere/cms/api"
    NEXT_PUBLIC_GA_TRACKING_ID                 = var.ga_tracking_id
    NEXT_PUBLIC_MAPBOX_API_TOKEN               = var.mapbox_api_token
    NEXT_PUBLIC_PREVIEW_SECRET                 = random_password.preview_secret.result
    LOG_LEVEL                                  = "info"
    RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false
  }
}

module "github_values" {
  source     = "./modules/github_values"
  repo_name  = var.repo_name
  secret_map = {
    STAGING_CMS_ENV_FILE            = join("\n", [for key, value in local.staging_cms_env : "${key}=${value}"])
    STAGING_CLIENT_ENV_FILE         = join("\n", [for key, value in local.staging_client_env : "${key}=${value}"])
  }
}

# can be run only after container registry is created and it contains docker images
# provide correct docker image tag during creation of app
# docker images should be automatically build and pushed to docker registry by CI/CD
module "staging" {
  source                = "./modules/env"
  do_project_name       = var.do_project_name
  project_name          = var.project_name
  environment           = "staging"
  do_region             = var.do_region
  postgres_size         = var.postgres_size
  postgres_db_name      = var.postgres_db_name
  do_app_instance       = var.do_app_instance
  do_app_instance_count = var.do_app_instance_count
  do_app_image_tag      = var.do_app_image_tag
  do_space_name         = "${var.project_name}-staging"
  do_cms_space_name     = "${var.project_name}-staging-cms"
}

resource "digitalocean_spaces_bucket_cors_configuration" "staging_cors" {
  bucket = module.staging.space_id
  region = var.do_region

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}
