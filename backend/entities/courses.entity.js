const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: 'Course',
  tableName: 'COURSE',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      nullable: false
    },
    name: {
      type: 'varchar',
      length: 50,
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: false
    },
    max_participants: {
      type: 'integer',
      nullable: false
    },
    start_at: {
      type: 'timestamp',
      nullable: false
    },
    end_at: {
      type: 'timestamp',
      nullable: false
    },
    meeting_url: {
      type: 'varchar',
      length: 2048,
      nullable: false
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
      nullable: false
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true,
      nullable: false
    },
    user_id: {
      type: 'uuid',
      nullable: false
    },
    skill_id: {
      type: 'uuid',
      nullable: false
    }
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
    Skill: {
      target: 'Skill',
      type: 'many-to-one',
      nullable: false,
      joinColumn: {
        name: 'skill_id',
        referencedColumnName: 'id',
      }
    }
  }
})