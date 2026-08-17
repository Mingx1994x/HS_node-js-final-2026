const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: 'CreditPackageOrder',
  tableName: 'CREDIT_PACKAGE_ORDER',
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
    credit_package_id: {
      type: 'uuid',
      nullable: false,
    },
    purchased_credits: {
      type: 'integer',
      nullable: false
    },
    price_paid: {
      type: 'integer',
      nullable: false
    },
    purchase_at: {
      type: 'timestamp',
      createDate: true,
      nullable: false
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
    CreditPackage: {
      target: 'CreditPackage',
      type: 'many-to-one',
      nullable: false,
      joinColumn: {
        name: 'credit_package_id',
        referencedColumnName: 'id',
      }
    }
  },
})