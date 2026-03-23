resource "aws_dynamodb_table" "neurosync_dev_table" {
  name         = "${var.project_name}-${var.environment}-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = var.hash_key

  attribute {
    name = var.hash_key
    type = var.hash_key_type
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-dynamodb"
    Project     = var.project_name
    Environment = var.environment
  }
}