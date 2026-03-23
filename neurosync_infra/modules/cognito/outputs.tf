output "user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.neurosync_dev_user_pool.id
}

output "user_pool_arn" {
  description = "Cognito User Pool ARN"
  value       = aws_cognito_user_pool.neurosync_dev_user_pool.arn
}

output "user_pool_client_id" {
  description = "Cognito App Client ID"
  value       = aws_cognito_user_pool_client.neurosync_dev_client.id
}