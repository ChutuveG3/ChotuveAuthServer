'use strict';
module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define(
    'Server',
    {
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      apiKey: { type: DataTypes.STRING, allowNull: false, unique: true }
    },
    { underscored: true, tableName: 'servers' }
  );
  return Server;
};
