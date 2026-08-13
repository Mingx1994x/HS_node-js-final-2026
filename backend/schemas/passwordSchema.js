const { z } = require("zod");

const passwordSchema = z.string({ error: '欄位未填寫正確' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/, '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字');

const updatePasswordSchema = z.object({
  password: passwordSchema,
  new_password: passwordSchema,
  confirm_new_password: passwordSchema
}).refine((data) => data.new_password === data.confirm_new_password, {
  message: '新密碼與驗證新密碼不一致',
  path: ['confirm_new_password'],
});

module.exports = { passwordSchema, updatePasswordSchema }

