const User = require('../database/schemas/User');
const ApiResult = require('../model/ApiResult');
const { issueJWT } = require('../common/jwt');
const ApiError = require('../errors/ApiError');

exports.auth = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    
    if (!user) {
      return next(new ApiError(`Can not found ${email}`, 401));
    }

    // 만약 비밀번호까지 한다면
    // if (user.password !== password) {
    //   return next(new ApiError(`Wrong password`, 401));
    // }

    const tokenObject = issueJWT(user);
    res.send(ApiResult.OK(tokenObject));
  } catch (error) {
    return next(new ApiError(error.message, 401));
  }
};
