const Post = require('../model/post');
const User = require('../model/user');

exports.createPost = async(req,res) => {

    try{

        const newPostData = {
            caption:req.body.caption,
            image:{
                public_id:"req.body.public_id",
                url:"req.body.url"
            },
            owner:req.user._id
        }

        const newPost = await Post.create(newPostData);

        const user = await User.findById(req.user._id);

        user.posts.push(newPost._id);

        await user.save();
        
        res.status(201).json({
            success:true,
            post: newPost
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.likeAndUnlikePost = async(req,res) => {

    try {
        
        const post = await Post.findById(req.params.id);

        console.log(post.likes);
        
        if(!post){
            res.status(404).json({
                success:false,
                message:"Post not found"
            });
        }

        console.log(req.user._id);

        //if already liked then dislike
        if(post.likes.includes(req.user._id)){
            const index = post.likes.indexOf(req.user._id);

            

            post.likes.splice(index,1);     //iss position se start krte hue ek element hta de

            await post.save();

            res.status(200).json({
                success:true,
                message:"Post unliked"
            });
        }else{
            
            post.likes.push(req.user._id);
            await post.save();

            res.status(200).json({
                success:true,
                message:"Post liked"
            });

        }
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}