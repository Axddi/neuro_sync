# IAM
module "iam" {
  source = "../../modules/iam"

  dynamodb_table_arn = module.dynamodb.table_arn
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

module "lambda" {
  source = "../../modules/lambda"

  function_name = "neurosync-dev-lambda"
  role_arn      = module.iam.lambda_role_arn
  handler       = "index.handler"
  filename      = "../../lambda_code/lambda.zip"

  sns_topic_arn = module.sns.sns_topic_arn

  environment_variables = {
    TABLE_NAME    = module.dynamodb.table_name
    SNS_TOPIC_ARN = module.sns.sns_topic_arn
  }
}

module "api_gw" {
  source = "../../modules/api_gateway"

  lambda_name       = module.lambda.lambda_name
  lambda_invoke_arn = module.lambda.lambda_invoke_arn

  user_pool_id = module.cognito.user_pool_id
  client_id    = module.cognito.client_id
}

# EventBridge
module "eventbridge" {
  source = "../../modules/eventbridge"

  lambda_arn  = module.lambda.lambda_arn
lambda_name = module.lambda.lambda_name 
}