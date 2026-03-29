resource "aws_cognito_user_pool" "this" {
  name = "neurosync-dev-user-pool"

  auto_verified_attributes = ["email"]

  schema {
    name     = "email"
    required = true
    attribute_data_type = "String"
  }
   lifecycle {
    ignore_changes = [
      schema 
    ]
   }
}

resource "aws_cognito_user_pool_client" "this" {
  name         = "neurosync-dev-client-v2"
  user_pool_id = aws_cognito_user_pool.this.id
  lifecycle {
    ignore_changes = all
  }
}
resource "aws_cognito_user_group" "caregiver" {
  name         = "caregiver"
  user_pool_id = aws_cognito_user_pool.this.id
}

resource "aws_cognito_user_group" "doctor" {
  name         = "doctor"
  user_pool_id = aws_cognito_user_pool.this.id
}

resource "aws_cognito_user_in_group" "admin_caregiver" {
  user_pool_id = aws_cognito_user_pool.this.id
  username     = "admin" 
  group_name   = aws_cognito_user_group.caregiver.name
}
resource "aws_cognito_user_pool_domain" "this" {
  domain       = "neurosync-dev-auth-${random_id.suffix.hex}"
  user_pool_id = aws_cognito_user_pool.this.id
}

resource "random_id" "suffix" {
  byte_length = 4
}