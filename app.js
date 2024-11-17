const express = require("express");
const bodyParser = require('body-parser');
const userRoutes = require('./Routers/routes.js');
const rateLimit = require("express-rate-limit");
//const authMiddleware = require('./Middleware/authMiddleware.js');
const app = express();

require('./Mongoose/Db.js');

require("dotenv").config();
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).json({ success: true, msg: 'Welcome to the app....!' })
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: "Too many login attempts. Please try again after 15 minutes.",
  });

app.use('/api', userRoutes);
app.use('/api/login', loginLimiter);

const adminRoutes = require('./Routers/adminRoutes');
app.use('/api/admin', adminRoutes);


app.listen(3000, () => {
    console.log(`Server listening at http://localhost:3000`);
});