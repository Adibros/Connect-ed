const User = require("../model/user");

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