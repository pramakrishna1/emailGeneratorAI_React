import { useState } from 'react'

import { Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedReply('');
    try {
      const response = await axios.post("http://localhost:8080/api/v1/email/generate",{
        emailContent: emailContent,
        tone: tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));

    }catch (err) {
      setError('An error occurred while generating the reply. Please try again.');
      console.error(err);
    }finally {
      setIsLoading(false);
    }
  }
  return (
    
    <Container maxWidth="md" sx={{py: 4}}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>
      <Box sx={{mx:3}}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label="Original Email Content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{mb: 2}}
          />
          <FormControl fullWidth sx={{mb: 2}}>
            <InputLabel>Tone (Optional)</InputLabel>
            <Select
            value={tone || ''}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="formal">Formal</MenuItem>
              <MenuItem value="informal">Informal</MenuItem>
              <MenuItem value="friendly">Friendly</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>
            </Select>
          </FormControl>
          <Button variant='contained'
          onClick={handleSubmit}
          disabled={isLoading || !emailContent.trim()}
          fullWidth>
            {isLoading ? <CircularProgress size={24} /> : 'Generate Reply'}
          </Button>
      </Box>
      {error && (
        <Typography color="error" sx={{mb: 2}}>
          {error}
        </Typography>
      )}
      {generatedReply && (
        <Box sx={{mt: 3}}>
          <Typography variant="h6" gutterBottom>
            Generated Reply:
          </Typography>
          <TextField 
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          value={generatedReply || ''}
          inputProps={{readOnly : true}}
          />
          <Button 
          variant='outlined' 
          sx={{mt:2}}
          onClick={() => {
            navigator.clipboard.writeText(generatedReply);
          }}
          >
            Copy to Clipboard
          </Button>
        </Box>
      )}  
    </Container>

  )
}

export default App
