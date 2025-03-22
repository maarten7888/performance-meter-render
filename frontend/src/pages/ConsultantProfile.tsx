import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Grid,
    Avatar,
    Box,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { ConsultantProfile, ConsultantProfileFormData } from '../types/consultantProfile';
import { api } from '../services/api';

const ConsultantProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<ConsultantProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<ConsultantProfileFormData>({
        email: user?.email || '',
        fullName: '',
        title: '',
        bio: '',
        strengths: [],
        hobbies: [],
        experience: [],
        education: [],
        certifications: [],
        profileImage: ''
    });

    useEffect(() => {
        fetchProfile();
    }, [user?.email]);

    const fetchProfile = async () => {
        try {
            if (user?.email) {
                const response = await api.get(`/consultant-profile/${user.email}`);
                setProfile(response.data);
                setFormData(response.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (profile) {
                await api.put(`/consultant-profile/${user?.email}`, formData);
            } else {
                await api.post('/consultant-profile', formData);
            }
            setProfile(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    const handleAddItem = (field: keyof ConsultantProfileFormData) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), '']
        }));
    };

    const handleRemoveItem = (field: keyof ConsultantProfileFormData, index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field]?.filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (field: keyof ConsultantProfileFormData, index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field]?.map((item, i) => i === index ? value : item)
        }));
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" component="h1">
                        Consultant Profiel
                    </Typography>
                    {!isEditing ? (
                        <Button
                            startIcon={<EditIcon />}
                            variant="contained"
                            onClick={() => setIsEditing(true)}
                        >
                            Bewerken
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        >
                            Opslaan
                        </Button>
                    )}
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} display="flex" justifyContent="center">
                        <Avatar
                            src={formData.profileImage}
                            sx={{ width: 120, height: 120 }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Volledige naam"
                            value={formData.fullName}
                            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                            disabled={!isEditing}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Titel"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            disabled={!isEditing}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Bio"
                            value={formData.bio}
                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                            disabled={!isEditing}
                        />
                    </Grid>

                    {/* Sterke punten */}
                    <Grid item xs={12}>
                        <Typography variant="h6">Sterke punten</Typography>
                        <List>
                            {formData.strengths?.map((strength, index) => (
                                <ListItem key={index}>
                                    <ListItemText>
                                        <TextField
                                            fullWidth
                                            value={strength}
                                            onChange={(e) => handleItemChange('strengths', index, e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </ListItemText>
                                    {isEditing && (
                                        <IconButton onClick={() => handleRemoveItem('strengths', index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </ListItem>
                            ))}
                            {isEditing && (
                                <ListItem>
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={() => handleAddItem('strengths')}
                                    >
                                        Toevoegen
                                    </Button>
                                </ListItem>
                            )}
                        </List>
                    </Grid>

                    {/* Hobby's */}
                    <Grid item xs={12}>
                        <Typography variant="h6">Hobby's</Typography>
                        <List>
                            {formData.hobbies?.map((hobby, index) => (
                                <ListItem key={index}>
                                    <ListItemText>
                                        <TextField
                                            fullWidth
                                            value={hobby}
                                            onChange={(e) => handleItemChange('hobbies', index, e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </ListItemText>
                                    {isEditing && (
                                        <IconButton onClick={() => handleRemoveItem('hobbies', index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </ListItem>
                            ))}
                            {isEditing && (
                                <ListItem>
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={() => handleAddItem('hobbies')}
                                    >
                                        Toevoegen
                                    </Button>
                                </ListItem>
                            )}
                        </List>
                    </Grid>

                    {/* Ervaring */}
                    <Grid item xs={12}>
                        <Typography variant="h6">Ervaring</Typography>
                        <List>
                            {formData.experience?.map((exp, index) => (
                                <ListItem key={index}>
                                    <ListItemText>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            value={exp}
                                            onChange={(e) => handleItemChange('experience', index, e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </ListItemText>
                                    {isEditing && (
                                        <IconButton onClick={() => handleRemoveItem('experience', index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </ListItem>
                            ))}
                            {isEditing && (
                                <ListItem>
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={() => handleAddItem('experience')}
                                    >
                                        Toevoegen
                                    </Button>
                                </ListItem>
                            )}
                        </List>
                    </Grid>

                    {/* Opleiding */}
                    <Grid item xs={12}>
                        <Typography variant="h6">Opleiding</Typography>
                        <List>
                            {formData.education?.map((edu, index) => (
                                <ListItem key={index}>
                                    <ListItemText>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            value={edu}
                                            onChange={(e) => handleItemChange('education', index, e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </ListItemText>
                                    {isEditing && (
                                        <IconButton onClick={() => handleRemoveItem('education', index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </ListItem>
                            ))}
                            {isEditing && (
                                <ListItem>
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={() => handleAddItem('education')}
                                    >
                                        Toevoegen
                                    </Button>
                                </ListItem>
                            )}
                        </List>
                    </Grid>

                    {/* Certificeringen */}
                    <Grid item xs={12}>
                        <Typography variant="h6">Certificeringen</Typography>
                        <List>
                            {formData.certifications?.map((cert, index) => (
                                <ListItem key={index}>
                                    <ListItemText>
                                        <TextField
                                            fullWidth
                                            value={cert}
                                            onChange={(e) => handleItemChange('certifications', index, e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </ListItemText>
                                    {isEditing && (
                                        <IconButton onClick={() => handleRemoveItem('certifications', index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </ListItem>
                            ))}
                            {isEditing && (
                                <ListItem>
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={() => handleAddItem('certifications')}
                                    >
                                        Toevoegen
                                    </Button>
                                </ListItem>
                            )}
                        </List>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default ConsultantProfilePage; 