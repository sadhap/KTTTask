module.exports = (sequelize, DataTypes) => {
  const AssetHistory = sequelize.define('AssetHistory', {
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  return AssetHistory;
};
