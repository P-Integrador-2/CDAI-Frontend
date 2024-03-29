import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography, Grid, CardContent, Card, Dialog, DialogContent,TextField, Alert} from '@mui/material';
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
  const [openPopup, setOpenPopup] = useState(true);
  const [maxCapacity, setMaxCapacity] = useState('');
  
  const handleSaveClick = () => {
    // Validar si el valor ingresado es numérico
  const numericValue = parseFloat(maxCapacity);

  
  if (isNaN(numericValue) || !Number.isInteger(numericValue)|| (Number.isInteger(numericValue) && numericValue<0)) {
    // Mostrar mensaje de error si no es numérico
    alert('Ingrese un numérico entero positivo .');
    return;
  }
    console.log(maxCapacity);
    setOpenPopup(false);
  };

  

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
    context.drawImage(videoRef.current, 0, 0, 220, 140);

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
      const response = await axios.post("https://cdaiserver.pythonanywhere.com/", formData, {
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

  const calculateRemainingCapacity = () => {
    if (responseData) {
      const remainingCapacity = maxCapacity - responseData.promedio_respuestas;
      return remainingCapacity;
    }
    return null;
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
          <Dialog open={openPopup} >
            <DialogContent sx={{display:'flex', flexDirection: 'column', justifyContent: 'center', gap: 2}}>
              <TextField
                border= '3px solid #00a388'
                label="Enter max capacity"
                variant="outlined"
                fullWidth
                type="number"  
                //inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                
              />
              <Button variant="contained" style={{backgroundColor:'#00a388'}} onClick={handleSaveClick}>
                Guardar
              </Button>
            </DialogContent>
          </Dialog>
          
        <Grid container justifyContent={'center'} alignContent={'center'}>
         
        <Grid item xs={12} md={images.length !==0 ? 8:12} justifyContent={'center'} alignContent={'center'} textAlign={'center'}>
          <Box sx={{ display: 'flex', justifyContent: 'center', m: 1 }} >
            <Typography variant='h3' color="#00a388">
              Smart capacity counting
            </Typography>
          </Box>

          

          <Box sx={{ display: 'flex', justifyContent: 'center', m: 4 }} >
          <div style={{ border: '3px solid #00a388',backgroundColor:'#000000', borderRadius: '8px', overflow: 'hidden', width: '520px', height: '340px', position: 'relative' }}>
          {progress && (
              <div style={{ backgroundColor:'rgb(15,15,15)', position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <RotatingSquare   height="80"  width="80" color="#00a388"   ariaLabel="loading"   visible={true}/>
              </div>
            )}
          {!progress && responseData && (
            <div style={{ backgroundColor:'#FFFFFF', position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
               {calculateRemainingCapacity() !== null && (
              <Alert severity={calculateRemainingCapacity() >= 0 ? "success" : "error"}>
                {<>
                Personas en sala: {responseData.promedio_respuestas}. <br/> {
                    calculateRemainingCapacity() === 0
                      ? "Aforo completo."
                      : calculateRemainingCapacity() < 0
                        ? `Evacuar ${Math.abs(calculateRemainingCapacity())} personas.`
                        : `Pueden ingresar ${Math.abs(calculateRemainingCapacity())} personas.`}
                </>}
              </Alert>
            )}
            </div>
          )}  
            <video className="video" ref={videoRef}></video>

          </div>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', m: 4 }}>
            <Button variant='contained' onClick={handlePhotoClick} style={{backgroundColor:'#00a388'}}>Take a Photo</Button>
            <Button variant='contained'  onClick={handleResetClick} style={{backgroundColor:'#ff5362', marginLeft:'8px'}}>Reset</Button>
          </Box>

          
          
        </Grid>
        <Grid item xs={12} md={4} >
        <div className="canvas-wrap" style={{ display: 'none' }}>
            <canvas className="canvas" width="220" height="140" ref={canvasRef}></canvas>
          </div>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 2 }}>
          {
            images.length !== 0 ?

              <Card sx={{height:'auto'}}>
                <CardContent sx={{height:'auto'}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                {images.map((blob, i) => (
                  <Box key={i} >
                    <img src={URL.createObjectURL(blob)} className="photo" alt={`Image ${i}`} />
                    <Typography align='center'>Image {i+1}</Typography>
                  </Box>
                ))}
              </Box>
                </CardContent>
              </Card>  
             
              :
              <></>
          }
          </Box>
         </Grid>
        </Grid>

      </Container>
    </Box>





  );
}

export default App;
