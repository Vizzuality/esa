variable "project" {
  type        = string
  description = "Project name used in tagging and naming AWS resources."
}

variable "aws_region" {
  description = "The AWS region to deploy resources in"
  type        = string
}