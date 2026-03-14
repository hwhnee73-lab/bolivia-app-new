-- Align existing data to support users.household_id -> households(id) FK
-- 1) Make users.household_id nullable (legacy init had NOT NULL)
ALTER TABLE users MODIFY COLUMN household_id BIGINT NULL;

-- 2) Create missing households based on users.dong/users.ho
INSERT INTO households (building_number, unit_number, created_at, updated_at)
SELECT u.dong, u.ho, NOW(), NOW()
FROM users u
LEFT JOIN households h
  ON h.building_number = u.dong AND h.unit_number = u.ho
WHERE h.id IS NULL
GROUP BY u.dong, u.ho;

-- 3) Backfill users.household_id by matching households
UPDATE users u
JOIN households h
  ON h.building_number = u.dong AND h.unit_number = u.ho
SET u.household_id = h.id
WHERE u.household_id IS NULL OR u.household_id <> h.id;

-- 4) Add FK if it does not already exist
SET @fk_exists = (
  SELECT COUNT(*) FROM information_schema.REFERENTIAL_CONSTRAINTS
   WHERE CONSTRAINT_SCHEMA = DATABASE()
     AND CONSTRAINT_NAME = 'fk_users_household'
     AND TABLE_NAME = 'users'
);
SET @sql = IF(@fk_exists = 0,
  'ALTER TABLE users ADD CONSTRAINT fk_users_household FOREIGN KEY (household_id) REFERENCES households(id)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

