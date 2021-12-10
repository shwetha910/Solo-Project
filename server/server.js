const path = require('path');
const express = require('express');

const PORT = 3000;
const app = express();

// /**
//  * handle parsing request body
//  */
//  app.use(express.json());
//  app.use(express.urlencoded({ extended: true }));
 
//  /**
//   * handle requests for static files
//   */
//  app.use(express.static(__dirname+ '/server'));

//  app.get('/',(req,res)=>{
//     res.send({working:true})
//  });
/**
 * start server
 */
app.listen(PORT, () => {
console.log(`Server listening on port: ${PORT}...`);
});

// module.exports = app;