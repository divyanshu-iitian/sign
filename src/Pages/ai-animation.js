import '../App.css';
import React, { useState, useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import xbot from '../Models/xbot/xbot.glb';
import ybot from '../Models/ybot/ybot.glb';
import xbotPic from '../Models/xbot/xbot.png';
import ybotPic from '../Models/ybot/ybot.png';

const GEMINI_API_KEY = "AIzaSyAwTMmorr3STe-rcInZSmCQ3gUGMc5jq4M"; // Replace with your actual Gemini API key

function AiAnimation() {
  const [bot, setBot] = useState(ybot);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const componentRef = useRef({});
  const { current: ref } = componentRef;
  
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // Animation mappings for sign language gestures
  const animationMap = {
    'hello': 'wave',
    'goodbye': 'wave',
    'thank you': 'thank',
    'please': 'please',
    'yes': 'nod',
    'no': 'shake',
    'help': 'help',
    'sorry': 'sorry',
    'love': 'heart',
    'happy': 'smile',
    'sad': 'sad',
    'angry': 'angry',
    'surprise': 'surprise',
    'question': 'question',
    'understand': 'understand',
    'don\'t understand': 'confused',
    'good': 'thumbs_up',
    'bad': 'thumbs_down',
    'water': 'drink',
    'food': 'eat',
    'home': 'home',
    'work': 'work',
    'family': 'family',
    'friend': 'friend',
    'money': 'money',
    'time': 'time',
    'today': 'today',
    'tomorrow': 'tomorrow',
    'yesterday': 'yesterday'
  };

  useEffect(() => {
    initializeScene();
  }, [bot]);

  const initializeScene = () => {
    ref.scene = new THREE.Scene();
    ref.scene.background = new THREE.Color(0xdddddd);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    ref.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 5);
    directionalLight.castShadow = true;
    ref.scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 5, 5);
    ref.scene.add(spotLight);

    ref.renderer = new THREE.WebGLRenderer({ antialias: true });
    ref.renderer.shadowMap.enabled = true;
    ref.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    ref.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    ref.renderer.setSize(window.innerWidth * 0.57, window.innerHeight - 70);

    document.getElementById("canvas").innerHTML = "";
    document.getElementById("canvas").appendChild(ref.renderer.domElement);

    ref.camera.position.set(0, 1.4, 1.6);
    
    loadAvatar();
  };

  const loadAvatar = () => {
    let loader = new GLTFLoader();
    loader.load(
      bot,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.type === 'SkinnedMesh') {
            child.frustumCulled = false;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        // Remove previous avatar if exists
        if (ref.avatar) {
          ref.scene.remove(ref.avatar);
        }
        
        ref.avatar = gltf.scene;
        ref.scene.add(ref.avatar);
        
        // Store animations if available
        if (gltf.animations && gltf.animations.length > 0) {
          ref.mixer = new THREE.AnimationMixer(ref.avatar);
          ref.animations = {};
          
          gltf.animations.forEach((clip) => {
            ref.animations[clip.name] = ref.mixer.clipAction(clip);
          });
        }
        
        // Start render loop
        animate();
      },
      (xhr) => console.log(xhr),
      (error) => console.error('Error loading avatar:', error)
    );
  };

  const animate = () => {
    requestAnimationFrame(animate);
    
    if (ref.mixer) {
      ref.mixer.update(0.016); // 60 FPS
    }
    
    if (ref.renderer && ref.scene && ref.camera) {
      ref.renderer.render(ref.scene, ref.camera);
    }
  };

  const playAnimation = (animationName) => {
    if (ref.animations && ref.animations[animationName]) {
      // Stop current animation
      if (currentAnimation) {
        ref.animations[currentAnimation].stop();
      }
      
      // Play new animation
      const action = ref.animations[animationName];
      action.reset();
      action.play();
      setCurrentAnimation(animationName);
      
      // Stop animation after it completes
      setTimeout(() => {
        if (action) {
          action.stop();
        }
        setCurrentAnimation(null);
      }, 3000); // Increased duration for better visibility
    } else {
      // Fallback: If animation not found, create basic gesture
      console.log(`Animation '${animationName}' not found, using fallback gesture`);
      createFallbackGesture(animationName);
    }
  };

  const createFallbackGesture = (gestureType) => {
    if (!ref.avatar) return;
    
    // Basic avatar movement for common gestures
    const avatar = ref.avatar;
    const originalPosition = avatar.position.clone();
    const originalRotation = avatar.rotation.clone();
    
    switch (gestureType) {
      case 'wave':
        // Simple wave motion
        avatar.rotation.z = Math.sin(Date.now() * 0.01) * 0.1;
        break;
      case 'nod':
        // Simple nod motion
        avatar.rotation.x = Math.sin(Date.now() * 0.02) * 0.1;
        break;
      case 'shake':
        // Simple shake motion
        avatar.rotation.y = Math.sin(Date.now() * 0.03) * 0.1;
        break;
      default:
        // Default idle motion
        avatar.position.y = originalPosition.y + Math.sin(Date.now() * 0.001) * 0.02;
    }
    
    // Reset to original position after animation
    setTimeout(() => {
      avatar.position.copy(originalPosition);
      avatar.rotation.copy(originalRotation);
    }, 2000);
  };

  const getSignLanguageAnimation = (text) => {
    const lowerText = text.toLowerCase();
    
    // Check for exact matches first
    for (const [key, animation] of Object.entries(animationMap)) {
      if (lowerText.includes(key)) {
        return animation;
      }
    }
    
    // Default animation based on context
    if (lowerText.includes('?')) return 'question';
    if (lowerText.includes('!')) return 'surprise';
    if (lowerText.match(/\b(good|great|excellent|wonderful)\b/)) return 'thumbs_up';
    if (lowerText.match(/\b(bad|terrible|awful)\b/)) return 'thumbs_down';
    if (lowerText.match(/\b(hi|hey|greetings)\b/)) return 'wave';
    if (lowerText.match(/\b(bye|farewell|see you)\b/)) return 'wave';
    
    return 'idle'; // Default neutral gesture
  };

  const handleGeminiResponse = async (input) => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful assistant for sign language communication. Please provide a concise, simple response (maximum 2-3 sentences) suitable for sign language interpretation. Use basic vocabulary and clear expressions. User said: "${input}"`
            }]
          }],
          generationConfig: {
            maxOutputTokens: 100,
            temperature: 0.7,
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Details:", errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      
      if (data.candidates && data.candidates.length > 0) {
        const responseText = data.candidates[0].content.parts[0].text;
        
        setText(responseText);
        
        // Get appropriate sign language animation
        const animationName = getSignLanguageAnimation(responseText);
        playAnimation(animationName);
        
        // Add text-to-speech with slight delay for better sync
        setTimeout(() => {
          speakResponse(responseText);
        }, 500);
      } else {
        throw new Error("No valid response from Gemini API");
      }
      
    } catch (error) {
      console.error("Gemini API Error:", error);
      setText(`Error: ${error.message}. Please check your API key and try again.`);
      playAnimation('sorry');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7; // Slower for better clarity
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Choose a suitable voice
      const voices = speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.includes('en'));
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      // Add speech events for better synchronization
      utterance.onstart = () => {
        console.log('Speech started');
      };
      
      utterance.onend = () => {
        console.log('Speech finished');
      };
      
      utterance.onerror = (error) => {
        console.error('Speech error:', error);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ 
      continuous: true, 
      language: 'en-US',
      interimResults: true
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleSendToAI = () => {
    if (transcript.trim()) {
      handleGeminiResponse(transcript);
      playAnimation('understand');
      // Auto-clear transcript after sending
      setTimeout(() => {
        resetTranscript();
      }, 1000);
    }
  };

  // Add keyboard shortcut for quick interaction
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && e.ctrlKey) {
        e.preventDefault();
        if (listening) {
          stopListening();
        } else {
          startListening();
        }
      }
      if (e.code === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        handleSendToAI();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [listening, transcript]);

  const handleAvatarChange = (newBot) => {
    setBot(newBot);
    setCurrentAnimation(null);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (ref.camera && ref.renderer) {
        ref.camera.aspect = window.innerWidth / window.innerHeight;
        ref.camera.updateProjectionMatrix();
        ref.renderer.setSize(window.innerWidth * 0.57, window.innerHeight - 70);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-3'>
          <div className="mb-3">
            <label className='label-style'>AI Response</label>
            <textarea 
              rows={4} 
              value={text} 
              className='w-100 input-style' 
              readOnly 
              placeholder="AI response will appear here..."
            />
          </div>

          <div className="mb-3">
            <label className='label-style'>
              Speech Recognition: {listening ? 'ON' : 'OFF'}
              {isProcessing && <span className="text-warning"> (Processing...)</span>}
            </label>
            <div className='space-between mb-2'>
              <button 
                className="btn btn-success w-33" 
                onClick={startListening}
                disabled={listening || isProcessing}
              >
                <i className="fa fa-microphone" /> Start
              </button>
              <button 
                className="btn btn-danger w-33" 
                onClick={stopListening}
                disabled={!listening}
              >
                <i className="fa fa-microphone-slash" /> Stop
              </button>
              <button 
                className="btn btn-warning w-33" 
                onClick={resetTranscript}
              >
                <i className="fa fa-refresh" /> Clear
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className='label-style'>Your Speech</label>
            <textarea 
              rows={3} 
              value={transcript} 
              className='w-100 input-style' 
              readOnly 
              placeholder="Your speech will appear here..."
            />
            <button 
              onClick={handleSendToAI} 
              className='btn btn-primary w-100 btn-style mt-2'
              disabled={!transcript.trim() || isProcessing}
            >
              {isProcessing ? (
                <>
                  <i className="fa fa-spinner fa-spin" /> Processing...
                </>
              ) : (
                <>
                  <i className="fa fa-paper-plane" /> Send to AI
                </>
              )}
            </button>
          </div>

          <div className="mb-3">
            <p className='bot-label'>Select Avatar</p>
            <div className="d-flex flex-column">
              <img 
                src={xbotPic} 
                className={`bot-image col-md-11 mb-2 ${bot === xbot ? 'border border-primary' : ''}`}
                onClick={() => handleAvatarChange(xbot)} 
                alt='Avatar XBOT'
                style={{ cursor: 'pointer' }}
              />
              <img 
                src={ybotPic} 
                className={`bot-image col-md-11 ${bot === ybot ? 'border border-primary' : ''}`}
                onClick={() => handleAvatarChange(ybot)} 
                alt='Avatar YBOT'
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>

          {currentAnimation && (
            <div className="alert alert-info">
              <small>Playing animation: {currentAnimation}</small>
            </div>
          )}
        </div>

        <div className='col-md-9'>
          <div id='canvas' style={{ border: '1px solid #ccc', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  );
}

export default AiAnimation;