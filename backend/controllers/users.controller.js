const createHttpError = require("http-errors");
const bcrypt = require("bcryptjs");

const AppDataSource = require("../db/data-source");
const { generateJWT } = require("../utils/jwtTools");

const userRepository = AppDataSource.getRepository('User');

module.exports = {
  signup: async (req, res, next) => {
    const { name, email, password } = req.body;

    const isExistUser = await userRepository.findOneBy({ email });
    if (isExistUser) {
      return next(createHttpError(409, 'Email 已被使用'))
    }

    const salt = 10;
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = await userRepository.save({
      nickname: name,
      email,
      role: "USER",
      hashPassword
    });

    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: newUser.id,
          name: newUser.nickname
        }
      }
    });
  },
  login: async (req, res, next) => {
    const { email, password } = req.body;

    const user = await userRepository.findOne({
      select: {
        id: true,
        hashPassword: true,
        nickname: true,
        role: true
      },
      where: { email },
    });

    if (!user) {
      return next(createHttpError(400, '使用者不存在或密碼輸入錯誤'))
    }

    const isMatch = await bcrypt.compare(password, user.hashPassword);

    if (!isMatch) {
      return next(createHttpError(400, '使用者不存在或密碼輸入錯誤'))
    }

    const token = generateJWT({
      id: user.id,
      role: user.role
    });

    res.status(201).json({
      status: "success",
      data: {
        token,
        user: {
          name: user.nickname
        }
      }
    })
  },
  getUserProfile: async (req, res, next) => {
    const { user } = req;
    const targetUser = await userRepository.findOneBy({ id: user.id });

    if (!targetUser) {
      return next(createHttpError(401, '無效的 token'));
    }

    res.status(200).json({
      status: "success",
      data: {
        user: {
          name: targetUser.nickname,
          email: targetUser.email
        }
      }
    })
  },
  updateUserProfile: async (req, res, next) => {

  },
  updateUserPassword: async (req, res, next) => {
  },
}