import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';


function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [images, setImages] = useState([])

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

  const handlePhotoClick = async () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 420, 340);

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

  const sendImages = async (data) => {
    const formData = new FormData();
    data.forEach((element, index) => {
      formData.append(`imagen${index + 1}`, element);
    });

    try {
      const response = await axios.post("http://localhost:5000/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };


  useEffect(() => {
    getVideo()
  }, [])

  return (

    <Box sx={{ maxWidth: '100%' }}>

      <header>
        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div">
              Photos
            </Typography>
          </Toolbar>
        </AppBar>
      </header>

      <Container sx={{ display: 'flex', justifyContent: 'center', minWidth: '100%' }}>

        <section className="cam-container">
          <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }} >
            <Typography variant='h3'>
              Conteo de aforo inteligente
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', m: 4 }} >
            <video className="video" ref={videoRef}></video>
          </Box>
          <div className="canvas-wrap" style={{ display: 'none' }}>
            <canvas className="canvas" width="400" height="320" ref={canvasRef}></canvas>
          </div>
          <Box sx={{ display: 'flex', justifyContent: 'center', m: 4 }}>
            <Button variant='contained' onClick={handlePhotoClick}>Take a Photo</Button>

          </Box>

          {
            images.length !== 0 ?
              <Box sx={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
                {images.map((blob, i) => (
                  <img src={URL.createObjectURL(blob)} className="photo" alt={`Image ${i}`} key={i} />
                ))}
              </Box>
              :
              <></>
          }
        </section>

      </Container>
    </Box>





  );
}

export default App;