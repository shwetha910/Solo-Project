const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check,validationResult} = require('express-validator');

const User = require('../../models/Child');

//POST api/child
//access Public
//Register Child data
//refer : https://express-validator.github.io/docs/5.3.1/check-api.html
//refer : https://express-validator.github.io/docs/

router.post('/',[
    check('child','Child\'s name is required').not().isEmpty(),
    check('parent','Parent\'s name is required').not().isEmpty(),
    check('email','Invalid email ').isEmail(),
    check('password','password should be 6 or more charecters').isLength({min:6})
],
async (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let {child,gender,parent,email,password} =req.body;

    try {
        let user = await User.Users.findOne({email});

        if(user){
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }
            //user = new User({child,gender,parent,email,password});
            //console.log(user,"user");
            const salt = await bcrypt.genSalt(10);
            console.log(salt, typeof salt, "salt --- 10");
    
            //user.password = await bcrypt.hash(password, salt);
            password = await bcrypt.hash(password, salt);
            //console.log(password);
            await User.Users.create({child,gender,parent,email,password});
            //await  user.save();
            return res.send('child record registered');

    } catch (error) {
        console.error(error,"server error creating document");
        return res.status(500).send('Server error');
    }
    
});

module.exports = router;