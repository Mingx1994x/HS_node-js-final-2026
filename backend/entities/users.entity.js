const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'USER',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      nullable: false
    },
    nickname: {
      type: 'varchar',
      length: 50,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 320,
      unique: true,
      nullable: false
    },
    role: {
      type: 'varchar',
      length: 20,
      nullable: false
    },
    hashPassword: {
      type: 'varchar',
      length: 72,
      nullable: false,
      select: false
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
      nullable: false
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
      nullable: false
    }
  }
})