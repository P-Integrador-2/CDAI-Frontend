import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import MyIcon from './assets/imageIcon.png'
import { RotatingSquare} from 'react-loader-spinner'

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [images, setImages] = useState([])
  const [progress, setProgress] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const constraints = {
    video: { width: 520, height: 340 },
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

  const handlePhotoClick = async () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 240, 160);

    // Convertir la imagen del canvas a un blob
    const blob = await new Promise(resolve => canvasRef.current.toBlob(resolve));

    if (images.length < 2) {
      setImages([...images, blob]);
    }
    else if (images.length === 2) {
      const dataImages = [...images, blob]
      setImages(dataImages);
      sendImages(dataImages)


    }
  };

  
  const handleResetClick = () => {
    setImages([]); // Establece el estado de las imágenes a un arreglo vacío
    setResponseData(false); //quita el mensaje
  };


  const sendImages = async (data) => {
    const formData = new FormData();
    data.forEach((element, index) => {
      formData.append(`imagen${index + 1}`, element);
    });

    try {
      setProgress(true); //inicia el loader
      const response = await axios.post("http://localhost:5000/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      setResponseData(response.data);
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }finally {
      setProgress(false); // Finaliza el loader
    }
  };


  useEffect(() => {
    getVideo()
  }, [])

  return (

    <Box sx={{ maxWidth: '100%' }}>

      <header>
        <AppBar position="static">
          <Toolbar variant="dense" style={{backgroundColor:'#e5fffa', height:'70px'}}>
            <IconButton edge="start" color="inherit" aria-label="menu" >
            <img src={MyIcon} alt="My Icon" style={{ width: '60px', height: '60px' }} />
            </IconButton>
            <Typography variant="h6" color="#00a388" component="div">
              AFOROWISE
            </Typography>
          </Toolbar>
        </AppBar>
      </header>

      <Container sx={{ display: 'flex', justifyContent: 'center', minWidth: '100%' }}>

        <section className="cam-container">
          <Box sx={{ display: 'flex', justifyContent: 'center', m: 1 }} >
            <Typography variant='h3' color="#00a388">
              Smart capacity counting
            </Typography>
          </Box>

          

          <Box sx={{ display: 'flex', justifyContent: 'center', m: 4 }} >
          <div style={{ border: '3px solid #00a388',backgroundColor:'#000000', borderRadius: '8px', overflow: 'hidden', width: '520px', height: '340px' }}>
          {progress && (
              <div style={{ backgroundColor:'rgb(15,15,15)', position: 'absolute', width: '520px', height: '340px'}}>
                <RotatingSquare   height="80"  width="80" color="#00a388"   ariaLabel="loading"  wrapperStyle={{marginLeft:'43%', marginTop:'25%'}}  wrapperClass="" visible={true}/>
              </div>
            )}
          {!progress && responseData && (
            <div style={{ backgroundColor:'#FFFFFF', position: 'absolute', width: '520px', height: '340px'}}>
              <Typography variant="h5" color="#00a388" marginLeft='31%' marginTop='25%'>
                Namber of people: {responseData.promedio_respuestas}
               </Typography>
            </div>
          )}  
            <video className="video" ref={videoRef}></video>

          </div>
          </Box>
          <div className="canvas-wrap" style={{ display: 'none' }}>
            <canvas className="canvas" width="240" height="160" ref={canvasRef}></canvas>
          </div>
          <Box sx={{ display: 'flex', justifyContent: 'center', m: 4 }}>
            <Button variant='contained' onClick={handlePhotoClick} style={{backgroundColor:'#00a388'}}>Take a Photo</Button>
            <Button variant='contained'  onClick={handleResetClick} style={{backgroundColor:'#ff5362', marginLeft:'8px'}}>Reset</Button>
          </Box>

          
          
        </section>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 2 }}>
          {
            images.length !== 0 ?
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                {images.map((blob, i) => (
                  <img src={URL.createObjectURL(blob)} className="photo" alt={`Image ${i}`} key={i} />
                ))}
              </Box>
              :
              <></>
          }
          </Box>

      </Container>
    </Box>





  );
}

export default App;