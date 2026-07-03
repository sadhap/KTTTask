module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define('Asset', {
    uniqueId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    serialNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('in_stock', 'issued', 'scrapped'),
      defaultValue: 'in_stock'
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: true
    },
    value: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  });

  return Asset;
};
