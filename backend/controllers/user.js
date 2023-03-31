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

        res.status(201).json({success:true,user});

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

    res.status(200).cookie("token",token)
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