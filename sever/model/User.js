import { Sequelize, DataTypes } from 'sequelize';
import { database, dialect, host, password, user } from '../constants.js';

const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: dialect,
});

const UserModel = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    code_language: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    input_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);


// UserModel.belongsTo(WorkflowModel, {
//   foreignKey: 'genai_user_workflow_id',
// });

export default UserModel;
