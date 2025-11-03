resource "random_string" "preview_secret" {
  length  = 64
  special = true
}


locals {
  client_secret_env_vars = {
    NEXT_PUBLIC_PREVIEW_SECRET = random_string.preview_secret.result
  }
  client_env_vars = {
    NODE_ENV              = "production"
    NEXT_PUBLIC_URL       = "https://${var.domain}"
    NEXT_PUBLIC_BASE_PATH = var.base_path
    NEXT_PUBLIC_API_URL   = "https://${var.domain}${var.base_path}/cms/api"
  }
}
