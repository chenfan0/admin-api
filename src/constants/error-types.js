//  将所有错误类型用不同的常量表示，便于进行错误处理

const USERNAME_PASSWORD_IS_REQUIRED = "username_password_is_required";
const USERNAME_ALREADY_EXISTS = "username_already_exists";
const USERNAME_NOT_EXISTS = "username_not_exists";
const PASSWORD_ERROR = "password_error";
const NOT_AUTHORIZATION = "not_authorizaion";
const NOT_PERMISSION = "not_permisson";

module.exports = {
  USERNAME_PASSWORD_IS_REQUIRED,
  USERNAME_ALREADY_EXISTS,
  USERNAME_NOT_EXISTS,
  PASSWORD_ERROR,
  NOT_AUTHORIZATION,
  NOT_PERMISSION,
};
