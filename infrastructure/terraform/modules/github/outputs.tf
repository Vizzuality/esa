output "global_secrets" {
  description = "Map of global GitHub Actions secrets"
  value = {
    for k, v in github_actions_secret.global_github_secret : k => {
      name       = v.secret_name
      created_at = v.created_at
      updated_at = v.updated_at
    }
  }
}

output "global_variables" {
  description = "Map of global GitHub Actions variables"
  value = {
    for k, v in github_actions_variable.global_github_variable : k => {
      name       = v.variable_name
      value      = v.value
      created_at = v.created_at
      updated_at = v.updated_at
    }
  }
}

output "environment_secrets" {
  description = "Map of GitHub Actions environment secrets"
  value = {
    for k, v in github_actions_environment_secret.environment_secret : k => {
      name        = v.secret_name
      environment = v.environment
      created_at  = v.created_at
      updated_at  = v.updated_at
    }
  }
}

output "environment_variables" {
  description = "Map of GitHub Actions environment variables"
  value = {
    for k, v in github_actions_environment_variable.environment_variable : k => {
      name        = v.variable_name
      value       = v.value
      environment = v.environment
      created_at  = v.created_at
      updated_at  = v.updated_at
    }
  }
}

output "environment_name" {
  description = "GitHub environment name if created"
  value       = var.github_environment
}
