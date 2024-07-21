const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views'); // Specify the views directory

// Serve static files from the public directory
app.use(express.static('public'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: process.env.DB_PORT,
});

// Test the database connection
sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Define the Text model
const Text = sequelize.define('Text', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Sync the model with the database
sequelize.sync();

// Routes
app.post('/submit', async (req, res) => {
  try {
    const { content } = req.body;
    await Text.create({ content });
    res.redirect('/');
  } catch (error) {
    console.error('Error submitting text:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', async (req, res) => {
  try {
    const texts = await Text.findAll();
    res.render('index', { texts });
  } catch (error) {
    console.error('Error fetching texts:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/delete', async (req, res) => {
  try {
    await Text.destroy({ where: {}, truncate: true });
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting texts:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
