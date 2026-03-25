# IAM
module "iam" {
  source = "../../modules/iam"
}

# DynamoDB
module "dynamodb" {
  source     = "../../modules/dynamodb"
  table_name = "neurosync-dev-table"
}

# SNS
module "sns" {
  source = "../../modules/sns"

  topic_name = "neurosync-dev-notifications"
  email      = "test@example.com"
}

# Cognito
module "cognito" {
  source = "../../modules/cognito"

  project_name = var.project_name
  environment  = var.environment
}

# Lambda
module "lambda" {
  source = "../../modules/lambda"

  environment = var.environment
  lambda_zip_path = "../../lambda_code/lambda.zip"

  dynamodb_table_name = module.dynamodb.table_name
  sns_topic_arn       = module.sns.sns_topic_arn
}

# API Gateway
module "api_gw" {
  source = "../../modules/api_gw"

  project_name = var.project_name
  environment  = var.environment

  lambda_function_name = module.lambda.lambda_function_name
  lambda_invoke_arn    = module.lambda.lambda_invoke_arn
}

# EventBridge
module "eventbridge" {
  source = "../../modules/eventbridge"

  lambda_arn  = module.lambda.lambda_arn
  lambda_name = module.lambda.lambda_function_name
}