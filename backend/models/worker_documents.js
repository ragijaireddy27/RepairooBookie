module.exports = (sequelize, DataTypes) => {
    const WorkerDocument = sequelize.define("WorkerDocument", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      worker_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      aadhaar: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      license: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shop_details: {
        type: DataTypes.TEXT,
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
  
    return WorkerDocument;
  };
  