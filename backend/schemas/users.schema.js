const { z } = require("zod");
const { passwordSchema } = require("./passwordSchema");


const nameSchema = z.string({ error: '欄位未填寫正確' }).trim().min(1, '欄位未填寫正確').max(50, '欄位未填寫正確');

const emailSchema = z.string({ error: '欄位未填寫正確' }).trim().toLowerCase().email('欄位未填寫正確');

const userSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})

const userNameSchema = z.object({
  name: nameSchema
})

module.exports = { userNameSchema, userSchema, loginSchema };