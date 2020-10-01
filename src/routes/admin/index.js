// router 로 들어온 요청을 컨트롤러로 연결하거나 view page render
const user = require('../../controller/user');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = require('express').Router();
const passport = require('../../common/passport');

//admin 인증이 필요한 기능은 해당 middleware을 거쳐야한다.
const adminGuard = require('../../common/guard').guard('/admin/login');

router.get('/', user.me);


router.get('/login', (req, res) => {
  const errorMessage = req.flash('loginErrorMessage');
  res.render('pages/login', {
    errorMessage,
  });
});

router.post(
  '/login',
  passport.authenticate('admin', {
    successRedirect: '/admin/',
    failureRedirect: '/admin/login',
    failureFlash: true,
  })
);

router.get('/user', adminGuard, user.getUsers);
router.post('/user', adminGuard, user.createUser);
router.get('/user/export-csv', user.exportToCsv);
router.get('/user/:userId', user.getUser);
router.post('/user/:userId', upload.single('image'), user.updateUser);
router.delete('/user/:userId', user.deleteUser);

module.exports = router;
