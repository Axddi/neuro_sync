variable "environment" {
  type        = string
  description = "Environment name"
}

variable "lambda_zip_path" {
  type        = string
  description = "Path to Lambda deployment package"
}

variable "dynamodb_table_name" {
  type        = string
  description = "DynamoDB table name"
}

variable "sns_topic_arn" {
  type        = string
  description = "SNS topic ARN"
}