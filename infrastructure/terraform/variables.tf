variable "aws_profile" {
  type        = string
  description = "AWS profile to use to perform TF operations"
}

variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "eu-west-3"
}
variable "project_name" {
  type        = string
  description = "Short name of the project, will be used to prefix created resources"
}

variable "github_owner" {
  type        = string
  description = "Owner of the Github repository where the code is hosted"
}

variable "github_repo_name" {
  type        = string
  description = "Name of the Github repository where the code is hosted"
}

variable "github_token" {
  type        = string
  description = "Github token to access the repository"
}

variable "mapbox_api_token" {
  type        = string
  description = "Mapbox API token"
}

variable "mapbox_username" {
  type        = string
  description = "Mapbox username"
}

variable "mapbox_style_id" {
  type        = string
  description = "Mapbox style ID"
}
