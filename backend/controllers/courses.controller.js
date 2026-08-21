const createHttpError = require("http-errors");
const AppDataSource = require("../db/data-source");
const { getCourseStatus } = require("../utils/timeFormat");
const { IsNull } = require("typeorm");

const skillRepository = AppDataSource.getRepository('Skill');
const courseRepository = AppDataSource.getRepository('Course');
const packageOrderRepository = AppDataSource.getRepository('CreditPackageOrder');
const courseBookingRepository = AppDataSource.getRepository('CourseBooking');
const coachRepository = AppDataSource.getRepository('Coach');
module.exports = {
  // 教練後台 API
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

    const getParticipantsCount = courses.length > 0 ?
      (await courseBookingRepository
        .createQueryBuilder('booking')
        .select('booking.course_id', 'course_id')
        .addSelect('COUNT(*)', 'count')
        .where('booking.course_id IN (:...courseIds)', { courseIds: courses.map(course => course.id) })
        .andWhere('booking.cancelled_at IS NULL')
        .groupBy('booking.course_id')
        .getRawMany()) : [];

    const participants = Object.fromEntries(getParticipantsCount.map(row => [row.course_id, Number(row.count)]));

    const courseData = courses.map((course) => ({
      id: course.id,
      name: course.name,
      status: getCourseStatus(course.start_at, course.end_at),
      start_at: course.start_at,
      end_at: course.end_at,
      max_participants: course.max_participants,
      meeting_url: course.meeting_url,
      participants: participants[course.id] ?? 0
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
  updateCourseById: async (req, res, next) => {
    const { id: userId } = req.user;
    const { id: courseId } = req.params;
    const { name, description, skill_id, start_at, end_at, max_participants, meeting_url } = req.body;

    const course = await courseRepository.findOneBy({ id: courseId });
    if (!course || userId !== course.user_id) return next(createHttpError(400, '課程不存在'));

    const skill = await skillRepository.findOneBy({ id: skill_id });
    if (!skill) return next(createHttpError(400, 'ID錯誤'));

    const result = await courseRepository.createQueryBuilder()
      .update()
      .set({
        name,
        description,
        max_participants,
        start_at,
        end_at,
        meeting_url,
        user_id: userId,
        skill_id
      })
      .where('id = :id', { id: courseId })
      .returning(['updated_at', 'created_at'])
      .execute();

    if (result.affected === 0) return next(createHttpError(400, '更新課程資料失敗'))

    res.status(200).json({
      status: "success",
      data: {
        course: {
          id: courseId,
          user_id: userId,
          skill_id,
          name,
          description,
          start_at,
          end_at,
          max_participants,
          meeting_url,
          updated_at: result.raw[0]?.updated_at,
          created_at: result.raw[0]?.created_at,
        }
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
  },
  // 用戶端公開前台
  getAllCourses: async (req, res, next) => {

    const allCourses = await courseRepository.find({
      relations: {
        User: true,
        Skill: true
      }
    });

    const courses = allCourses.filter(course => getCourseStatus(course.start_at, course.end_at) === "進行中")
      .map(course => ({
        id: course.id,
        name: course.name,
        description: course.description,
        start_at: course.start_at,
        end_at: course.end_at,
        max_participants: course.max_participants,
        coach_name: course.User.nickname,
        skill_name: course.Skill.name
      }))
    res.status(200).json({
      status: "success",
      data: courses
    })
  },
  getCoursesByCoachId: async (req, res, next) => {
    const { id: coachId } = req.params;

    const coach = await coachRepository.findOne({
      where: { id: coachId },
      relations: { User: true }
    });
    if (!coach) return next(createHttpError(400, '找不到該教練'))

    const courseByCoach = await courseRepository.find({
      where: {
        user_id: coach.User.id
      },
      relations: {
        User: true,
        Skill: true
      }
    });

    const courses = courseByCoach.filter(course => getCourseStatus(course.start_at, course.end_at) !== "已結束")
      .map(course => ({
        id: course.id,
        name: course.name,
        description: course.description,
        start_at: course.start_at,
        end_at: course.end_at,
        max_participants: course.max_participants,
        coach_name: course.User.nickname,
        skill_name: course.Skill.name
      }));

    res.status(200).json({
      status: "success",
      data: courses
    })
  },
  getUserCourses: async (req, res, next) => {
    const { id: userId } = req.user;
    const [totalCredits, usedCredits] = await Promise.all([
      packageOrderRepository.sum('purchased_credits', { user_id: userId }),
      courseBookingRepository.count({ where: { user_id: userId, cancelled_at: IsNull() } })
    ]);

    const credit_remain = (totalCredits ?? 0) - usedCredits;

    const bookingCourses = await courseBookingRepository.find({
      where: { user_id: userId },
      relations: {
        Course: {
          User: true
        }
      },
      order: {
        Course: { start_at: 'ASC' }
      }
    });

    const bookingCourseList = bookingCourses.map(data => ({
      course_id: data.course_id,
      name: data.Course.name,
      start_at: data.Course.start_at,
      end_at: data.Course.end_at,
      meeting_url: data.Course.meeting_url,
      coach_name: data.Course.User.nickname,
      cancelled_at: data.cancelled_at
    }))

    res.status(200).json({
      status: "success",
      data: {
        credit_remain,
        credit_usage: usedCredits,
        course_booking: bookingCourseList
      }
    })
  },
  bookCourse: async (req, res, next) => {
    const { id: courseId } = req.params;
    const { id: userId } = req.user;

    const course = await courseRepository.findOneBy({ id: courseId });
    if (!course) return next(createHttpError(400, 'ID錯誤'));

    const hasBookingCourse = await courseBookingRepository.findOne({
      where: {
        course_id: courseId,
        user_id: userId
      }
    });

    if (hasBookingCourse) return next(createHttpError(400, '已經報名過此課程'));

    const [totalCredits, usedCredits] = await Promise.all([
      packageOrderRepository.sum('purchased_credits', { user_id: userId }),
      courseBookingRepository.count({ where: { user_id: userId, cancelled_at: IsNull() } })
    ]);

    const creditRemain = (totalCredits ?? 0) - usedCredits;

    if (creditRemain <= 0) return next(createHttpError(400, '已無可使用堂數'));

    const participants = await courseBookingRepository.count(
      {
        where: {
          course_id: courseId,
          cancelled_at: IsNull()
        }
      });

    if (participants === course.max_participants) return next(createHttpError(400, '已達最大參加人數，無法參加'));

    await courseBookingRepository.save({
      user_id: userId,
      course_id: courseId,
    });

    res.status(201).json({
      status: "success",
      data: null
    })
  },
  cancelCourse: async (req, res, next) => {
    const { id: courseId } = req.params;
    const { id: userId } = req.user;

    const course = await courseRepository.findOneBy({ id: courseId });
    if (!course) return next(createHttpError(400, 'ID錯誤'));

    const cancelCourse = await courseBookingRepository.findOneBy({
      course_id: courseId,
      user_id: userId,
      cancelled_at: IsNull()
    });

    if (!cancelCourse) return next(createHttpError(400, 'ID錯誤'));

    cancelCourse.cancelled_at = new Date();
    await courseBookingRepository.save(cancelCourse);

    res.status(200).json({
      status: "success",
      data: null
    })
  }
}