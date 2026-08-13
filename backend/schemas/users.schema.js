const { z } = require("zod");
const { passwordSchema } = require("./passwordSchema");

const emailSchema = z.string({ error: '欄位未填寫正確' }).trim().toLowerCase().email('欄位未填寫正確');

const userSchema = z.object({
  name: z.string({ error: '欄位未填寫正確' }).trim().min(1, '欄位未填寫正確').max(50, '欄位未填寫正確'),
  email: emailSchema,
  password: passwordSchema
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})

module.exports = { userSchema, loginSchema };