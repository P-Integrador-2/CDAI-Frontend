import React, { useEffect, useRef } from 'react';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const photoRef = useRef(null);

  const constraints = {
    video: { width: 420, height: 340 },
    audio: false,
  };

  const getVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleSuccess(stream);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSuccess = (stream) => {
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  };

  const handlePhotoClick = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 420, 340);
    const data = canvasRef.current.toDataURL('image/png');
    photoRef.current.src = data;
  };

  useEffect(()=> {
    getVideo()
  },[])

  return (
    <div className="App">
      <header>CDAI Video</header>
      <section className="cam-container">
        <div className="video-wrap">
          <video className="video" ref={videoRef}></video>
        </div>
        <div className="canvas-wrap">
          <canvas className="canvas" width="420" height="340" ref={canvasRef}></canvas>
          <img src="" className="photo" alt="photo" ref={photoRef} />
        </div>
        <div>
          <button className="start-btn" onClick={handlePhotoClick}>PHOTO</button>
        </div>
      </section>
    </div>
  );
}

export default App;