module "iam" {
  source = "../../modules/iam"
}

module "lambda_logs" {
  source        = "../../modules/lambda"
  function_name = "neurosync-dev-logs"
  role_arn      = module.iam.lambda_role_arn
  handler       = "index.handler"
  filename      = "../../artifacts/logs.zip"

  environment_variables = {
    TABLE_NAME = "neurosync-dev"
  }
}

module "api" {
  source     = "../../modules/api_gateway"
  lambda_arn = module.lambda_logs.lambda_arn
}

module "eventbridge" {
  source      = "../../modules/eventbridge"
  lambda_arn  = module.lambda_logs.lambda_arn
  lambda_name = module.lambda_logs.lambda_name
}