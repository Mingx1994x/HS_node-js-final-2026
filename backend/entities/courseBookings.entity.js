const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: 'CourseBooking',
  tableName: 'COURSE_BOOKING',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      nullable: false
    },
    user_id: {
      type: 'uuid',
      nullable: false,
    },
    course_id: {
      type: 'uuid',
      nullable: false,
    },
    booking_at: {
      type: 'timestamp',
      createDate: true,
      nullable: false
    },
    cancelled_at: {
      type: 'timestamp',
      nullable: true
    },
  },
  relations: {
    User: {
      target: 'User',
      type: 'many-to-one',
      nullable: false,
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      }
    },
    Course: {
      target: 'Course',
      type: 'many-to-one',
      nullable: false,
      joinColumn: {
        name: 'course_id',
        referencedColumnName: 'id',
      }
    }
  },
  uniques: [
    { columns: ['user_id', 'course_id'] }
  ]
})