const dotenv = require('dotenv');
const result = dotenv.config();
const logger = require('./common/logger');
if (result.error) {
  throw result.error;
}
logger.info(result.parsed);

const routes = require('./routes/v1'); 

const Server = require('./server');

new Server('v1.0.0').router(routes).listen(9000); //서버 인스턴스 생성 ex) 온라인 게임서버에서 채널 구분시 인스턴스를 사용하게 해줌 //외부에서 관리 쉬움 (닫기 등)