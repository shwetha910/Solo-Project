const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/childModel');

//GET api/auth
//access Private
router.get('/',
auth,
async (req,res) =>{
    try {
        const user = await User.Users.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }

});


//verify login details and return jwt token 

router.post('/',[
    check('email','Invalid email ').isEmail(),
    check('password','Password is required').exists()
],
async (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password} =req.body;
    console.log(req.body , "body");
    try {
        let user = await User.Users.findOne({email});
        console.log(user, "user user user");
        if(!user){
            return res.status(400).json({ errors: [{ msg: 'Invalid email or password' }] });
        }

        const matchPassword = await bcrypt.compare(password,user.password);
        
        if(!matchPassword){
            return res.status(400).json({ errors: [{ msg: 'Invalid email or password' }] });
        }
        
        const temp = await User.Users.find({email},{_id:1});

        const payload ={
            user:{
                // id:temp
                id:user.id
            }
        }

        jwt.sign(payload,
            config.get('jwtSecret'),
            {expiresIn: '10 days'},
            (err,token)=>{
                if(err) throw err;
                res.json({token});
        });

    } catch (error) {
        console.error(error,"server error creating document");
        return res.status(500).send('Server error');
    }
    
});

module.exports = router;