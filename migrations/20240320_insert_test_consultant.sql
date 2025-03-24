-- Insert test consultant
INSERT INTO consultants (
    user_id,
    profile_image,
    role,
    start_date,
    bio,
    skill_moves,
    weak_foot,
    stat_punctuality,
    stat_teamwork,
    stat_focus,
    stat_skills,
    stat_hours,
    stat_communication
) VALUES (
    1, -- user_id (test@example.com)
    'https://example.com/profile.jpg',
    'CONS',
    '2024-01-01',
    'Ervaren consultant met focus op web development',
    85,
    3,
    90,
    85,
    88,
    92,
    95,
    87
); 