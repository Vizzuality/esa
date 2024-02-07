variable "do_region" {
  type        = string
  description = "DigitalOcean Region"
}

variable "do_project_name" {
  type        = string
  description = "Project name at DO"
}

variable "do_space_name" {
  type        = string
  description = "Name of the space"
}

variable "do_space_acl" {
  type        = string
  description = "ACL rules for spaces"
  default     = "private"
}
