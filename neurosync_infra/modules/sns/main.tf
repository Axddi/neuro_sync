resource "aws_sns_topic" "neurosync_dev_topic" {
  name = "${var.project_name}-${var.environment}-topic"

  tags = {
    Name        = "${var.project_name}-${var.environment}-sns"
    Project     = var.project_name
    Environment = var.environment
  }
}