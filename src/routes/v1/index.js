const { auth } = require('../../controller/auth');
const post = require('../../controller/post');
const user = require('../../controller/user');
const passport = require('../../common/passport');

const router = require('express').Router();

router.get('/_hcheck', (req, res, next) => {
  res.send({
    response: new Date().toISOString(),
    success: true,
  });
});

router.post('/auth', auth);

// Post
router.post('/posts', passport.authenticate('jwt', { session: false }), post.writePost);
router.get('/users/:userId/posts', passport.authenticate('jwt', { session: false }), post.getPostList);
router.patch('/users/:userId/posts/:postId/like', passport.authenticate('jwt', { session: false }), post.likePost);

// Comments
router.post(
  '/users/:userId/posts/:postId/comments',
  passport.authenticate('jwt', { session: false }),
  post.writeComments,
);
router.get(
  '/users/:userId/posts/:postId/comments',
  passport.authenticate('jwt', { session: false }),
  post.getCommentList,
);

router.get('/user/connections', passport.authenticate('jwt', { session: false }), user.getConnections);
router.get('/user/me', passport.authenticate('jwt', { session: false }), user.me);
router.post('/user/exists', user.checkEmail);
router.post('/user/join', user.join);
router.post('/user/follow', passport.authenticate('jwt', { session: false }), user.follow);

module.exports = router;
