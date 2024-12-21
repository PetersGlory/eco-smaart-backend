require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const { sequelize } = require('./src/models');
const authRoutes = require('./src/routes/auth');
const userRouter = require('./src/routes/users');
const disasterRouter = require('./src/routes/disaster');
const transactionRoute = require('./src/routes/transactions');
const generalRoutes = require('./src/routes/general');

const app = express();

app.use(express.json());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: "*",
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 200,
  })
);

//static page for testing images
app.use(express.static("public"));

app.use(bodyParser.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/disaster', disasterRouter);
app.use('/api/v1/general', generalRoutes);
app.use('/api/v1/transaction', transactionRoute);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});