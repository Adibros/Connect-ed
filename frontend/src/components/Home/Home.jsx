import React from 'react'
import "./Home.css"
import User from '../User/User'
import avatarimg from '../../avatar.jpg'
import Post from '../Post/Post'


const Home = () => {
  return (
    <div className='home'>
      <div className="homeleft">
        <Post 
        postImage="https://wallpapercave.com/dwp1x/wp6819375.jpg"
        ownerName="Aditya"
        caption="This is sample post"
        />
      </div>

      <div className="homeright">

        <User
              userId = {"user._id"}
              name={"Aditya"}
              avatar={avatarimg}
        />

      </div>
    </div>
  )
}

export default Home