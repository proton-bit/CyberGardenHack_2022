import { FaceMesh } from "@mediapipe/face_mesh";
import {
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_RIGHT_IRIS,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_LEFT_IRIS,
  FACEMESH_FACE_OVAL,
  FACEMESH_LIPS,
  FACEMESH_TESSELATION,
} from "@mediapipe/face_mesh";
import React, { useRef, useEffect, useState } from "react";
import * as cam from "@mediapipe/camera_utils";
import { drawConnectors } from "@mediapipe/drawing_utils";
import Webcam from "react-webcam";
import './App.css';
import "./components/style.css";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';


class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
        <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control type="login" placeholder="ФИО" name="login"/>
          </Form.Group>
    
          <Button variant="secondary" type="submit" name="presence" value="{{dieTime}}">
            Submit
          </Button>
        </Form>
    );
  }
}

function Toggle({ toggled, onClick }) {
  return (
      <div onClick={onClick} className={`toggle${toggled ? " night" : ""}`}>
          <div className="notch">
              <div className="crater" />
              <div className="crater" />
          </div>
          <div>
              <div className="shape sm" />
              <div className="shape sm" />
              <div className="shape md" />
              <div className="shape lg" />
          </div>
      </div>
  );
}

var eventsHistory = [];
var prevState = false;

function Face() {
  const webcamRef = useRef(null);
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMeshRef = useRef(null);
  const incrementRef = useRef(null);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [draww, setDraww] = useState(false);
  const [timer, setTimer] = useState(0);
  var time_over = false;
  var person_exists = false;
  var date_person_here = new Date();
  var time_person_left = 0;
  const [timePersonLeft, setTimePersonLeft] = useState(0);
  const [dieTime, setDieTime] = useState(5);
  const [check, setCheck] = useState("disabled");

  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)


  const handleStart = () => {
    if (aiEnabled) {
      if (incrementRef.current) clearInterval(incrementRef.current);
      setTimer(0);
      setIsActive(false)
      setIsPaused(false)
    } else {
      setIsActive(true)
      setIsPaused(true)
      incrementRef.current = setInterval(() => {
        setTimer((timer) => timer + 1)
      }, 1000)
    }

    console.log("handleStart ${aiEnabled}")
    setAiEnabled((aiEnabled) => !aiEnabled)
  }

  const changeDraw = () => {
    setDraww((draww) => !draww);
  }

  function inc(time_elapsed) {
    setTimePersonLeft(timePersonLeft + time_elapsed)
  }
  function dec(time_elapsed) {
    setDieTime(dieTime - time_elapsed)

  }
  function nul(a) {
    if (a) {
      setTimePersonLeft(0);


    }
  }



  function checking(person_detected) {
    person_detected ? setCheck("✅") : setCheck("❌"); 
  }

  const formatTime = (timers) => {
    const getSeconds = `0${(timers % 60)}`.slice(-2)
    const minutes = `${Math.floor(timers / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timers / 3600)}`.slice(-2)

    return `${getHours} : ${getMinutes} : ${getSeconds}`
  }

  function msToSec(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60)
    return seconds;
  }

  useEffect(() => {
    const onResults = (results) => {

      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      if (results.multiFaceLandmarks && aiEnabled) {
        if (results.multiFaceLandmarks.length) {
          if (!prevState) {
            prevState = !prevState;
            eventsHistory.push(new Date());
          }
          person_exists = true;
          if (draww) {
            for (const landmarks of results.multiFaceLandmarks) {
              drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
              drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: '#ac30ff' });
              drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, { color: '#ac30ff' });
              drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, { color: '#ac30ff' });
              drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: '#30b3ff' });
              drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, { color: '#30b3ff' });
              drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, { color: '#30b3ff' });
              drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0' });
              drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: '#E0E0E0' });
            }
          }
          // console.log(draww)
          // setTimePersonLeft(0);
          date_person_here = new Date();
        } else {
          time_person_left = new Date() - date_person_here
          person_exists = false;

          if (prevState) {
            prevState = !prevState;
            eventsHistory.push(new Date());
            for (const date of eventsHistory) {
              console.log(date)
            }
            console.log(" ");
          }

        }
        inc(msToSec(time_person_left));
        dec(msToSec(time_person_left));
        checking(person_exists);


      }
      canvasCtx.restore();

    }

    if (aiEnabled) {
      if (faceMeshRef.current) {
        console.log(faceMeshRef.current)
        faceMeshRef.current.onResults(onResults)
      }
      else {
        const faceMesh = new FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          },
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,

        });

        faceMesh.onResults(onResults);

        faceMeshRef.current = faceMesh;
      }
      if (cameraRef.current) {
        cameraRef.current.h.onFrame = async () => {
          await faceMeshRef.current.send({ image: webcamRef.current.video });
        }
      } else {
        const camera = new cam.Camera(webcamRef.current.video, {
          onFrame: async () => {
            await faceMeshRef.current.send({ image: webcamRef.current.video });
          },
          width: 480,
          height: 640,
        });
        camera.start();
        cameraRef.current = camera;
      }
    } else {
      console.log("turning off")

      if (cameraRef.current) {
        cameraRef.current.h.onFrame = () => {
          const videoWidth = webcamRef.current.video.videoWidth;
          const videoHeight = webcamRef.current.video.videoHeight;

          // Set canvas width
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          const canvasElement = canvasRef.current;
          const canvasCtx = canvasElement.getContext("2d");
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          canvasCtx.drawImage(
            webcamRef.current.video,
            0,
            0,
            canvasElement.width,
            canvasElement.height
          );
        };
        
        setCheck("disabled")
      }
    }


  }, [aiEnabled, draww]);

  useEffect(() => {

  }, [])

  return ( 
    <div className="centered"> 
    
    <br/><br/><br/><br/><br/>
      <table className="table2" > 
        <tbody> 
          <tr> 
            <td className="td1"> 
              <a>all time</a> 
            </td> 
            <td className="td1"> 
              <a>time skipped</a> 
            </td> 
            <td className="td1"> 
              <a>proctoring</a> 
            </td> 
          </tr> 
          <tr> 
            <td className="td1"> 
              <a>{formatTime(timer)}</a> 
            </td >  
            <td className="td1"> 
              <a>{formatTime(timePersonLeft)}</a> 
            </td> 
            <td className="td1"> 
              <a>{check}</a> 
            </td> 
          </tr> 
        </tbody> 
      </table> 
 
      <div className="mirror"> 
        <Webcam 
          ref={webcamRef} 
          style={{ 
            margin: "auto", 
            position: "static", 

            marginTop: 40, 
            left: 0, 
            right: 0, 
            opacity: 100, 
            textAlign: "center", 
            zIndex: 9, 
            width: 480, 
            height: 640, 
            borderRadius: 10, 
          }} 
        /> 
        <canvas 
          ref={canvasRef} 
          className="output_canvas" 
          style={{ 
            margin: "auto", 
            position: "absolut", 
 
            marginTop: -1000, 
            marginBottom: 22,
            left: 0, 
            right: 0, 
            opacity: 100, 
            textAlign: "center", 
            zIndex: 9, 
            width: 480, 
            height: 640, 
            borderRadius: 10, 
          }} 
        /> 
 
 
      </div> 
 
      <div style={ 
          { 
            display: "flex", 
            justifyContent: "space-evenly", 
            marginTop: "10px", 
            marginBottom: "10px" 
          } 
        }> 
             {
            !isActive && !isPaused ?
            <Button variant="dark" style={{ 
              fontSize: '40px', width: 300, 
            }} onClick={handleStart}>Start</Button> 
              : (
                <Button variant="dark" style={{ 
                  fontSize: '40px', width: 300, 
                }} onClick={handleStart}>Stop</Button> 
              )
          }
 
          <div 
            style={{ 
              display: "flex", 
              fontSize: '30px', 
              alignItems: "center" 
            }} 
          > 
            
              <Toggle toggled={draww} onClick={changeDraw} /> 
          </div> 
        </div>
        {/* <LoginForm></LoginForm> */}
        <Form name="person">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control type="login" placeholder="ФИО" name="name"/>
          </Form.Group>
          <input type="text" name="presence" value={dieTime} style={{opacity: 0,}}></input>
          <Button variant="dark" type="submit">
            Submit
          </Button>
        </Form>
        
    </div > 
  ); 
} 
 
export default Face;