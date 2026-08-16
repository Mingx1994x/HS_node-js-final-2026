const createHttpError = require("http-errors");
const AppDataSource = require("../db/data-source");

const coachRepository = AppDataSource.getRepository('Coach');
const coachSkillRepository = AppDataSource.getRepository('CoachSkill');
module.exports = {
  getCoaches: async (req, res, next) => {
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
  }
}