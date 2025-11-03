
output "beanstalk_environment_settings" {
  value = module.beanstalk.environment_settings
}

output "beanstalk_environment_cname" {
  value = module.beanstalk.environment_cname
}

output "acm_certificate_domain_validation_options" {
  description = "A list of attributes to feed into other resources to complete certificate validation. Can have more than one element, e.g. if SANs are defined. Only set if DNS-validation was used."
  value       = flatten(aws_acm_certificate.acm_certificate[*].domain_validation_options)
}

output "acm_certificate_arn" {
  description = "The ARN of the ACM certificate"
  value       = aws_acm_certificate.acm_certificate.arn
}

output "cms_secret_env_vars" {
  description = "API secret environment variables"
  value       = local.cms_secret_env_vars
  sensitive   = true
}

# S3 Public Bucket outputs
output "s3_public_bucket_name" {
  description = "Public S3 bucket name for uploads"
  value       = module.s3_public.bucket_name
}

output "s3_public_bucket_region" {
  description = "Public S3 bucket region"
  value       = module.s3_public.bucket_region
}

output "s3_public_bucket_url" {
  description = "Public S3 bucket URL"
  value       = "https://${module.s3_public.bucket_regional_domain_name}"
}

# GitHub outputs
output "github_environment_secrets" {
  description = "Map of GitHub Actions environment secrets"
  value       = module.github.environment_secrets
}

output "github_environment_variables" {
  description = "Map of GitHub Actions environment variables"
  value       = module.github.environment_variables
}

output "github_environment_name" {
  description = "GitHub environment name"
  value       = module.github.environment_name
}

