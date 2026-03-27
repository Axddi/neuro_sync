resource "aws_s3_bucket" "neurosync_dev_bucket" {
  bucket = "${var.project_name}-${var.environment}-bucket"

  tags = {
    Name        = "${var.project_name}-${var.environment}-s3"
    Project     = var.project_name
    Environment = var.environment
  }
}

# Enable versioning (best practice)
resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.neurosync_dev_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Block public access (security best practice)
resource "aws_s3_bucket_public_access_block" "block_public" {
  bucket = aws_s3_bucket.neurosync_dev_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}