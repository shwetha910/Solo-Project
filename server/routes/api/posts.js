const express = require('express');
const router = express.Router();
const {check,validationResult} =require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/childModel');
const Post = require('../../models/postModel');

//posts post
router.post('/',auth,[
        check('text','Text is required').not().isEmpty()
    ],
async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        //const post = await Post.findById(req.params.id);
  
        const newPost = new Post({
          text: req.body.text,
          name: user.parent,
          user: req.user.id
        });
        const post = await newPost.save();
        // post.comments.unshift(newComment);
  
        // await post.save();
  
        res.json(post);

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

//GET api/posts
//access Private
router.get('/',auth, async(req,res) =>{
    try {
        const posts = await Post.find().sort({date:-1});
        res.json(posts);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//GET api/posts/:id
//access Private
router.get('/:id',auth, async(req,res) =>{
    try {
        const posts = await Post.findById(req.params.id);
        if(!posts){
            return res.status(400).json('posts not found');
        }
        res.json(posts);
    } catch (error) {
        if(error.kind === 'ObjectID'){
            return res.status(400).json('posts not found');
        }
        res.status(500).send('Server Error');
    }
});

//Delete api/posts
//access Private
router.delete('/:id',auth, async(req,res) =>{
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
          }
      
        //check on the user
        if(post.user.toString() !== req.user.id){
            return res.status(400).json('user not authorized');
        }

        await post.remove();
        res.json('post deleted');

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;