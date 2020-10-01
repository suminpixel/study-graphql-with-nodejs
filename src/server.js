const express = require("express");
const http = require("http");
const path = require("path"); //파일과 Directory 경로 작업을 위한 Utility를 제공
const ApiError = require("./errors/ApiError");
const cors = require('cors');
const logger = require("./common/logger");
const methodOverride = require("method-override"); //REST API 옵션중 HTML이 지원하지 않는 PUT, DELETE 매서드를 오버라이딩
const swaggerUi = require("swagger-ui-express");
const {
  NODE_ENV,
  APP_ID,
  SWAGGER_API_SPEC,
  SESSION_COOKIE_SECRET,
} = require("./common/config");
const swaggerDocument = require("../spec/openapi.json");
const cookieParser = require("cookie-parser");
const passport = require("./common/passport"); //인증 전략 구축을 위한 라이브러리 
const session = require("express-session");
const flash = require("connect-flash");
const ApiResult = require("./model/ApiResult");

//DB 연결
require('./database/connection'); 

const app = express(); //express 서버 인스턴스 생성

module.exports = class Server {
  constructor(version) {
    this.version = version;

    app.set("view engine", "ejs"); // ejs 템플릿 사용
    app.set("views", path.resolve(`${__dirname}/view`)); // view(랜더링) 파일 경로 resolve

    app.use(express.static(`${__dirname}/public`)); //정적 파일 서비스할 폴더(경로) 지정
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(
      session({
        secret: SESSION_COOKIE_SECRET,
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: true,
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(cors());
  }

  //에러핸들링
  static errorHandling(express) {
    express.use('*', (req, res, next) => {
        const err = new ApiError('Not found', 404);
        next(err);
      });
      express.use((err, req, res, next) => {
        logger.error(err);
        res.format({
          html() {
            res.render('pages/error', { err });
          },
          json() {
            res.status(err.status || 500).send(ApiResult.error(err.message));
          },
        });
      });
  }

  //파일 요청 핸들링
  static fileDownloadHandling(express) {
    express.get("/uploads/:fileName", (req, res) => {
      const fileName = req.params.fileName;
      res.sendFile(path.join(__dirname, `../uploads/${fileName}`));
    });
  }

  //라우팅 별도 설정
  router(routes) {
    routes(app);

    // 스웨거 api document 생성
    app.use(SWAGGER_API_SPEC, swaggerUi.serve);
    app.get(SWAGGER_API_SPEC, swaggerUi.setup(swaggerDocument));

    Server.fileDownloadHandling(app);
    Server.errorHandling(app);
    return this;
  }

  //리스너 별도 설정
  listen(port) {
    const welcome = (p) => () =>
      logger.info(
        `${APP_ID}: ${this.version} is up and running in NODE_ENV:${NODE_ENV} on port: ${p}`
      );
    this.server = http.createServer(app).listen(port, welcome(port));
    return this;
  }
};
