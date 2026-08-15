const router = require('express').Router();

const { createCoachRole, getCoachProfile } = require('../controllers/coaches.controller');
const { isAuth } = require('../middlewares/isAuth');
const { isCoach } = require('../middlewares/isCoach');
const validate = require('../middlewares/validate');
const { idParamSchema } = require('../schemas/baseSchema');
const { coachSchema } = require('../schemas/coaches.schema');

router.get('/', isAuth, isCoach, getCoachProfile);
router.post('/:id', validate(idParamSchema, 'params'), validate(coachSchema), createCoachRole);
// router.put('/');
// router.get('/courses');
// router.post('/courses');
// router.get('/courses/:id');
// router.put('/courses/:id');

module.exports = router;