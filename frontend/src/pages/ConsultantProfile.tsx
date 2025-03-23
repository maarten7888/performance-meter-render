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
import { ConsultantProfile, ConsultantProfileFormData, ConsultantProfileDB } from '../types/consultantProfile';
import { api } from '../services/api';

const ConsultantProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<ConsultantProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<ConsultantProfileFormData>({
        email: user?.email || '',
        full_name: '',
        phone_number: '',
        location: '',
        bio: '',
        skills: [],
        languages: [],
        hobbies: [],
        work_experience: [],
        education: [],
        certifications: [],
        newSkill: '',
        newLanguage: '',
        newCertification: '',
        profileImage: '',
        title: '',
        strengths: []
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.email) return;
            
            try {
                setError(null);
                setLoading(true);
                const data = await api.get(`/consultant-profile/${user.email}`);
                
                console.log('Raw data from server:', data);

                // Converteer de backend data naar het frontend formaat
                const processedProfile: ConsultantProfileFormData = {
                    email: data.data.email,
                    full_name: data.data.full_name || '',
                    phone_number: data.data.phone_number || '',
                    location: data.data.location || '',
                    bio: data.data.bio || '',
                    skills: data.data.skills ? JSON.parse(data.data.skills) : [],
                    languages: data.data.languages ? JSON.parse(data.data.languages) : [],
                    hobbies: data.data.hobbies ? JSON.parse(data.data.hobbies) : [],
                    work_experience: data.data.work_experience ? JSON.parse(data.data.work_experience) : [],
                    education: data.data.education ? JSON.parse(data.data.education) : [],
                    certifications: data.data.certifications ? JSON.parse(data.data.certifications) : [],
                    newSkill: '',
                    newLanguage: '',
                    newCertification: '',
                    profileImage: data.data.profileImage || '',
                    title: data.data.title || '',
                    strengths: data.data.strengths ? JSON.parse(data.data.strengths) : []
                };

                console.log('Processed profile for display:', processedProfile);

                // Update beide states met de verwerkte data
                setProfile(processedProfile);
                setFormData(processedProfile);
            } catch (err: any) {
                console.error('Error fetching profile:', err);
                setError(err.message || 'Er is een fout opgetreden bij het ophalen van het profiel');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user?.email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.email) return;

        try {
            setError(null);
            setLoading(true);

            // Converteer de frontend data naar het backend formaat
            const dataToSend: ConsultantProfileDB = {
                email: user.email,
                full_name: String(formData.full_name || '').trim(),
                phone_number: String(formData.phone_number || '').trim(),
                location: String(formData.location || '').trim(),
                bio: String(formData.bio || '').trim(),
                skills: JSON.stringify(formData.skills || []),
                languages: JSON.stringify(formData.languages || []),
                hobbies: JSON.stringify(formData.hobbies || []),
                work_experience: JSON.stringify(formData.work_experience || []),
                education: JSON.stringify(formData.education || []),
                certifications: JSON.stringify(formData.certifications || [])
            };

            console.log('Sending data to server:', dataToSend);

            const updatedProfile = await api.put(`/consultant-profile/${user.email}`, dataToSend);
            
            console.log('Received response from server:', updatedProfile);

            // Converteer de backend data terug naar het frontend formaat
            const processedProfile: ConsultantProfileFormData = {
                email: updatedProfile.data.email,
                full_name: updatedProfile.data.full_name || '',
                phone_number: updatedProfile.data.phone_number || '',
                location: updatedProfile.data.location || '',
                bio: updatedProfile.data.bio || '',
                skills: updatedProfile.data.skills ? JSON.parse(updatedProfile.data.skills) : [],
                languages: updatedProfile.data.languages ? JSON.parse(updatedProfile.data.languages) : [],
                hobbies: updatedProfile.data.hobbies ? JSON.parse(updatedProfile.data.hobbies) : [],
                work_experience: updatedProfile.data.work_experience ? JSON.parse(updatedProfile.data.work_experience) : [],
                education: updatedProfile.data.education ? JSON.parse(updatedProfile.data.education) : [],
                certifications: updatedProfile.data.certifications ? JSON.parse(updatedProfile.data.certifications) : [],
                newSkill: '',
                newLanguage: '',
                newCertification: '',
                profileImage: updatedProfile.data.profileImage || '',
                title: updatedProfile.data.title || '',
                strengths: updatedProfile.data.strengths ? JSON.parse(updatedProfile.data.strengths) : []
            };

            console.log('Processed profile for display:', processedProfile);

            // Update beide states met de verwerkte data
            setProfile(processedProfile);
            setFormData(processedProfile);
            setIsEditing(false);
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Er is een fout opgetreden bij het bijwerken van het profiel');
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = (field: keyof ConsultantProfileFormData) => {
        if (Array.isArray(formData[field])) {
            setFormData(prev => ({
                ...prev,
                [field]: [...(prev[field] as any[]), '']
            }));
        }
    };

    const handleRemoveItem = (field: keyof ConsultantProfileFormData, index: number) => {
        if (Array.isArray(formData[field])) {
            setFormData(prev => ({
                ...prev,
                [field]: (prev[field] as any[]).filter((_, i) => i !== index)
            }));
        }
    };

    const handleItemChange = (field: keyof ConsultantProfileFormData, index: number, value: string) => {
        if (Array.isArray(formData[field])) {
            setFormData(prev => ({
                ...prev,
                [field]: (prev[field] as any[]).map((item, i) => i === index ? value : item)
            }));
        }
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
                            onClick={handleSubmit}
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
                            value={formData.full_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
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
                                            multiline
                                            rows={2}
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
                        </List>
                        {isEditing && (
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => handleAddItem('strengths')}
                            >
                                Toevoegen
                            </Button>
                        )}
                    </Grid>

                    {/* Ervaring */}
                    <Grid item xs={12}>
                        <Typography variant="h6">Ervaring</Typography>
                        <List>
                            {formData.work_experience?.map((exp, index) => (
                                <ListItem key={index}>
                                    <ListItemText>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            value={exp}
                                            onChange={(e) => handleItemChange('work_experience', index, e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </ListItemText>
                                    {isEditing && (
                                        <IconButton onClick={() => handleRemoveItem('work_experience', index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                        {isEditing && (
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => handleAddItem('work_experience')}
                            >
                                Toevoegen
                            </Button>
                        )}
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
                        </List>
                        {isEditing && (
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => handleAddItem('education')}
                            >
                                Toevoegen
                            </Button>
                        )}
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
                                            multiline
                                            rows={2}
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
                        </List>
                        {isEditing && (
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => handleAddItem('certifications')}
                            >
                                Toevoegen
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default ConsultantProfilePage; 