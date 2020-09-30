// api 에러 표기, 리턴 정보 
// 1. 에러 종류 명
// 2. 에러 메세지
// 3. 상태코드
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = ApiError;
