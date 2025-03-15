module.exports = (sequelize, DataTypes) => {
    const Worker = sequelize.define("Worker", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      service_types: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
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
      address: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      ratings_avg: {
        type: DataTypes.NUMERIC,
        allowNull: true,
      },
      experience: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
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
  
    return Worker;
  };
  