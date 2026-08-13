const { z } = require("zod");

const passwordSchema = z.string({ error: '欄位未填寫正確' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/, '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字');

module.exports = { passwordSchema }

