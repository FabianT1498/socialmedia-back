const mongoose = require('mongoose');
const userSeeder = require('./seeders/userSeeder');
const postSeeder = require('./seeders/postSeeder');

// Conectarse a la base de datos
mongoose
  .connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB.');

    // Ejecutar los seeders
    userSeeder();
    postSeeder();
  })
  .catch((error) => console.error('Error connecting to MongoDB:', error));

