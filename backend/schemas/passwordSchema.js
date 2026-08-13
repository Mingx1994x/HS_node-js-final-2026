const { z } = require("zod");
const { isRequireSchema } = require("./baseSchema");

const passwordSchema = z.string({ error: '欄位未填寫正確' }).min(1, '欄位未填寫正確')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/, '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字');

const isRequirePasswordSchema = z.object({
  password: isRequireSchema,
  new_password: isRequireSchema,
  confirm_new_password: isRequireSchema
})
const updatePasswordSchema = z.object({
  password: passwordSchema,
  new_password: passwordSchema,
  confirm_new_password: passwordSchema
}).superRefine((data, ctx) => {
  if (data.new_password && data.password && data.new_password === data.password) {
    ctx.addIssue({
      code: 'custom',
      message: '新密碼不能與舊密碼相同',
      path: ['new_password'],
    })
  }

  if (data.new_password && data.confirm_new_password && data.new_password !== data.confirm_new_password) {
    ctx.addIssue({
      code: 'custom',
      message: '新密碼與驗證新密碼不一致',
      path: ['confirm_new_password'],
    });
  }
})

module.exports = { passwordSchema, updatePasswordSchema, isRequirePasswordSchema }

