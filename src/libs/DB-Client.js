// const mysql = require("mysql");

// const pool = mysql.createConnection({
//     connectionLimit: process.env.CONNECTION_LIMIT,
//     multipleStatements: true,
//     password: process.env.DB_PASSWORD,
//     user: process.env.DB_USER,
//     database: process.env.DB_DATABASE,
//     host: process.env.DB_HOST,
// });

// pool.connect(function(err) {
//     if (err) {
//         console.log('this is an error')
//     }else{

//         console.log('Database is connected successfully !');
//     }
// })

// module.exports = pool;

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  },
};
