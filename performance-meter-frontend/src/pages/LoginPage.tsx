import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Ongeldige inloggegevens');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#0c2d5a',
                        width: '100%',
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ color: 'white', mb: 3 }}>
                        Inloggen
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="E-mailadres"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'white' },
                                },
                                '& .MuiInputLabel-root': { 
                                    color: 'white'
                                },
                                '& .MuiOutlinedInput-input': { color: 'white' },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Wachtwoord"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'white' },
                                },
                                '& .MuiInputLabel-root': { 
                                    color: 'white'
                                },
                                '& .MuiOutlinedInput-input': { color: 'white' },
                            }}
                        />
                        {error && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: 'white',
                                color: '#0c2d5a',
                                '&:hover': {
                                    backgroundColor: '#e0e0e0',
                                },
                            }}
                        >
                            Inloggen
                        </Button>
                        <Link
                            component={RouterLink}
                            to="/register"
                            variant="body2"
                            sx={{ color: 'white' }}
                        >
                            Nog geen account? Registreer hier
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage; 