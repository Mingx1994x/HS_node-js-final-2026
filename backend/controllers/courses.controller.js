const createHttpError = require("http-errors");
const AppDataSource = require("../db/data-source");
const { getCourseStatus } = require("../utils/timeFormat");

const skillRepository = AppDataSource.getRepository('Skill');
const courseRepository = AppDataSource.getRepository('Course');
module.exports = {
  getCoursesByCoach: async (req, res, next) => {
    const { id } = req.user;
    const courses = await courseRepository.find({
      select: {
        id: true,
        name: true,
        start_at: true,
        end_at: true,
        max_participants: true,
        meeting_url: true,
      },
      where: { user_id: id }
    });

    const courseData = courses.map(course => ({
      id: course.id,
      name: course.name,
      status: getCourseStatus(course.start_at, course.end_at),
      start_at: course.start_at,
      end_at: course.end_at,
      max_participants: course.max_participants,
      meeting_url: course.meeting_url,
      participants: 0
    }))

    res.status(200).json({
      status: "success",
      data: courseData
    })
  },
  getCourseById: async (req, res, next) => {
    const { id: userId } = req.user;
    const { id: courseId } = req.params;
    const course = await courseRepository.findOne({
      where: { id: courseId },
      relations: { Skill: true }
    });

    if (!course || userId !== course.user_id) return next(createHttpError(400, '課程不存在'));

    res.status(200).json({
      status: "success",
      data: {
        id: course.id,
        name: course.name,
        description: course.description,
        start_at: course.start_at,
        end_at: course.end_at,
        max_participants: course.max_participants,
        skill_name: course.Skill.name,
        skill_id: course.skill_id,
        meeting_url: course.meeting_url,
      }
    })
  },
  createCourse: async (req, res, next) => {
    const { id: userId } = req.user;
    const { name, description, skill_id, start_at, end_at, max_participants, meeting_url } = req.body;

    const isExistSkill = await skillRepository.findOneBy({ id: skill_id });

    if (!isExistSkill) return next(createHttpError(400, 'ID錯誤'))

    const newCourse = await courseRepository.save({
      user_id: userId,
      skill_id,
      name,
      description,
      start_at,
      end_at,
      max_participants,
      meeting_url,
    })

    res.status(201).json({
      status: "success",
      data: {
        course: newCourse
      }
    })
  }
}