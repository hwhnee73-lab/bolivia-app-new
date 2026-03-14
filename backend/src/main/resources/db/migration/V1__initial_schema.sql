-- Initial schema aligned to com.bolivia.app entities
-- NOTE: Managed by Flyway; do not edit in place after apply. Use new migrations.

-- Households
CREATE TABLE IF NOT EXISTS households (
  id BIGINT NOT NULL AUTO_INCREMENT,
  building_number VARCHAR(50) NOT NULL,
  unit_number VARCHAR(50) NOT NULL,
  owner_name VARCHAR(100),
  phone_number VARCHAR(20),
  move_in_date DATE,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_household_building_unit (building_number, unit_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  household_id BIGINT,
  apt_code VARCHAR(32) NOT NULL,
  dong VARCHAR(10) NOT NULL,
  ho VARCHAR(10) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  username VARCHAR(64),
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  role VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  last_login_at DATETIME(6),
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_household (household_id),
  CONSTRAINT fk_users_household FOREIGN KEY (household_id) REFERENCES households(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Refresh Tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at DATETIME(6) NOT NULL,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_refresh_token (token),
  KEY idx_refresh_user (user_id),
  CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bills
CREATE TABLE IF NOT EXISTS bills (
  id BIGINT NOT NULL AUTO_INCREMENT,
  household_id BIGINT NOT NULL,
  bill_month VARCHAR(7) NOT NULL,
  bill_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL,
  general_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  security_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  cleaning_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  elevator_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  electricity_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  water_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  heating_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  repair_fund DECIMAL(10,2) NOT NULL DEFAULT 0,
  insurance_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  other_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_bill_household_month (household_id, bill_month),
  KEY idx_bill_household (household_id),
  KEY idx_bill_month (bill_month),
  KEY idx_bill_status (status),
  CONSTRAINT fk_bill_household FOREIGN KEY (household_id) REFERENCES households(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id BIGINT NOT NULL AUTO_INCREMENT,
  bill_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  payment_amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(30) NOT NULL,
  payment_status VARCHAR(30) NOT NULL,
  transaction_id VARCHAR(100),
  payment_date DATETIME(6) DEFAULT CURRENT_TIMESTAMP,
  receipt_url VARCHAR(500),
  notes TEXT,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payment_tx (transaction_id),
  KEY idx_payment_bill (bill_id),
  KEY idx_payment_user (user_id),
  CONSTRAINT fk_payment_bill FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE,
  CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

