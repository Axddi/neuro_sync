variable "project_name" {
  type    = string
  default = "neurosync"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "dynamodb_table_arn" {}