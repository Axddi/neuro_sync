# IAM
module "iam" {
  source = "../../modules/iam"
}

# DynamoDB ✅ (YOU WERE MISSING THIS)
module "dynamodb" {
  source     = "../../modules/dynamodb"
  table_name = "neurosync-dev-table"
}

# Lambda
module "lambda_logs" {
  source        = "../../modules/lambda"
  function_name = "neurosync-dev-lambda"
  role_arn      = module.iam.lambda_role_arn
  handler       = "index.handler"
  filename      = "../../lambda_code/lambda.zip"

  environment_variables = {
    TABLE_NAME = module.dynamodb.table_name
  }
}

# API Gateway
module "api" {
  source             = "../../modules/api_gateway"
  lambda_invoke_arn  = module.lambda_logs.lambda_invoke_arn
  lambda_name        = module.lambda_logs.lambda_name
}

# EventBridge
module "eventbridge" {
  source      = "../../modules/eventbridge"
  lambda_arn  = module.lambda_logs.lambda_arn
  lambda_name = module.lambda_logs.lambda_name
}