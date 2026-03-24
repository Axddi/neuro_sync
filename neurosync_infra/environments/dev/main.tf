module "dynamodb" {
  source = "../../modules/dynamodb"

  project_name  = var.project_name
  environment   = var.environment
  hash_key      = var.dynamodb_hash_key
  hash_key_type = var.dynamodb_hash_key_type
}

module "s3" {
  source = "../../modules/s3"

  project_name = var.project_name
  environment  = var.environment
}

module "sns" {
  source = "../../modules/sns"

  project_name = var.project_name
  environment  = var.environment
}

module "cognito" {
  source = "../../modules/cognito"

  project_name = var.project_name
  environment  = var.environment
}