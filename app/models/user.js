module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      userName: { type: DataTypes.STRING, allowNull: false, unique: true },
      birthdate: { type: DataTypes.DATEONLY, allowNull: false }
    },
    { underscored: true, paranoid: true, tableName: 'users' }
  );
  return User;
};
