import { Box, Container, AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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

  const handlePhotoClick = () => {
    
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 420, 340);
    const data = canvasRef.current.toDataURL('image/png');

    if(images.length < 3 ){
      setImages([...images, data]);
    }
    
  };

  useEffect(()=> {
    getVideo()
  },[])

  return (

    <Box sx={{maxWidth: '100%'}}>

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

      <Container sx={{ display: 'flex', justifyContent: 'center', minWidth: '100%'}}>
     
      <section className="cam-container">
      <Box sx={{display: 'flex', justifyContent: 'center', m: 2}} >
        <Typography variant='h3'>
            Conteo de aforo inteligente
          </Typography>
        </Box>
        
        <Box sx={{display: 'flex', justifyContent: 'center', m: 4}} >
          <video className="video" ref={videoRef}></video>
        </Box>
        <div className="canvas-wrap" style={{display: 'none'}}>
          <canvas className="canvas" width="400" height="320" ref={canvasRef}></canvas>
          {console.log(images)}
        </div>
        <Box sx={{display: 'flex', justifyContent: 'center', m: 4}}>
          <Button variant='contained' onClick={handlePhotoClick}>Take a Photo</Button>

        </Box>
        
        { 
        images.length !== 0 ?
        <Box sx={{display: 'flex', gap: '30px', justifyContent: 'center'}}>
          {images.map(img => 
          <img src={img} width="200px" className="photo" alt="photo" />  
          )}
        </Box>
        :
        <></>
        }
       
        
        {console.log(images)}
      </section>

      </Container>
    </Box>
    
      
      
    
    
  );
}

export default App;