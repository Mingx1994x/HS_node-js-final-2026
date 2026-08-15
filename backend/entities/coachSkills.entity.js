const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: 'CoachSkill',
  tableName: 'COACH_SKILL',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      nullable: false
    },
    coach_id: {
      type: 'uuid',
      nullable: false,
    },
    skill_id: {
      type: 'uuid',
      nullable: false,
    }
  },
  relations: {
    Coach: {
      target: 'Coach',
      type: 'many-to-one',
      nullable: false,
      onDelete: 'CASCADE',
      joinColumn: {
        name: 'coach_id',
        referencedColumnName: 'id',
      }
    },
    Skill: {
      target: 'Skill',
      type: 'many-to-one',
      nullable: false,
      onDelete: 'CASCADE',
      joinColumn: {
        name: 'skill_id',
        referencedColumnName: 'id',
      }
    }
  },
  uniques: [
    { columns: ['coach_id', 'skill_id'] }
  ]
})