const router = require('express').Router();

const { createCoachRole } = require('../controllers/coaches.controller');
const validate = require('../middlewares/validate');
const { idParamSchema } = require('../schemas/baseSchema');
const { coachSchema } = require('../schemas/coaches.schema');


router.post('/:id', validate(idParamSchema, 'params'), validate(coachSchema), createCoachRole);
// router.get('/');
// router.put('/');
// router.get('/courses');
// router.post('/courses');
// router.get('/courses/:id');
// router.put('/courses/:id');

module.exports = router;