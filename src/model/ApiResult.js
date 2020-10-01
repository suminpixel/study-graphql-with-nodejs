//api 응답 객체 커스텀
class ApiResult {
  constructor(response, success, error) {
    this.response = response;
    this.success = success;
    this.error = error;
  }
  static OK(response) {
    return new ApiResult(response, true);
  }

  static error(error) {
    return new ApiResult(null, false, error);
  }
}

module.exports = ApiResult;
