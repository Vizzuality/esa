terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

data "digitalocean_project" "project" {
  name = var.do_project_name
}

resource "digitalocean_spaces_bucket" "project_space" {
  name = var.do_space_name
  region = var.do_region
  acl = var.do_space_acl
}

resource "digitalocean_project_resources" "project_space" {
  project = data.digitalocean_project.project.id
  resources = [digitalocean_spaces_bucket.project_space.urn]
}
