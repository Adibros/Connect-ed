const User = require("../model/user");
const Post = require("../model/post");

exports.register = async(req,res) =>{
    try{
 
        const {name,email,password} = req.body;
        let  user = await User.findOne({email});
        if(user){
            return res
            .status(400)
            .json({success:false, message:"User already exists"});
        }

        user = await User.create({
            name,
            email,
            password,
            avatar:{public_id:"sample_id",url:"sampleurl"}
        });

        const token = await user.generateToken(); 

    res
    .status(200)
    .cookie("token",token,{
        expires: new Date(Date.now() + 90*24*60*60*1000),
        httpOnly:true
    })
    .json({
        success:true,
        user,
        token
    })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.login = async(req,res) => {
    try {

    const{email,password} = req.body;


    //+password isliye kyunki is bar user compare krne k liye hum db se uska pass bhi manga rhe vrna 
    // default scheme define krte hue user ki password field ko humne select false kr rkha tha
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return res.status(400).json({
            success:false,
            message:"User don't exist"
        });
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return res.status(400).json({
            success:false,
            message:"Incorrect password"
        })
    }


    const token = await user.generateToken(); 

    res
    .status(200)
    .cookie("token",token,{
        expires: new Date(Date.now() + 90*24*60*60*1000),
        httpOnly:true
    })
    .json({
        success:true,
        user,
        token
    })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.logoutUser = async(req,res) =>{

    try {
        
        res
        .status(200)
        .cookie("token",null,{expires: new Date(Date.now()) , httpOnly:true})
        .json({
            success:true,
            message:"User logged Out"
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.updatePassword = async(req,res) =>{

    try{
        const user = await User.findById(req.user._id).select("+password");

        const {oldPassword,newPassword} = req.body;

        if(!oldPassword && !newPassword){
            return res.status(400).json({
                success:true,
                message:"Please Enter old and new Password"
            })
        }

        const isMatch = await user.matchPassword(oldPassword);

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect old password"
            })
        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({
            success:true,
            message:"Password changed"
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
    
}

exports.updateProfile = async(req,res) => {

    try {
        const user = await User.findById(req.user._id);

        const {name , email} = req.body;

        if(name){
            user.name = name;
        }

        if(email){
            user.email = email;
        }
        
        await user.save();

        res.status(200).json({
            success:true,
            message:"Profile updated"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


exports.followUser = async(req,res) => {
    try{

        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);

        if(!userToFollow){
            return res.status(400).json({
                success:false,
                message:"User doesn't exist"
            })
        }

        if(loggedInUser.following.includes(req.params.id)){
            const followingindex = loggedInUser.following.indexOf(req.params.id);
            const followerindex = userToFollow.followers.indexOf(req.user._id);

            loggedInUser.following.splice(followingindex,1);
            userToFollow.followers.splice(followerindex,1); 

            await loggedInUser.save();
            await userToFollow.save();

            res.status(200).json({
                success:true,
                message:"User unfollowed"
            })

        }else{
            loggedInUser.following.push(req.params.id);
            userToFollow.followers.push(req.user._id);

            await loggedInUser.save();
            await userToFollow.save();

            res.status(200).json({
                success:true,
                message:"User followed"
            })
        }
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.deleteUser = async(req,res) => {

    try {
        
        const user = await User.findById(req.user._id);
        const posts = user.posts;

        const followers = user.followers;
        const following = user.following;
        const userId = req.user._id;

        await user.deleteOne();

        //logging out
        res.cookie("token",null , {
            expires: new Date(Date.now()) , 
            httpOnly:true
        })

        //deleting their posts
        for(let i=0; i<posts.length ; i++){
            const post = await Post.findById(posts[i]);
            await post.deleteOne();
        }

        //removing user from followers following
        for(let i =0;i<followers.length;i++){
            const user = await User.findById(followers[i]);

            const index = user.following.indexOf(userId);
            user.following.splice(index,1);

            await user.save();
        }

        //removing user from following followers
        for(let i =0;i<following.length;i++){
            const user = await User.findById(following[i]);

            const index = user.followers.indexOf(userId);
            user.followers.splice(index,1);

            await user.save();
        }

        res.status(200).json({
            success:true,
            message:"User Deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}