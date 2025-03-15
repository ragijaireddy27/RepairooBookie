module.exports = (sequelize, DataTypes) => {
    const WorkerJob = sequelize.define("WorkerJob", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      worker_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      job_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      job_start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      job_end_time: {
        type: DataTypes.DATE,
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
  
    return WorkerJob;
  };
  