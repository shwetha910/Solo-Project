const express = require('express');
const router = express.Router();

//GET api/child
//access Private
router.get('/',(req,res) =>res.send('posts route'));
module.exports = router;