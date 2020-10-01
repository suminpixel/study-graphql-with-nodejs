const v1Apis = require('./v1');
const adminApis = require('./admin');

//router 파일을 /nnn/ 단위로 하나로 묶어 제공
module.exports = function routes(app) {
  app.use('/api/v1/', v1Apis);
  app.use('/admin/', adminApis);
};

