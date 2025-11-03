terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.14"
    }
  }

  // TF does not allow vars here. Use main vars or module outputs for other variables
  backend "s3" {
    bucket  = "esa-tofu-state"
    key     = "state"
    region  = "eu-west-3"
    profile = "esa"
  }

  required_version = "~> 1.8.0"
}

module "state" {
  source             = "./modules/state"
  state_project_name = var.project_name
  state_aws_region   = var.aws_region
  state_aws_profile  = var.aws_profile
}

module "frontend_ecr" {
  source        = "./modules/ecr"
  project_name  = var.project_name
  ecr_repo_name = "frontend"
}

module "cms_ecr" {
  source        = "./modules/ecr"
  project_name  = var.project_name
  ecr_repo_name = "cms"
}

module "iam" {
  source = "./modules/iam"
}

module "vpc" {
  source     = "./modules/vpc"
  project    = var.project_name
  aws_region = var.aws_region
}

module "dev" {
  providers = {
    aws = aws.dev
  }

  source    = "./modules/env"
  domain    = "esa-gda.dev-vizzuality.com"
  base_path = "/impact-sphere"

  project     = var.project_name
  environment = "dev"

  aws_region = var.aws_region

  vpc                = module.vpc.vpc
  subnet_ids         = module.vpc.public_subnet_ids
  availability_zones = module.vpc.availability_zones

  beanstalk_platform = "64bit Amazon Linux 2023 v4.7.3 running Docker"
  beanstalk_tier     = "WebServer"
  ec2_instance_type  = "t3.medium"

  elasticbeanstalk_iam_service_linked_role_name = module.iam.elasticbeanstalk_service_linked_role
  cname_prefix                                  = "${var.project_name}-dev-environment"

  rds_instance_class          = "db.t4g.medium"
  rds_engine_version          = "15.12"
  rds_backup_retention_period = 3

  repo_name    = var.github_repo_name
  github_owner = var.github_owner
  github_token = var.github_token

  github_additional_environment_variables = {
    NEXT_PUBLIC_MATOMO_URL     = "https://gda.esa.int/eopsua/"
    NEXT_PUBLIC_MATOMO_SITE_ID = "3"
  }
}

module "github" {
  source       = "./modules/github"
  repo_name    = var.github_repo_name
  github_owner = var.github_owner
  github_token = var.github_token
  global_secret_map = {
    PIPELINE_USER_ACCESS_KEY_ID     = module.iam.pipeline_user_access_key_id
    PIPELINE_USER_SECRET_ACCESS_KEY = module.iam.pipeline_user_access_key_secret
  }
  global_variable_map = {
    PROJECT_NAME                 = var.project_name
    NEXT_PUBLIC_MAPBOX_API_TOKEN = var.mapbox_api_token
    NEXT_PUBLIC_MAPBOX_USERNAME  = var.mapbox_username
    NEXT_PUBLIC_MAPBOX_STYLE_ID  = var.mapbox_style_id
    AWS_REGION                   = var.aws_region
    CLIENT_REPOSITORY_NAME       = module.frontend_ecr.repository_name
    CMS_REPOSITORY_NAME          = module.cms_ecr.repository_name
  }
}
