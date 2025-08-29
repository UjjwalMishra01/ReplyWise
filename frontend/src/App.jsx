import { useState } from 'react';
import './App.css';
import { Analytics } from "@vercel/analytics/react"
import axios from 'axios'; 
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Select,
  Button,
  CircularProgress, 
} from '@mui/material';



function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  {/*This is going to handle our api request*/}
  const handleSubmit = async () => {
     setLoading(true)
     setError('');
     try{
     const response = await axios.post("https://replywise-backend-1.onrender.com/api/email/generate", {
      emailContent,
      tone
     });
     setGeneratedReply(typeof response.data == 'string'? response.data: JSON.stringify(response.data));
     }catch(error){
      setError("Unable to generate response: Sorry for the inconvenience caused!!");
     }finally{
      setLoading(false);
     }

  };
  return (
    <Container  sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        ReplyWise
      </Typography>

      <Box sx={{ width: '100%', mb: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        />
      </Box>

      <Box sx={{ mx: 3, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Warning">Warning</MenuItem>
          </Select>
        </FormControl>

        <Button
        variant='contained'
        onClick={handleSubmit}
        disabled={!emailContent || loading}
        fullWidth>
        {loading? <CircularProgress size={24}/>: "Generate reply"}

        </Button>
      </Box>


      {error && (
        <Typography color='error' sx={{mb:2}} gutterBottom>
        {error}
      </Typography>

      )}

      {
        generatedReply && (
         <Box sx={{mt:3}}>
          <Typography variant='h6' gutterBottom>
           Generated Reply:
          </Typography>
          <TextField fullWidth multiline rows={6} value={generatedReply || ''} inputProps={{readOnly: true}}>
          </TextField>
          <Button variant='outlined' sx={{mt:2}}
          onClick={()=> navigator.clipboard.writeText(generatedReply)}>
           Copy
          </Button>
          </Box>
        )
      }
       <Analytics />
    </Container>
    
  );
}

export default App;
