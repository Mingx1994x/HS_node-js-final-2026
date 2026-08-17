const { getAllCourses, bookCourse, cancelCourse } = require('../controllers/courses.controller');
const { isAuth } = require('../middlewares/isAuth');
const { validate } = require('../middlewares/validate');
const { idParamSchema } = require('../schemas/baseSchema');

const router = require('express').Router();

router.get('/', getAllCourses);
router.post('/:id', isAuth, validate(idParamSchema, 'params'), bookCourse);
router.delete('/:id', isAuth, validate(idParamSchema, 'params'), cancelCourse);

module.exports = router;