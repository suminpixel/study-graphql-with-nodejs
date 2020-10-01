const dotenv = require('dotenv');
const result = dotenv.config();

const logger = require('./common/logger');

if (result.error) {
  throw result.error;
}

logger.info(result.parsed);

const routes = require('./routes');
const Server = require('./Server');

new Server('v1.0.0').router(routes).listen(9000);

