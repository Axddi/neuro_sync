output "api_endpoint" {
  value = module.api.api_endpoint
}

output "lambda_name" {
  value = module.lambda_logs.lambda_name
}

output "dynamodb_table" {
  value = module.dynamodb.table_name
}