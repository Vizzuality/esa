terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

module "postgresql" {
  source = "../postgresql"

  do_project_name         = var.do_project_name
  project_name            = var.project_name
  environment             = var.environment
  do_region               = var.do_region
  postgres_size           = var.postgres_size
  postgres_db_name        = var.postgres_db_name
  app_id                  = module.app.app_id
}

module "space" {
  source = "../space"

  do_project_name         = var.do_project_name
  do_region               = var.do_region
  do_space_name           = var.do_space_name
}

module "space_cms" {
  source = "../space"

  do_project_name         = var.do_project_name
  do_region               = var.do_region
  do_space_name           = var.do_cms_space_name
}

module "app" {
  source = "../app"

  do_project_name         = var.do_project_name
  project_name            = var.project_name
  environment             = var.environment
  do_region               = var.do_region
  do_app_instance         = var.do_app_instance
  do_app_instance_count   = var.do_app_instance_count
  do_app_image_tag        = var.do_app_image_tag
}

resource "digitalocean_cdn" "space_cdn" {
  origin = module.space.bucket_domain_name
}

resource "digitalocean_spaces_bucket_cors_configuration" "space_cms_cors" {
  bucket = module.space_cms.space_id
  region = var.do_region

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag", "Access-Control-Allow-Origin"]
    max_age_seconds = 3000
  }
}
