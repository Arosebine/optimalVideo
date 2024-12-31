const { Sequelize }= require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      underscoredAll: true
    }
});

export const connectDB = async (): Promise<void> => {
    try {
      await sequelize.authenticate();
      console.log('Database connected successfully.');
    } catch (error: any) {
      console.error('Failed to connect to the database:', error.message);
    }
  };


export default sequelize;