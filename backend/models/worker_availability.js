module.exports = (sequelize, DataTypes) => {
    const WorkerAvailability = sequelize.define("WorkerAvailability", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      worker_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      available_from: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      available_to: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    return WorkerAvailability;
  };
  