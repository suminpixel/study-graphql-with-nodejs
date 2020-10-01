// router 로 들어온 요청을 컨트롤러로 연결하거나 view page render
const user = require('../../controller/user');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = require('express').Router();

router.get('/', user.me);

router.get('/login', (req, res) => {
  res.render('pages/login');
});

router.get('/user', user.getUsers);
router.post('/user', user.createUser);
router.get('/user/export-csv', user.exportToCsv);
router.get('/user/:userId', user.getUser);
router.post('/user/:userId', upload.single('image'), user.updateUser);
router.delete('/user/:userId', user.deleteUser);

module.exports = router;
