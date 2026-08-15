const createHttpError = require("http-errors");
const AppDataSource = require("../db/data-source");

const userRepository = AppDataSource.getRepository('User');
const coachRepository = AppDataSource.getRepository('Coach');
const coachSkillRepository = AppDataSource.getRepository('CoachSkill');
module.exports = {
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
  getCoachProfile: async (req, res, next) => {
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
  updateCoachProfile: async (req, res, next) => {
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
  }
}