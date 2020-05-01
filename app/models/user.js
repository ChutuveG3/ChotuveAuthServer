module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      userName: DataTypes.STRING,
      birthdate: DataTypes.DATE
    },
    { underscored: true, paranoid: true, tableName: 'users' }
  );
  return User;
};
