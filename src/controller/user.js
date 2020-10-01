const ApiResult = require('../model/ApiResult');
const ApiError = require('../errors/ApiError');
const logger = require('../common/logger');
const User = require('../model/User');
const CsvWriter = require('../common/csv-write-stream');

const getConnections = async (req, res, next) => {
  try {
    const followers = await ConnectedUser.find({ user: req.user._id })
      .select('follower')
      .populate({ path: 'follower', select: '-modifiedAt -createdAt' })
      .exec();

    res.send(ApiResult.OK(followers));
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const checkEmail = async (req, res, next) => {
  try {
    const isUserExist = await User.exists({ email: req.body.email });
    res.send(ApiResult.OK(isUserExist));
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const join = async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();

    res.send(
      ApiResult.OK({
        apiToken: 'xxxxxxx',
        user,
      }),
    );
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const follow = async (req, res, next) => {
  try {
    const connectedUser = new ConnectedUser(req.body);
    await connectedUser.save();

    const followers = await ConnectedUser
      .find({ user: req.user._id })
      .select('follower')
      .populate({ path: 'follower', select: 'name email grantedAt' })
      .exec();

    res.send(ApiResult.OK(followers));
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();
    res.format({
      html() {
        res.render('pages/index', { user });
      },
      json() {
        res.send(ApiResult.OK(user));
      },
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().exec();
    res.render('pages/user/list', { users });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const getUser = (req, res, next) => {
  const userId = req.params.userId;

  if (userId === 'new') {
    res.render('pages/user/new');
    return;
  }
  User.findById(userId).exec((err, user) => {
    if (err) next(new ApiError(err.message, 404));
    res.render('pages/user/edit', { user });
  });
};

const updateUser = (req, res, next) => {
  const userId = req.params.userId;
  const profileImageUrl = req.file ? `/${req.file.path}` : null;
  logger.info(req.body);

  new User({ ...req.body, profileImageUrl }).save((error) => {
    if (error) next(new ApiError(error.message, 500));
    res.redirect(302, `/admin/user/${userId}`);
  });
};

const deleteUser = (req, res, next) => {
  const id = req.params.userId;

  User.deleteOne({ id }, (error) => {
    if (error) next(new ApiError(error.message, 500));
    res.redirect(302, '/admin/user');
  });
};

const createUser = (req, res, next) => {
  logger.info('Create User', req.body);
  User.create(req.body, (error) => {
    if (error) next(new ApiError(error.message, 500));
    res.redirect(302, '/admin/user');
  });
};

const exportToCsv = (req, res, next) => {
  const csvWriter = new CsvWriter();
  res.setHeader('Content-type', 'text/csv');
  res.setHeader('Content-disposition', 'attachment; filename=user.csv');
  csvWriter.pipe(res);
  User.find().exec((error, users) => {
    if (error) {
      next(error);
    }

    users.forEach((v) => csvWriter.write(v));
    csvWriter.end();
  });
};

module.exports = {
  getConnections,
  checkEmail,
  join,
  follow,
  me,
  getUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
  exportToCsv,
};
