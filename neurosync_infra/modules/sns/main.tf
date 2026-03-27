resource "aws_sns_topic" "this" {
  name = var.topic_name

  tags = {
    Name        = var.topic_name
    Environment = "dev"
    Project     = "neurosync"
  }
}

resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = aws_sns_topic.this.arn
  protocol  = "email"
  endpoint  = var.email
}