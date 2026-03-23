output "sns_topic_arn" {
  description = "SNS Topic ARN"
  value       = aws_sns_topic.neurosync_dev_topic.arn
}

output "sns_topic_name" {
  description = "SNS Topic name"
  value       = aws_sns_topic.neurosync_dev_topic.name
}