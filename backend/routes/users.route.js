const router = require('express').Router();

const validate = require('../middlewares/validate');
const { isAuth } = require('../middlewares/isAuth');
const { signup, login, getUserProfile, updateUserProfile, updateUserPassword } = require('../controllers/users.controller');
const { userSchema, loginSchema, userNameSchema } = require('../schemas/users.schema');
const { updatePasswordSchema, isRequirePasswordSchema } = require('../schemas/passwordSchema');

router.post('/signup', validate(userSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/profile', isAuth, getUserProfile);
router.put('/profile', isAuth, validate(userNameSchema), updateUserProfile);
router.put('/password', isAuth, validate(isRequirePasswordSchema), validate(updatePasswordSchema), updateUserPassword);

module.exports = router;