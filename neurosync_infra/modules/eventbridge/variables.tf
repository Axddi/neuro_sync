variable "lambda_arn" {
  type = string
}

variable "lambda_name" {
  type = string
}

variable "schedule_expression" {
  type = string
  default = "rate(1 day)"
}