variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment (dev, prod)"
  type        = string
}

variable "hash_key" {
  description = "Primary partition key"
  type        = string
}

variable "hash_key_type" {
  description = "Type of partition key (S | N | B)"
  type        = string
}