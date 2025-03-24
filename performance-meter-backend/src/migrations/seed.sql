-- Voeg een test consultant toe
INSERT INTO consultants (id, user_id, role, created_at, updated_at)
VALUES (1, 1, 'consultant', NOW(), NOW())
ON DUPLICATE KEY UPDATE
    user_id = VALUES(user_id),
    role = VALUES(role),
    updated_at = NOW(); 