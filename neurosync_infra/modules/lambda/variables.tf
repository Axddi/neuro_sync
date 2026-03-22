variable "function_name" {
  type = string
}

variable "role_arn" {
  type = string
}

variable "handler" {
  type = string
}

variable "filename" {
  type = string
}

variable "environment_variables" {
  type = map(string)
  default = {}
}