-- Bolivia Condo Management System Database Schema
-- Version: 1.0.0
-- Date: 2025-09-05

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS bolivia_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bolivia_db;

-- 1. 세대 정보 테이블 (households)
CREATE TABLE IF NOT EXISTS `households` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `building_number` VARCHAR(50) NOT NULL COMMENT '동 정보 (예: 101동)',
  `unit_number` VARCHAR(50) NOT NULL COMMENT '호수 정보 (예: 501호)',
  `owner_name` VARCHAR(100) COMMENT '세대주 성명',
  `phone_number` VARCHAR(20) COMMENT '연락처',
  `move_in_date` DATE COMMENT '입주일',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_household` (`building_number`, `unit_number`),
  INDEX `idx_building` (`building_number`),
  INDEX `idx_unit` (`unit_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='세대 정보';

-- 2. 사용자 정보 테이블 (users)
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `household_id` BIGINT COMMENT '소속 세대 ID (주민의 경우)',
  `apt_code` VARCHAR(32) NOT NULL DEFAULT 'BOLIVIA' COMMENT '단지 코드',
  `dong` CHAR(10) NOT NULL COMMENT '동(10자리 zero padding)',
  `ho` CHAR(10) NOT NULL COMMENT '호(10자리 zero padding)',
  `display_name` VARCHAR(100) NOT NULL COMMENT '표시 이름(닉네임)',
  `username` VARCHAR(64) GENERATED ALWAYS AS (CONCAT(`apt_code`, '-', `dong`, '-', `ho`)) STORED COMMENT '로그인 ID',
  `email` VARCHAR(255) NOT NULL UNIQUE COMMENT '로그인 이메일',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '암호화된 비밀번호(BCrypt)',
  `phone_number` VARCHAR(20) COMMENT '휴대폰 번호',
  `role` ENUM('RESIDENT','ADMIN') NOT NULL DEFAULT 'RESIDENT',
  `status` ENUM('PENDING','ACTIVE','LOCKED') NOT NULL DEFAULT 'PENDING',
  `last_login_at` TIMESTAMP NULL COMMENT '마지막 로그인 시간',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `uq_user_unit` (`apt_code`,`dong`,`ho`),
  UNIQUE KEY `uq_username` (`username`),
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자(주민, 관리자) 정보';

-- 3. 리프레시 토큰 테이블 (refresh_tokens)
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `token` VARCHAR(500) NOT NULL UNIQUE,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_token` (`token`),
  INDEX `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='리프레시 토큰';

-- 4. 청구서(관리비) 테이블 (bills)
CREATE TABLE IF NOT EXISTS `bills` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `household_id` BIGINT NOT NULL,
  `bill_month` VARCHAR(7) NOT NULL COMMENT '청구 연월 (YYYY-MM)',
  `bill_date` DATE NOT NULL COMMENT '청구일',
  `due_date` DATE NOT NULL COMMENT '납부 기한',
  `total_amount` DECIMAL(12, 2) NOT NULL COMMENT '총 청구액',
  `paid_amount` DECIMAL(12, 2) DEFAULT 0.00 COMMENT '납부액',
  `status` ENUM('미납', '완납', '부분납') NOT NULL DEFAULT '미납',
  `general_fee` DECIMAL(10, 2) DEFAULT 0.00 COMMENT '일반관리비',
  `security_fee` DECIMAL(10, 2) DEFAULT 0.00 COMMENT '경비비',
  `cleaning_fee` DECIMAL(10, 2) DEFAULT 0.00 COMMENT '청소비',
  `elevator_fee` DECIMAL(10, 2) DEFAULT 0.00 COMMENT '승강기유지비',
  `electricity_fee` DECIMAL(10, 2) DEFAULT 0.00 COMMENT '전기료',
  `water_fee` DECIMAL(10, 2) DEFAULT 0.00 COMMENT '수도료',
  `heating_fee` DECIMAL(10, 2) DEFAULT 0.00 COMMENT '난방비',
  `repair_fund` DECIMAL(10, 2) DEFAULT 0.00 COMMENT '수선유지비',
  `insurance_fee` DECIMAL(10, 2) DEFAULT 0.00 COMMENT '보험료',
  `other_fee` DECIMAL(10, 2) DEFAULT 0.00 COMMENT '기타비용',
  `notes` TEXT COMMENT '비고',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`household_id`) REFERENCES `households`(`id`),
  UNIQUE KEY `uq_bill_month` (`household_id`, `bill_month`),
  INDEX `idx_bill_month` (`bill_month`),
  INDEX `idx_status` (`status`),
  INDEX `idx_due_date` (`due_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='월별 관리비 청구서';

-- 5. 결제 정보 테이블 (payments)
CREATE TABLE IF NOT EXISTS `payments` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `bill_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL COMMENT '결제한 사용자',
  `payment_amount` DECIMAL(12, 2) NOT NULL COMMENT '결제 금액',
  `payment_method` ENUM('신용카드', '계좌이체', '현금', '가상계좌') NOT NULL,
  `payment_status` ENUM('대기', '완료', '취소', '실패') NOT NULL DEFAULT '대기',
  `transaction_id` VARCHAR(100) UNIQUE COMMENT '거래 ID',
  `payment_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '결제일시',
  `receipt_url` VARCHAR(500) COMMENT '영수증 URL',
  `notes` TEXT COMMENT '비고',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  INDEX `idx_payment_date` (`payment_date`),
  INDEX `idx_payment_status` (`payment_status`),
  INDEX `idx_transaction` (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='결제 정보';

-- 6. 공지사항 테이블 (announcements)
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `author_id` BIGINT NOT NULL COMMENT '작성자(관리자) ID',
  `title` VARCHAR(255) NOT NULL COMMENT '제목',
  `content` TEXT NOT NULL COMMENT '내용',
  `category` ENUM('일반', '긴급', '정기점검', '행사', '기타') NOT NULL DEFAULT '일반',
  `is_pinned` BOOLEAN DEFAULT FALSE COMMENT '상단 고정 여부',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT '게시 여부',
  `view_count` INT DEFAULT 0 COMMENT '조회수',
  `attachment_url` VARCHAR(500) COMMENT '첨부파일 URL',
  `start_date` DATE COMMENT '게시 시작일',
  `end_date` DATE COMMENT '게시 종료일',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_pinned` (`is_pinned`),
  INDEX `idx_active` (`is_active`),
  INDEX `idx_dates` (`start_date`, `end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='공지사항';

-- 7. 작업/유지보수 테이블 (tasks)
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `requester_id` BIGINT NOT NULL COMMENT '요청자(주민) ID',
  `assigned_to` BIGINT COMMENT '담당자(관리자) ID',
  `title` VARCHAR(255) NOT NULL COMMENT '제목',
  `description` TEXT NOT NULL COMMENT '상세 설명',
  `category` ENUM('전기', '수도', '가스', '엘리베이터', '공용시설', '기타') NOT NULL DEFAULT '기타',
  `priority` ENUM('낮음', '보통', '높음', '긴급') NOT NULL DEFAULT '보통',
  `status` ENUM('접수됨', '처리중', '완료됨', '보류', '취소') NOT NULL DEFAULT '접수됨',
  `location` VARCHAR(255) COMMENT '작업 위치',
  `cost` DECIMAL(10, 2) DEFAULT 0.00 COMMENT '작업 비용',
  `scheduled_date` DATE COMMENT '예정 작업일',
  `completed_date` DATE COMMENT '완료일',
  `notes` TEXT COMMENT '관리자 메모',
  `attachment_url` VARCHAR(500) COMMENT '첨부파일 URL',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`requester_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_status` (`status`),
  INDEX `idx_priority` (`priority`),
  INDEX `idx_category` (`category`),
  INDEX `idx_scheduled` (`scheduled_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='작업 및 유지보수';

-- 8. 시설 정보 테이블 (facilities)
CREATE TABLE IF NOT EXISTS `facilities` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `facility_name` VARCHAR(100) NOT NULL COMMENT '시설명',
  `facility_type` ENUM('회의실', '체육시설', '게스트룸', '파티룸', '기타') NOT NULL,
  `location` VARCHAR(255) COMMENT '위치',
  `capacity` INT COMMENT '수용 인원',
  `hourly_rate` DECIMAL(10, 2) DEFAULT 0.00 COMMENT '시간당 이용료',
  `daily_rate` DECIMAL(10, 2) DEFAULT 0.00 COMMENT '일일 이용료',
  `description` TEXT COMMENT '시설 설명',
  `rules` TEXT COMMENT '이용 규칙',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT '운영 여부',
  `image_url` VARCHAR(500) COMMENT '시설 이미지 URL',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_type` (`facility_type`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='시설 정보';

-- 9. 예약 테이블 (reservations)
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `facility_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL COMMENT '예약자 ID',
  `reservation_date` DATE NOT NULL COMMENT '예약일',
  `start_time` TIME NOT NULL COMMENT '시작 시간',
  `end_time` TIME NOT NULL COMMENT '종료 시간',
  `purpose` VARCHAR(255) COMMENT '이용 목적',
  `number_of_people` INT COMMENT '이용 인원',
  `total_fee` DECIMAL(10, 2) DEFAULT 0.00 COMMENT '총 이용료',
  `status` ENUM('대기', '승인', '거절', '취소', '완료') NOT NULL DEFAULT '대기',
  `approved_by` BIGINT COMMENT '승인한 관리자 ID',
  `approved_at` TIMESTAMP NULL COMMENT '승인 시간',
  `cancelled_at` TIMESTAMP NULL COMMENT '취소 시간',
  `cancellation_reason` TEXT COMMENT '취소 사유',
  `notes` TEXT COMMENT '비고',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`facility_id`) REFERENCES `facilities`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `uq_facility_time` (`facility_id`, `reservation_date`, `start_time`, `end_time`),
  INDEX `idx_reservation_date` (`reservation_date`),
  INDEX `idx_status` (`status`),
  INDEX `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='시설 예약';

-- 10. 지출 내역 테이블 (expenses)
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `category` ENUM('인건비', '유지보수', '공과금', '보험료', '기타') NOT NULL,
  `subcategory` VARCHAR(100) COMMENT '세부 카테고리',
  `expense_date` DATE NOT NULL COMMENT '지출일',
  `amount` DECIMAL(12, 2) NOT NULL COMMENT '지출 금액',
  `vendor` VARCHAR(255) COMMENT '거래처',
  `description` TEXT COMMENT '설명',
  `invoice_number` VARCHAR(100) COMMENT '계산서 번호',
  `attachment_url` VARCHAR(500) COMMENT '첨부파일 URL',
  `created_by` BIGINT NOT NULL COMMENT '등록한 관리자',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_expense_date` (`expense_date`),
  INDEX `idx_vendor` (`vendor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='지출 내역';

-- 11. 수입 내역 테이블 (incomes)
CREATE TABLE IF NOT EXISTS `incomes` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `category` ENUM('관리비', '시설이용료', '주차비', '기타') NOT NULL,
  `income_date` DATE NOT NULL COMMENT '수입일',
  `amount` DECIMAL(12, 2) NOT NULL COMMENT '수입 금액',
  `source` VARCHAR(255) COMMENT '수입원',
  `description` TEXT COMMENT '설명',
  `reference_id` BIGINT COMMENT '참조 ID (payment_id 또는 reservation_id)',
  `created_by` BIGINT NOT NULL COMMENT '등록한 관리자',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_income_date` (`income_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='수입 내역';

-- 12. 파일 업로드 테이블 (file_uploads)
CREATE TABLE IF NOT EXISTS `file_uploads` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `file_name` VARCHAR(255) NOT NULL COMMENT '파일명',
  `file_type` VARCHAR(100) COMMENT '파일 타입',
  `file_size` BIGINT COMMENT '파일 크기 (bytes)',
  `file_path` VARCHAR(500) NOT NULL COMMENT '파일 경로',
  `uploaded_by` BIGINT NOT NULL COMMENT '업로드한 사용자',
  `entity_type` VARCHAR(50) COMMENT '연관 엔티티 타입',
  `entity_id` BIGINT COMMENT '연관 엔티티 ID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`),
  INDEX `idx_entity` (`entity_type`, `entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='파일 업로드';

-- 13. 활동 로그 테이블 (activity_logs)
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `action` VARCHAR(100) NOT NULL COMMENT '활동 내용',
  `entity_type` VARCHAR(50) COMMENT '대상 엔티티',
  `entity_id` BIGINT COMMENT '대상 ID',
  `details` JSON COMMENT '상세 정보',
  `ip_address` VARCHAR(45) COMMENT 'IP 주소',
  `user_agent` TEXT COMMENT '사용자 에이전트',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_action` (`action`),
  INDEX `idx_entity` (`entity_type`, `entity_id`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='활동 로그';

-- 14. 일괄 청구 업로드 테이블 (bill_uploads)
CREATE TABLE IF NOT EXISTS `bill_uploads` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `upload_month` VARCHAR(7) NOT NULL COMMENT '청구 연월',
  `total_records` INT DEFAULT 0 COMMENT '총 레코드 수',
  `processed_records` INT DEFAULT 0 COMMENT '처리된 레코드 수',
  `failed_records` INT DEFAULT 0 COMMENT '실패한 레코드 수',
  `status` ENUM('업로드됨', '검증중', '검증완료', '처리중', '완료', '실패') NOT NULL DEFAULT '업로드됨',
  `validation_errors` JSON COMMENT '검증 오류',
  `uploaded_by` BIGINT NOT NULL,
  `processed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`),
  INDEX `idx_month` (`upload_month`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='일괄 청구 업로드';