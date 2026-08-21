const createHttpError = require("http-errors");
const AppDataSource = require("../db/data-source");
const { IsNull, Between } = require("typeorm");

const userRepository = AppDataSource.getRepository('User');
const coachRepository = AppDataSource.getRepository('Coach');
const coachSkillRepository = AppDataSource.getRepository('CoachSkill');
const courseBookingRepository = AppDataSource.getRepository('CourseBooking');
const creditPackageRepository = AppDataSource.getRepository('CreditPackage');

const availableMonthValue = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
module.exports = {
  /**
   * 教練後台 API
   * - createCoachRole：一般使用者升級成教練
   * - getCoachProfile：取得教練本人的後台資料
   * - updateCoachProfile：更新教練本人的後台資料
   * - getCoachRevenue：取得教練個人月營收
   */
  createCoachRole: async (req, res, next) => {
    const { id } = req.params;
    const { experience_years, description, profile_image_url } = req.body;

    const user = await userRepository.findOneBy({ id });
    if (!user) return next(createHttpError(400, '使用者不存在'));

    if (user.role === 'COACH') return next(createHttpError(409, '使用者已經是教練'));

    const createCoachProfile = await AppDataSource.transaction(
      async (manager) => {
        const updateUserRoleResult = await manager.update('User', { id }, { role: 'COACH' });

        if (updateUserRoleResult.affected === 0) {
          throw createHttpError(400, '更新使用者資料失敗')
        }

        return manager.save('Coach', {
          experience_years,
          description,
          profile_image_url,
          User: {
            id
          }
        })
      }
    )

    res.status(201).json({
      status: "success",
      data: {
        user: {
          name: user.nickname,
          role: "COACH"
        },
        coach: {
          id: createCoachProfile.id,
          user_id: createCoachProfile.User.id,
          experience_years: createCoachProfile.experience_years,
          description: createCoachProfile.description,
          profile_image_url: createCoachProfile.profile_image_url,
          created_at: createCoachProfile.created_at,
          updated_at: createCoachProfile.updated_at
        }
      }
    })
  },
  getCoachProfile: async (req, res, _next) => {
    const { coach } = req.user;

    const coachSkills = await coachSkillRepository.find({
      select: {
        skill_id: true,
      },
      where: { coach_id: coach.id },
    })

    res.status(200).json({
      status: "success",
      data: {
        id: coach.id,
        experience_years: coach.experience_years,
        description: coach.description,
        profile_image_url: coach.profile_image_url,
        skill_ids: coachSkills.map(data => data.skill_id)
      }
    })
  },
  updateCoachProfile: async (req, res, _next) => {
    const { coach } = req.user;
    const { experience_years, description, profile_image_url, skill_ids } = req.body;

    await AppDataSource.transaction(async (manager) => {
      const result = await manager.update(
        "Coach",
        { id: coach.id }, {
        experience_years,
        description,
        profile_image_url
      })

      if (result.affected === 0) {
        throw createHttpError(400, '更新教練資料失敗')
      }
      // 更新 coachSkill 資料...
      await manager.delete("CoachSkill", { coach_id: coach.id });

      await manager.insert(
        "CoachSkill",
        skill_ids.map((skill_id) => ({ coach_id: coach.id, skill_id }))
      );
    })

    res.status(200).json({
      status: "success",
      data: {
        id: coach.id,
        experience_years: experience_years,
        description: description,
        profile_image_url: profile_image_url,
        skill_ids: skill_ids
      }
    })
  },
  getCoachRevenue: async (req, res, _next) => {
    const { id: userId } = req.user;
    const { month } = req.query;

    const year = new Date().getFullYear();
    const monthIndex = availableMonthValue.indexOf(month);
    const startAt = new Date(year, monthIndex, 1);
    const endAt = new Date(year, monthIndex + 1, 1);

    const [bookings, total_price, total_amounts] = await Promise.all([
      courseBookingRepository.find({
        where: {
          cancelled_at: IsNull(),
          booking_at: Between(startAt, new Date(endAt.getTime() - 1)),
          Course: {
            // 教練 user id
            user_id: userId
          }
        },
        select: {
          // user 報名 
          user_id: true
        }
      }),
      creditPackageRepository.sum('price'),
      creditPackageRepository.sum('credit_amount'),
    ])

    const average = (total_price ?? 0) / (total_amounts || 1);
    const userIds = bookings.map(booking => booking.user_id);
    const participants = new Set(userIds).size;
    const courseCounts = bookings.length;

    res.status(200).json({
      status: "success",
      data: {
        total: {
          revenue: Math.floor(average * courseCounts),
          participants,
          course_count: courseCounts
        }
      }
    })
  },
  /**
   * 公開用戶端前台 API
   * - getCoaches：取得教練分頁列表
   * - getCoachById：取得單一教練詳細資料
   */
  getCoaches: async (req, res, _next) => {
    const { page, per } = req.query;
    const pagination = Number(page);
    const lists = Number(per);
    const coaches = await coachRepository.find({
      relations: { User: true },
      select: {
        id: true,
        User: {
          id: true,
          nickname: true
        }
      },
      skip: (pagination - 1) * lists,
      take: lists,
      order: { id: 'ASC' },
    });

    const coachLists = coaches.map(coach => ({
      id: coach.id,
      user_id: coach.User.id,
      name: coach.User.nickname
    }))

    res.status(200).json({
      status: "success",
      data: coachLists
    })
  },
  getCoachById: async (req, res, next) => {
    const { id: coachId } = req.params;

    const coach = await coachRepository.findOne(
      {
        where: {
          id: coachId
        },
        relations: {
          User: true
        }
      }
    );

    if (!coach) return next(createHttpError(400, '找不到該教練'))

    const skills = await coachSkillRepository.find({
      where: {
        coach_id: coachId
      },
      relations: {
        Skill: true
      }
    })

    res.status(200).json({
      status: "success",
      data: {
        user: {
          name: coach.User.nickname,
          role: coach.User.role
        },
        coach: {
          id: coach.id,
          user_id: coach.User.id,
          experience_years: coach.experience_years,
          description: coach.description,
          profile_image_url: coach.profile_image_url,
          created_at: coach.created_at,
          updated_at: coach.updated_at,
          skills: skills.map(skill => (skill.Skill.name)),
        }
      }
    })
  },
}