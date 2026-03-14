-- Align legacy tables to match JPA entities without destructive changes
-- Note: ALTER TABLE ... ADD COLUMN IF NOT EXISTS is not supported in standard MySQL 8.0.
-- Since current schema already contains these columns, we focus on missing components.

-- Refresh tokens: create table if it does not exist (Standard MySQL 8.0 syntax)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at DATETIME(6) NOT NULL,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uq_refresh_token (token),
  KEY idx_refresh_user (user_id),
  CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

