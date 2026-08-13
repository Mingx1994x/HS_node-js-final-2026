const router = require('express').Router();

const validate = require('../middlewares/validate');
const { signup, login, getUserProfile, updateUserProfile, updateUserPassword } = require('../controllers/users.controller');
const { userSchema, loginSchema } = require('../schemas/users.schema');

router.post('/signup', validate(userSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/password', updateUserPassword);

module.exports = router;