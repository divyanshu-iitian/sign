import '../App.css';
import React, { useState, useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import groq from 'groq'; // Install groq using npm or yarn
import xbot from '../Models/xbot/xbot.glb';
import ybot from '../Models/ybot/ybot.glb';
import xbotPic from '../Models/xbot/xbot.png';
import ybotPic from '../Models/ybot/ybot.png';

const GROQ_API_KEY = "your-groq-api-key";  // Replace with your actual key

function AiAnimation() {
  const [bot, setBot] = useState(ybot);
  const [text, setText] = useState("");
  const componentRef = useRef({});
  const { current: ref } = componentRef;
  
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    ref.scene = new THREE.Scene();
    ref.scene.background = new THREE.Color(0xdddddd);

    const light = new THREE.SpotLight(0xffffff, 2);
    light.position.set(0, 5, 5);
    ref.scene.add(light);

    ref.renderer = new THREE.WebGLRenderer({ antialias: true });
    ref.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    ref.renderer.setSize(window.innerWidth * 0.57, window.innerHeight - 70);

    document.getElementById("canvas").innerHTML = "";
    document.getElementById("canvas").appendChild(ref.renderer.domElement);

    ref.camera.position.set(0, 1.4, 1.6);
    
    let loader = new GLTFLoader();
    loader.load(
      bot,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.type === 'SkinnedMesh') {
            child.frustumCulled = false;
          }
        });
        ref.avatar = gltf.scene;
        ref.scene.add(ref.avatar);
      },
      (xhr) => console.log(xhr)
    );

  }, [bot]);

  const handleChatbotResponse = async (input) => {
    try {
      const response = await groq.generate({
        apiKey: GROQ_API_KEY,
        prompt: input,
        model: "text-davinci-003",
      });
      setText(response.text);
    } catch (error) {
      console.error("Groq API Error:", error);
    }
  };

  const startListening = () => SpeechRecognition.startListening({ continuous: true });
  const stopListening = () => SpeechRecognition.stopListening();

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-3'>
          <label className='label-style'>Processed Text</label>
          <textarea rows={3} value={text} className='w-100 input-style' readOnly />

          <label className='label-style'>Speech Recognition: {listening ? 'on' : 'off'}</label>
          <div className='space-between'>
            <button className="btn btn-primary w-33" onClick={startListening}>
              Mic On <i className="fa fa-microphone" />
            </button>
            <button className="btn btn-primary w-33" onClick={stopListening}>
              Mic Off <i className="fa fa-microphone-slash" />
            </button>
            <button className="btn btn-primary w-33" onClick={resetTranscript}>
              Clear
            </button>
          </div>

          <textarea rows={3} value={transcript} className='w-100 input-style' readOnly />
          <button onClick={() => handleChatbotResponse(transcript)} className='btn btn-primary w-100 btn-style'>
            Send to Chatbot
          </button>

          <p className='bot-label'>Select Avatar</p>
          <img src={xbotPic} className='bot-image col-md-11' onClick={() => setBot(xbot)} alt='Avatar XBOT' />
          <img src={ybotPic} className='bot-image col-md-11' onClick={() => setBot(ybot)} alt='Avatar YBOT' />
        </div>

        <div className='col-md-7'>
          <div id='canvas' />
        </div>
      </div>
    </div>
  );
}

export default AiAnimation;
