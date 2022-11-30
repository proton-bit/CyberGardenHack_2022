import React from 'react'
import '../App.css'
import Face from "../Face";
import MyNav from "../components/MyNav";

function Home() {


  return (
    <div className="App" >
       <MyNav/>

      <Face/>
    </div>
  )
}

export default Home