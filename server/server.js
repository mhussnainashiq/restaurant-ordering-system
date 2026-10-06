const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ===== Routes =====
app.use('/api', routes);

// ===== Error Handling =====
app.use(notFound);
app.use(errorHandler);

// ===== Start Server =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});