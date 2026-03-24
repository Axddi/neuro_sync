output "dynamodb_table_name" {
  value = module.dynamodb.dynamodb_table_name
}

output "s3_bucket_name" {
  value = module.s3.bucket_name
}

output "sns_topic_arn" {
  value = module.sns.sns_topic_arn
}

output "cognito_user_pool_id" {
  value = module.cognito.user_pool_id
}

output "table_name" {
  value = aws_dynamodb_table.neurosync_dev_table.name
}

output "sns_topic_arn" {
  value = aws_sns_topic.neurosync_dev_topic.arn
}

output "lambda_function_name" {
  value = module.lambda.lambda_function_name
}