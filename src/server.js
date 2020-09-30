const express = require('express');
const http = require('http');
const path = require('path'); //파일과 Directory 경로 작업을 위한 Utility를 제공
const ApiError = require('./errors/ApiError');
const logger = require('./common/logger');
const methodOverride = require('method-override'); //REST API 옵션중 HTML이 지원하지 않는 PUT, DELETE 매서드를 오버라이딩
const { NODE_ENV, APP_ID } = require('./common/config');

const app = express(); //express 서버 인스턴스 생성


module.exports = class Server {
    constructor(version) {
      this.version = version;
  
      app.set('view engine', 'ejs'); // ejs 템플릿 사용
      app.set('views', path.resolve(`${__dirname}/views`)); // view(랜더링) 파일 경로 resolve
  
      app.use(express.static(`${__dirname}/public`)); //정적 파일 서비스할 폴더(경로) 지정
      app.use(express.json()); 
      app.use(express.urlencoded({ extended: true }));
      app.use(methodOverride());
    }
  
    //에러핸들링
    static errorHandling(express) {
      express.use('*', (req, res, next) => {
        const err = new ApiError('Not found', 404);
        next(err);
      });
      express.use((err, req, res, next) => {
        logger.error(err);
        res.render('pages/error', { err });
      });
    }
  
    //파일 요청 핸들링
    static fileDownloadHandling(express) {
      express.get('/uploads/:fileName', (req, res) => {
        const fileName = req.params.fileName;
        res.sendFile(path.join(__dirname, `../uploads/${fileName}`));
      });
    }
  
    //라우팅 별도 설정
    router(routes) {
        routes(app);
        Server.fileDownloadHandling(app);
        Server.errorHandling(app);
        return this;
    }
    
    //리스너 별도 설정 
    listen(port) {
        const welcome = (p) => () =>
        logger.info(`${APP_ID}: ${this.version} is up and running in NODE_ENV:${NODE_ENV} on port: ${p}`);
        this.server = http.createServer(app).listen(port, welcome(port));
        return this;
    }
  };
  
