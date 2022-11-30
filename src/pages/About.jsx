import React, { useEffect } from 'react'; 
import '../App.css'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import MyNav from "../components/MyNav"; 
 
 
 
function About() { 
  return ( 
 
    <div className='App'> 
      <MyNav /> 
      <div > 
 
        <h2>описание</h2> 
        <br /> 
        Данный продукт разработан командой MISIShunters и призван облегчить рутинный процесс отслеживания посещаемости студентов на занятиях как для преподавателей, так и для самих учащихся. 
        <br /> 
        <a href="https://t.me/MomIamOnLessonBot" target="_blank" draggable="false" display="false"> 
          <img src="tg_logo.svg" className="logo " draggable="false" width="100px" float="left" /> 
        </a> 
      </div> 
      <table className="table1"> 
        <tr> 
          <td> 
            <a href="https://t.me/NeAlyssa" target="_blank" draggable="false" display="false"> 
              <img src={process.env.PUBLIC_URL + "/alisa.png"} className='left' draggable="false" width="100%" float="left" /> 
            </a> 
          </td> 
          <td> 
            <a href="https://t.me/BurykinaA" target="_blank" draggable="false" display="false"> 
              <img src={process.env.PUBLIC_URL + "/alina.png"} className='left' draggable="false" width="100%" float="left" /> 
            </a> 
          </td> 
          <td> 
            <a href="https://t.me/t0efL" target="_blank" draggable="false" display="false"> 
              <img src={process.env.PUBLIC_URL + "/vadim.png"} className='left' draggable="false" width="100%" float="left" /> 
            </a> 
          </td> 
          <td> 
            <a href="https://t.me/said_azizov" target="_blank" draggable="false" display="false"> 
              <img src={process.env.PUBLIC_URL + "/said.png"} className='left' draggable="false" width="100%" float="left" /> 
            </a> 
          </td> 
          <td> 
 
            <a href="https://t.me/kokosikEH" target="_blank" draggable="false" display="false"> 
              <img src={process.env.PUBLIC_URL + "/liza.png"} className='left' draggable="false" width="100%" float="left" /> 
            </a> 
          </td> 
        </tr> 
      </table> 
    </div> 
 
  ); 
}; 
 
export default About;