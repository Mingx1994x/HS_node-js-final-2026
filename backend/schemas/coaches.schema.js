const { z } = require("zod");
const { urlSchema, isRequireSchema } = require("./baseSchema");

const coachSchema = z.object({
  experience_years: z.number({ error: '欄位未填寫正確' }).int('欄位未填寫正確').nonnegative('欄位未填寫正確'),
  description: isRequireSchema,
  profile_image_url: urlSchema.optional()
});

module.exports = { coachSchema };