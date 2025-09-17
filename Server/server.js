const express = require('express');
const cors = require('cors');
const appRoutes = require('./Routes/Router');
const cookieParser = require('cookie-parser');
const path = require('path');



const app = express();

// Use body parsers before routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1); // important for secure cookies behind proxies like Vercel

// CORS setup (Make sure the front-end is allowed to send requests)
app.use(cors({ origin: true, credentials: true }));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));


// Routes setup
app.use('/', appRoutes);


// Home route
app.get('/', (req, res) => {
  res.redirect('/admin')
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// module.exports = app; 
