const { z } = require("zod");
const { idUUIDSchema, isRequireSchema, dateTimeSchema, urlSchema, nonNegativeIntegerSchema } = require("./baseSchema");

const courseSchema = z.object({
  skill_id: idUUIDSchema,
  name: isRequireSchema,
  description: isRequireSchema,
  start_at: dateTimeSchema,
  end_at: dateTimeSchema,
  max_participants: nonNegativeIntegerSchema,
  meeting_url: urlSchema
})

module.exports = { courseSchema }