const { getAllCourses } = require('../controllers/courses.controller');

const router = require('express').Router();

router.get('/', getAllCourses);

module.exports = router;