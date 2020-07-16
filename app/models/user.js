module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING },
      userName: { type: DataTypes.STRING, allowNull: false, unique: true },
      birthdate: { type: DataTypes.DATEONLY, allowNull: false },
      profileImgUrl: { type: DataTypes.STRING }
    },
    { underscored: true, tableName: 'users' }
  );
  return User;
};
