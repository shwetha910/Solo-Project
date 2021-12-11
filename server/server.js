const path = require('path');
const express = require('express');
const connectDB = require('../config/db');
const PORT = process.env.PORT || 3000;
const app = express();


//connect Datatbase 
connectDB();

/**
 * handle parsing request body
 */
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 
//  /**
//   * handle requests for static files
//   */
//  app.use(express.static(__dirname+ '/server'));

 app.get('/',(req,res)=> {
    res.send('API running');
 });

//Define Routes
 app.use('/api/child',require('./routes/api/child'));
 app.use('/api/posts',require('./routes/api/posts'));
 app.use('/api/profile',require('./routes/api/profile'));
 app.use('/api/auth',require('./routes/api/auth'));
 
/**
 * start server
 */
app.listen(PORT, () => {
console.log(`Server listening on port: ${PORT}...`);
});

// module.exports = app;