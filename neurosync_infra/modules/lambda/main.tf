resource "aws_iam_role" "lambda_role" {
  name = "neurosync-dev-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })

  tags = {
    Name        = "neurosync-dev-lambda-role"
    Environment = var.environment
    Project     = "neurosync"
  }
}

# Attach basic execution policy
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda function
resource "aws_lambda_function" "neurosync_lambda" {
  function_name = "neurosync-dev-lambda"
  role          = aws_iam_role.lambda_role.arn

  runtime = "nodejs18.x"
  handler = "index.handler"

  filename = var.lambda_zip_path

  environment {
    variables = {
      DYNAMODB_TABLE = var.dynamodb_table_name
      SNS_TOPIC_ARN  = var.sns_topic_arn
    }
  }

  tags = {
    Name        = "neurosync-dev-lambda"
    Environment = var.environment
    Project     = "neurosync"
  }
}