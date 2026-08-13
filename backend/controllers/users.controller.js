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
    const { nickname, email } = req.user;

    res.status(200).json({
      status: "success",
      data: {
        user: {
          name: nickname,
          email
        }
      }
    })
  },
  updateUserProfile: async (req, res, next) => {
    const { name } = req.body;
    const { id, nickname: originName } = req.user;

    if (originName === name) {
      return next(createHttpError(400, '使用者名稱未變更'))
    }

    const result = await userRepository.update({ id }, { nickname: name });
    if (result.affected === 0) {
      return next(createHttpError(400, '更新使用者資料失敗'))
    }

    res.status(200).json({
      status: "success",
      data: {
        user: {
          name
        }
      }
    })
  },
  updateUserPassword: async (req, res, next) => {
  },
}