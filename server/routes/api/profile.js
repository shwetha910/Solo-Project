const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/childModel');

//GET logged in user profile api/profile/me
//access Private
router.get('/me',auth,async(req,res) =>{

    try {
       const profile = await User.findById(req.user.id); 
       if(!profile){
           return res.status(400).json({msg:'No profile for this user'});
       }
       return res.json(profile);
    } catch (error) {
        console.log(error);
    }
});

//delete profile and posts of the user

router.delete('/',auth,async(req,res) =>{

    try {
        await User.findByIdAndRemove(req.user.id); 
        return res.json('User deleted');

    } catch (error) {
        console.log(error);
    }
});
module.exports = router;