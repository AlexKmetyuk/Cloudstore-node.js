const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DB, "root", process.env.PASS, {
  dialect: process.env.DIALECT,
  host: process.env.HOST,
  //   pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.files = require("./File.js")(sequelize, DataTypes);
db.categories = require("./Category.js")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("Re-sync done!");
});

module.exports = db;
