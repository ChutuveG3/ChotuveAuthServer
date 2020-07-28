module.exports = (sequelize, DataTypes) => {
  const RecoveryToken = sequelize.define(
    'RecoveryToken',
    {
      recoveryToken: { type: DataTypes.STRING, allowNull: false },
      username: { type: DataTypes.STRING, allowNull: false }
    },
    { underscored: true, tableName: 'recovery_tokens' }
  );
  return RecoveryToken;
};
