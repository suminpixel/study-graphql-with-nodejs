const dotenv = require('dotenv');
const result = dotenv.config();
const logger = require('./common/logger');
if (result.error) {
  throw result.error;
}
logger.info(result.parsed);

const routes = require('./routes'); //라우팅 관련 
const Server = require('./server');

new Server('v1.0.0').router(routes).listen(9000); //서버 인스턴스 생성

