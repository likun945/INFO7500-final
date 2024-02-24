import { Sequelize } from 'sequelize';

// variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USERNAME = process.env.DB_USERNAME || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'wW875100!';
const DB_NAME = process.env.DB_NAME || 'webapp';

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql'
});

sequelize.sync().then(() => {
  console.log('Database & tables created!');
});

export default sequelize;
