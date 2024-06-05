output "space_id" {
  value = digitalocean_spaces_bucket.project_space.id
}

output "bucket_domain_name" {
  value = digitalocean_spaces_bucket.project_space.bucket_domain_name
}
