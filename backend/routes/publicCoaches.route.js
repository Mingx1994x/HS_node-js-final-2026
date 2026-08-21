const { paginationSchema, idParamSchema } = require('../schemas/baseSchema');
const { getCoaches, getCoachById } = require('../controllers/coaches.controller');
const { getCoursesByCoachId } = require('../controllers/courses.controller');
const { validate, validateQuery } = require('../middlewares/validate');

const router = require('express').Router();

router.get('/', validateQuery(paginationSchema), getCoaches);
router.get('/:id', validate(idParamSchema, 'params'), getCoachById);
router.get('/:id/courses', validate(idParamSchema, 'params'), getCoursesByCoachId);

module.exports = router;