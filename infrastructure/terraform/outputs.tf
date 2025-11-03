# GitHub Actions - Global Secrets
output "github_global_secrets" {
  description = "Map of global GitHub Actions secrets (values not shown)"
  value       = module.github.global_secrets
}

# GitHub Actions - Global Variables
output "github_global_variables" {
  description = "Map of global GitHub Actions variables with values"
  value       = module.github.global_variables
}

# GitHub Actions - Dev Environment Secrets
output "github_dev_environment_secrets" {
  description = "Map of GitHub Actions dev environment secrets (values not shown)"
  value       = module.dev.github_environment_secrets
}

# GitHub Actions - Dev Environment Variables
output "github_dev_environment_variables" {
  description = "Map of GitHub Actions dev environment variables with values"
  value       = module.dev.github_environment_variables
}

# GitHub - Dev Environment Name
output "github_dev_environment_name" {
  description = "GitHub dev environment name"
  value       = module.dev.github_environment_name
}

# Dev S3 Public Bucket
output "dev_s3_public_bucket_name" {
  description = "Dev environment public S3 bucket name for uploads"
  value       = module.dev.s3_public_bucket_name
}

output "dev_s3_public_bucket_region" {
  description = "Dev environment public S3 bucket region"
  value       = module.dev.s3_public_bucket_region
}

output "dev_s3_public_bucket_url" {
  description = "Dev environment public S3 bucket URL"
  value       = module.dev.s3_public_bucket_url
}

