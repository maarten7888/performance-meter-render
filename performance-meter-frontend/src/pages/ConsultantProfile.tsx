import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Grid,
  Button,
  TextField,
  Chip,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import { ConsultantProfile, ConsultantProfileDB, WorkExperience, Education } from '../types/consultantProfile';
import { getConsultantProfile, updateConsultantProfile, createConsultantProfile } from '../services/api';
import styled from '@emotion/styled';

const emptyProfile: ConsultantProfile = {
  email: '',
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
  newCertification: ''
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: '32px',
  padding: '24px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& label': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
    '&.Mui-disabled': {
      color: 'white',
      '& fieldset': {
        borderColor: 'white',
      },
    },
  },
  '& input[type=number]': {
    '&.Mui-disabled': {
      color: 'white',
    },
  },
}));

const ConsultantProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ConsultantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ConsultantProfile>>(emptyProfile);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.email) return;
      
      try {
        setError(null);
        setLoading(true);
        const data = await getConsultantProfile(user.email);
        
        console.log('Raw data from server:', data);

        // Converteer de backend data naar het frontend formaat
        const processedProfile: ConsultantProfile = {
          email: data.email,
          full_name: data.full_name || '',
          phone_number: data.phone_number || '',
          location: data.location || '',
          bio: data.bio || '',
          skills: data.skills ? JSON.parse(data.skills) : [],
          languages: data.languages ? JSON.parse(data.languages) : [],
          hobbies: data.hobbies ? JSON.parse(data.hobbies) : [],
          work_experience: data.work_experience ? JSON.parse(data.work_experience) : [],
          education: data.education ? JSON.parse(data.education) : [],
          certifications: data.certifications ? JSON.parse(data.certifications) : [],
          newSkill: '',
          newLanguage: '',
          newCertification: ''
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

  // Voeg een debug effect toe om de profile state te monitoren
  useEffect(() => {
    console.log('Current profile state:', profile);
  }, [profile]);

  // Voeg een debug effect toe om de formData state te monitoren
  useEffect(() => {
    console.log('Current formData state:', formData);
  }, [formData]);

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

      const updatedProfile = await updateConsultantProfile(user.email, dataToSend);
      
      console.log('Received response from server:', updatedProfile);

      // Converteer de backend data terug naar het frontend formaat
      const processedProfile: ConsultantProfile = {
        email: updatedProfile.email,
        full_name: updatedProfile.full_name || '',
        phone_number: updatedProfile.phone_number || '',
        location: updatedProfile.location || '',
        bio: updatedProfile.bio || '',
        skills: updatedProfile.skills ? JSON.parse(updatedProfile.skills) : [],
        languages: updatedProfile.languages ? JSON.parse(updatedProfile.languages) : [],
        hobbies: updatedProfile.hobbies ? JSON.parse(updatedProfile.hobbies) : [],
        work_experience: updatedProfile.work_experience ? JSON.parse(updatedProfile.work_experience) : [],
        education: updatedProfile.education ? JSON.parse(updatedProfile.education) : [],
        certifications: updatedProfile.certifications ? JSON.parse(updatedProfile.certifications) : [],
        newSkill: '',
        newLanguage: '',
        newCertification: ''
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

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // Reset formData to the original profile data
    if (profile) {
      setFormData(profile);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleAddSkill = () => {
    if (formData.newSkill) {
      const currentSkills = Array.isArray(formData.skills) ? formData.skills : [];
      setFormData(prev => ({
        ...prev,
        skills: [...currentSkills, prev.newSkill],
        newSkill: ''
      }));
    }
  };

  const handleAddLanguage = () => {
    if (formData.newLanguage) {
      const currentLanguages = Array.isArray(formData.languages) ? formData.languages : [];
      setFormData(prev => ({
        ...prev,
        languages: [...currentLanguages, prev.newLanguage],
        newLanguage: ''
      }));
    }
  };

  const handleAddCertification = () => {
    if (formData.newCertification) {
      const currentCertifications = Array.isArray(formData.certifications) ? formData.certifications : [];
      setFormData(prev => ({
        ...prev,
        certifications: [...currentCertifications, prev.newCertification],
        newCertification: ''
      }));
    }
  };

  const handleAddWorkExperience = () => {
    const currentExperience = Array.isArray(formData.work_experience) ? formData.work_experience : [];
    setFormData(prev => ({
      ...prev,
      work_experience: [...currentExperience, { company: '', position: '', period: '' }]
    }));
  };

  const handleAddEducation = () => {
    const currentEducation = Array.isArray(formData.education) ? formData.education : [];
    setFormData(prev => ({
      ...prev,
      education: [...currentEducation, { school: '', degree: '', year: '' }]
    }));
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" color="white">
          Mijn Profiel
        </Typography>
        {!isEditing && (
          <Button
            variant="contained"
            onClick={handleEdit}
            startIcon={<EditIcon />}
            sx={{ 
              bgcolor: 'white', 
              color: '#0c2d5a', 
              '&:hover': { 
                bgcolor: '#f5f5f5' 
              } 
            }}
          >
            Bewerken
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2, backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#ff8785' }}>
          {error}
        </Alert>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Persoonlijke Informatie */}
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" color="white" gutterBottom>
                  Persoonlijke Informatie
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      label="Volledige naam"
                      value={formData.full_name || ''}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      label="E-mail"
                      value={formData.email || ''}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      label="Telefoonnummer"
                      value={formData.phone_number || ''}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      label="Locatie"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Bio"
                      value={formData.bio || ''}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>
              </StyledPaper>
            </Grid>

            {/* Vaardigheden */}
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" color="white" gutterBottom>
                  Vaardigheden
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  {Array.isArray(formData.skills) 
                    ? formData.skills.map((skill: string, index: number) => (
                        <Chip
                          key={index}
                          label={skill}
                          onDelete={isEditing ? () => {
                            setFormData(prev => ({
                              ...prev,
                              skills: prev.skills?.filter((_, i) => i !== index)
                            }));
                          } : undefined}
                          sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                        />
                      ))
                    : null}
                </Box>
                {isEditing && (
                  <Box display="flex" gap={1}>
                    <StyledTextField
                      size="small"
                      placeholder="Nieuwe vaardigheid"
                      value={formData.newSkill || ''}
                      onChange={(e) => setFormData({ ...formData, newSkill: e.target.value })}
                    />
                    <IconButton
                      onClick={handleAddSkill}
                      sx={{ color: 'white' }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                )}
              </StyledPaper>
            </Grid>

            {/* Talen */}
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" color="white" gutterBottom>
                  Talen
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {Array.isArray(formData.languages) 
                    ? formData.languages.map((language: string, index: number) => (
                        <Chip
                          key={index}
                          label={language}
                          onDelete={isEditing ? () => {
                            setFormData(prev => ({
                              ...prev,
                              languages: prev.languages?.filter((_, i) => i !== index)
                            }));
                          } : undefined}
                          sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                        />
                      ))
                    : null}
                </Box>
                {isEditing && (
                  <Box display="flex" gap={1}>
                    <StyledTextField
                      size="small"
                      placeholder="Nieuwe taal"
                      value={formData.newLanguage || ''}
                      onChange={(e) => setFormData({ ...formData, newLanguage: e.target.value })}
                    />
                    <IconButton
                      onClick={handleAddLanguage}
                      sx={{ color: 'white' }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                )}
              </StyledPaper>
            </Grid>

            {/* Ervaring */}
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" color="white" gutterBottom>
                  Werkervaring
                </Typography>
                {Array.isArray(formData.work_experience) 
                  ? formData.work_experience.map((exp, index) => (
                      <Box key={index} mb={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <StyledTextField
                              fullWidth
                              label="Bedrijf"
                              value={exp.company}
                              onChange={(e) => {
                                const newExperience = [...(formData.work_experience || [])];
                                newExperience[index] = { ...exp, company: e.target.value };
                                setFormData({ ...formData, work_experience: newExperience });
                              }}
                              disabled={!isEditing}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <StyledTextField
                              fullWidth
                              label="Functie"
                              value={exp.position}
                              onChange={(e) => {
                                const newExperience = [...(formData.work_experience || [])];
                                newExperience[index] = { ...exp, position: e.target.value };
                                setFormData({ ...formData, work_experience: newExperience });
                              }}
                              disabled={!isEditing}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <StyledTextField
                              fullWidth
                              label="Periode"
                              value={exp.period}
                              onChange={(e) => {
                                const newExperience = [...(formData.work_experience || [])];
                                newExperience[index] = { ...exp, period: e.target.value };
                                setFormData({ ...formData, work_experience: newExperience });
                              }}
                              disabled={!isEditing}
                            />
                          </Grid>
                          {isEditing && (
                            <Grid item xs={12} display="flex" justifyContent="flex-end">
                              <IconButton
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    work_experience: prev.work_experience?.filter((_, i) => i !== index)
                                  }));
                                }}
                                sx={{ color: '#ff8785' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    ))
                  : null}
                {isEditing && (
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddWorkExperience}
                    sx={{ color: 'white', mt: 1 }}
                  >
                    Ervaring toevoegen
                  </Button>
                )}
              </StyledPaper>
            </Grid>

            {/* Opleiding */}
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" color="white" gutterBottom>
                  Opleiding
                </Typography>
                {Array.isArray(formData.education) 
                  ? formData.education.map((edu, index) => (
                      <Box key={index} mb={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <StyledTextField
                              fullWidth
                              label="School"
                              value={edu.school}
                              onChange={(e) => {
                                const newEducation = [...(formData.education || [])];
                                newEducation[index] = { ...edu, school: e.target.value };
                                setFormData({ ...formData, education: newEducation });
                              }}
                              disabled={!isEditing}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <StyledTextField
                              fullWidth
                              label="Opleiding"
                              value={edu.degree}
                              onChange={(e) => {
                                const newEducation = [...(formData.education || [])];
                                newEducation[index] = { ...edu, degree: e.target.value };
                                setFormData({ ...formData, education: newEducation });
                              }}
                              disabled={!isEditing}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <StyledTextField
                              fullWidth
                              label="Jaar"
                              value={edu.year}
                              onChange={(e) => {
                                const newEducation = [...(formData.education || [])];
                                newEducation[index] = { ...edu, year: e.target.value };
                                setFormData({ ...formData, education: newEducation });
                              }}
                              disabled={!isEditing}
                            />
                          </Grid>
                          {isEditing && (
                            <Grid item xs={12} display="flex" justifyContent="flex-end">
                              <IconButton
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    education: prev.education?.filter((_, i) => i !== index)
                                  }));
                                }}
                                sx={{ color: '#ff8785' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    ))
                  : null}
                {isEditing && (
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddEducation}
                    sx={{ color: 'white', mt: 1 }}
                  >
                    Opleiding toevoegen
                  </Button>
                )}
              </StyledPaper>
            </Grid>

            {/* Certificeringen */}
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" color="white" gutterBottom>
                  Certificeringen
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  {Array.isArray(formData.certifications) 
                    ? formData.certifications.map((cert: string, index: number) => (
                        <Chip
                          key={index}
                          label={cert}
                          onDelete={isEditing ? () => {
                            setFormData(prev => ({
                              ...prev,
                              certifications: prev.certifications?.filter((_, i) => i !== index)
                            }));
                          } : undefined}
                          sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                        />
                      ))
                    : null}
                </Box>
                {isEditing && (
                  <Box display="flex" gap={1}>
                    <StyledTextField
                      size="small"
                      placeholder="Nieuwe certificering"
                      value={formData.newCertification || ''}
                      onChange={(e) => setFormData({ ...formData, newCertification: e.target.value })}
                    />
                    <IconButton
                      onClick={handleAddCertification}
                      sx={{ color: 'white' }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                )}
              </StyledPaper>
            </Grid>

            {/* Knoppen */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  borderColor: '#ff8785',
                  color: '#ff8785',
                  '&:hover': {
                    borderColor: '#ff8785',
                    backgroundColor: 'rgba(255, 135, 133, 0.1)',
                  },
                }}
              >
                Annuleren
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{ 
                  bgcolor: 'white', 
                  color: '#0c2d5a', 
                  '&:hover': { 
                    bgcolor: '#f5f5f5' 
                  } 
                }}
              >
                Opslaan
              </Button>
            </Box>
          </Grid>
        </form>
      ) : (
        <Grid container spacing={3}>
          {/* Persoonlijke Informatie */}
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" color="white" gutterBottom>
                Persoonlijke Informatie
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" color="white">
                    <strong>Naam:</strong> {profile?.full_name || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" color="white">
                    <strong>E-mail:</strong> {profile?.email || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" color="white">
                    <strong>Telefoonnummer:</strong> {profile?.phone_number || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" color="white">
                    <strong>Locatie:</strong> {profile?.location || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" color="white">
                    <strong>Bio:</strong> {profile?.bio || '-'}
                  </Typography>
                </Grid>
              </Grid>
            </StyledPaper>
          </Grid>

          {/* Vaardigheden */}
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" color="white" gutterBottom>
                Vaardigheden
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {Array.isArray(profile?.skills) 
                  ? profile.skills.map((skill: string, index: number) => (
                      <Chip
                        key={index}
                        label={skill}
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                      />
                    ))
                  : null}
              </Box>
            </StyledPaper>
          </Grid>

          {/* Talen */}
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" color="white" gutterBottom>
                Talen
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {Array.isArray(profile?.languages) 
                  ? profile.languages.map((language: string, index: number) => (
                      <Chip
                        key={index}
                        label={language}
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                      />
                    ))
                  : null}
              </Box>
            </StyledPaper>
          </Grid>

          {/* Ervaring */}
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" color="white" gutterBottom>
                Werkervaring
              </Typography>
              {Array.isArray(profile?.work_experience) 
                ? profile.work_experience.map((exp, index) => (
                    <Box key={index} mb={2}>
                      <Typography variant="body1" color="white">
                        <strong>{exp.company}</strong> - {exp.position}
                      </Typography>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                        {exp.period}
                      </Typography>
                    </Box>
                  ))
                : null}
            </StyledPaper>
          </Grid>

          {/* Opleiding */}
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" color="white" gutterBottom>
                Opleiding
              </Typography>
              {Array.isArray(profile?.education) 
                ? profile.education.map((edu, index) => (
                    <Box key={index} mb={2}>
                      <Typography variant="body1" color="white">
                        <strong>{edu.school}</strong> - {edu.degree}
                      </Typography>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                        {edu.year}
                      </Typography>
                    </Box>
                  ))
                : null}
            </StyledPaper>
          </Grid>

          {/* Certificeringen */}
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" color="white" gutterBottom>
                Certificeringen
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {Array.isArray(profile?.certifications) 
                  ? profile.certifications.map((cert: string, index: number) => (
                      <Chip
                        key={index}
                        label={cert}
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                      />
                    ))
                  : null}
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ConsultantProfilePage; 