-- Update consultants table with additional fields
ALTER TABLE consultants
ADD COLUMN full_name VARCHAR(255) AFTER user_id,
ADD COLUMN phone_number VARCHAR(50) AFTER full_name,
ADD COLUMN location VARCHAR(255) AFTER phone_number,
ADD COLUMN title VARCHAR(255) AFTER location,
ADD COLUMN skills JSON AFTER bio,
ADD COLUMN languages JSON AFTER skills,
ADD COLUMN strengths JSON AFTER languages,
ADD COLUMN hobbies JSON AFTER strengths,
ADD COLUMN experience JSON AFTER hobbies,
ADD COLUMN education JSON AFTER experience,
ADD COLUMN certifications JSON AFTER education;

-- Update existing test consultant with some default values
UPDATE consultants 
SET 
    full_name = 'Test Consultant',
    phone_number = '+31612345678',
    location = 'Amsterdam',
    title = 'Senior Consultant',
    skills = JSON_ARRAY('JavaScript', 'TypeScript', 'React', 'Node.js'),
    languages = JSON_ARRAY('Nederlands', 'Engels'),
    strengths = JSON_ARRAY('Web Development', 'Team Leadership'),
    hobbies = JSON_ARRAY('Programming', 'Reading'),
    experience = JSON_ARRAY(
        JSON_OBJECT(
            'company', 'Test Company',
            'position', 'Senior Developer',
            'startDate', '2020-01-01',
            'endDate', '2023-12-31',
            'description', 'Lead developer for various web applications'
        )
    ),
    education = JSON_ARRAY(
        JSON_OBJECT(
            'institution', 'Test University',
            'degree', 'Computer Science',
            'startDate', '2015-09-01',
            'endDate', '2019-06-30'
        )
    ),
    certifications = JSON_ARRAY('AWS Certified Developer', 'Scrum Master')
WHERE id = 1; 