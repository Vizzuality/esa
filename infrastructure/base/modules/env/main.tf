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
  do_space_acl            = var.do_space_acl
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
