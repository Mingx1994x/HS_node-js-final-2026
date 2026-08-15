const router = require('express').Router();

const { createCoachRole, getCoachProfile, updateCoachProfile } = require('../controllers/coaches.controller');
const { isAuth } = require('../middlewares/isAuth');
const { isCoach } = require('../middlewares/isCoach');
const validate = require('../middlewares/validate');
const { idParamSchema } = require('../schemas/baseSchema');
const { coachSchema, updateCoachSchema } = require('../schemas/coaches.schema');

router.get('/', isAuth, isCoach, getCoachProfile);
router.put('/', isAuth, isCoach, validate(updateCoachSchema), updateCoachProfile);
router.post('/:id', validate(idParamSchema, 'params'), validate(coachSchema), createCoachRole);
// router.get('/courses');
// router.post('/courses');
// router.get('/courses/:id');
// router.put('/courses/:id');

module.exports = router;