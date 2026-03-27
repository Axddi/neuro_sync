output "api_endpoint" {
  value = module.api_gw.api_endpoint
}
output "lambda_name" {
  value = module.lambda.lambda_name
}

output "dynamodb_table" {
  value = module.dynamodb.table_name
}