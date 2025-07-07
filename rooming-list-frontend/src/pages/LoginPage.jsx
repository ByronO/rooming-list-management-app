import { useState } from 'react';
import { useAuth } from '../hooks/authHooks';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

import { Container, TextField, Button, Typography, Box } from '@mui/material';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiClient.post('/auth/login', { username, password });
      login(response.data.token);
      navigate('/rooming-lists');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid credentials');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            autoComplete="username"
            fullWidth
            margin="normal"
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            fullWidth
            margin="normal"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
