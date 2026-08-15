const router = require('express').Router();

const { createCoachRole, getCoachProfile, updateCoachProfile } = require('../controllers/coaches.controller');
const { createCourse } = require('../controllers/courses.controller');
const { isAuth } = require('../middlewares/isAuth');
const { isCoach } = require('../middlewares/isCoach');
const validate = require('../middlewares/validate');
const { idParamSchema } = require('../schemas/baseSchema');
const { coachSchema, updateCoachSchema } = require('../schemas/coaches.schema');
const { courseSchema } = require('../schemas/courses.schema');

router.get('/', isAuth, isCoach, getCoachProfile);
router.put('/', isAuth, isCoach, validate(updateCoachSchema), updateCoachProfile);
// router.get('/courses');
router.post('/courses', isAuth, isCoach, validate(courseSchema), createCourse);
// router.get('/courses/:id');
// router.put('/courses/:id');
router.post('/:id', validate(idParamSchema, 'params'), validate(coachSchema), createCoachRole);

module.exports = router;