const { z } = require("zod");

const idParamSchema = z.object({
  id: z.string({ error: 'ID錯誤' }).uuid('ID錯誤')
})

module.exports = idParamSchema;