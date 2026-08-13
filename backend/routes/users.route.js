const router = require('express').Router();

const { signup, login, getUserProfile, updateUserProfile, updateUserPassword } = require('../controllers/users.controller');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/password', updateUserPassword);

module.exports = router;