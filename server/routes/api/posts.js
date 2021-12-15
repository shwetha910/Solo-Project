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
      
        //check if the user can delete the post
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

// post likes by id 
//private

router.put('/like/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        //check if the post has been liked by user already
        if(post.likes.filter(like=>like.user.toString() === req.user.id).length >0){
            return res.status(400).json({msg:'Post already liked'})
        }

        post.likes.unshift({user: req.user.id});

        await post.save();

        res.json(post.likes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// post unlike by id 
//private

router.put('/unlike/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        //check if the post has been liked only then you can unlike
        if(post.likes.filter(like=>like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({msg:'Post not liked yet'})
        }

        const removeIndex = post.likes.map(like =>like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex,1);

        await post.save();

        res.json(post.likes);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//add comment/:id

router.post('/comment/:id',auth,[
    check('text','Text is required').not().isEmpty()
],
async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
}

try {
    const user = await User.findById(req.user.id).select('-password');
    const getPost = await Post.findById(req.params.id);

    const newComment = ({
      text: req.body.text,
      name: user.parent,
      user: req.user.id
    });
    getPost.comments.unshift(newComment);

    await getPost.save();

    res.json(getPost);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
);

//delete comment 
router.delete('/comment/:id/:comment_id',
auth,
async(req,res)=>{
    try {
        //console.log(req.params.id, 'params id');
        const post =  await Post.findById(req.params.id);
        //console.log(post, 'post');
        //fetch comment 
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        //console.log(comment, 'comment');
        if(!comment){
            return res.status(400).json({msg: "no comment found"});
        }

        if(comment.user.toString() !== req.user.id){
            return res.status(400).json({msg: "User not authorized"});
        }

        const removeIndex = post.comments.map(comment =>comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeIndex,1);

        await post.save();

        res.json(post.comments);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;