variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment"
  type        = string
}

variable "dynamodb_hash_key" {
  description = "DynamoDB partition key"
  type        = string
}

variable "dynamodb_hash_key_type" {
  description = "DynamoDB key type"
  type        = string
}

variable "sns_topic_arn" {
  type = string
}