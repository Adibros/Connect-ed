import React from 'react'
import './Login.css'
import { Typography,Button} from "@mui/material"
import {Link} from "react-router-dom"

const Login = () => {
  return (
    <div className='login'>

        <form className='loginForm'>

            <Typography variant='h3' style={{padding:'2vmax'}}>Connect-ed</Typography>
            <input type="email" placeholder='Email' required/>
            <input type="password" placeholder='Password' required/>

            <Link to="/forgot/password">
                <Typography>Forgot password?</Typography>
            </Link>

            <Button type='submit'>Login</Button>

            <Link to="/register">
                <Typography>New User?</Typography>
            </Link>
        </form>
    </div>
  )
}

export default Login