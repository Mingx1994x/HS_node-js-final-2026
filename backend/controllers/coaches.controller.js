const createHttpError = require("http-errors");
const AppDataSource = require("../db/data-source");

const userRepository = AppDataSource.getRepository('User');
const coachRepository = AppDataSource.getRepository('Coach');
module.exports = {
  createCoachRole: async (req, res, next) => {
    const { id } = req.params;
    const { experience_years, description, profile_image_url } = req.body;

    const user = await userRepository.findOneBy({ id });
    if (!user) return next(createHttpError(400, '使用者不存在'));

    if (user.role === 'COACH') return next(createHttpError(409, '使用者已經是教練'));

    const updateUserRoleResult = await userRepository.update({ id }, { role: 'COACH' });
    if (updateUserRoleResult.affected === 0) return next(createHttpError(400, '更新使用者資料失敗'));

    const coachProfile = await coachRepository.save({
      experience_years,
      description,
      profile_image_url,
      User: {
        id
      }
    });

    res.status(201).json({
      status: "success",
      data: {
        user: {
          name: user.nickname,
          role: "COACH"
        },
        coach: {
          id: coachProfile.id,
          user_id: coachProfile.User.id,
          experience_years: coachProfile.experience_years,
          description: coachProfile.description,
          profile_image_url: coachProfile.profile_image_url,
          created_at: coachProfile.created_at,
          updated_at: coachProfile.updated_at
        }
      }
    })
  }
}