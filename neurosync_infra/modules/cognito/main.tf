resource "aws_cognito_user_pool" "this" {
  name = "neurosync-dev-user-pool"

  auto_verified_attributes = ["email"]

  schema {
    name     = "email"
    required = true
    attribute_data_type = "String"
  }
}

resource "aws_cognito_user_pool_client" "this" {
  name         = "neurosync-dev-client"
  user_pool_id = aws_cognito_user_pool.this.id

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]

  generate_secret = false

  callback_urls = ["http://localhost:3000/"]
  logout_urls   = ["http://localhost:3000/login"]

  allowed_oauth_flows = ["code"]
  allowed_oauth_scopes = ["email", "openid", "profile"]
  allowed_oauth_flows_user_pool_client = true
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