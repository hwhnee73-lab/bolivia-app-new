-- bolivia_db.facilities definition

CREATE TABLE `facilities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '시설 이름 (예: 바비큐장, 피트니스 센터)',
  `description` text COMMENT '시설 설명',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='공용 시설';


-- bolivia_db.flyway_schema_history definition

CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- bolivia_db.households definition

CREATE TABLE `households` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `building_number` varchar(50) NOT NULL COMMENT '동 정보 (예: 101동)',
  `unit_number` varchar(50) NOT NULL COMMENT '호수 정보 (예: 501호)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_household` (`building_number`,`unit_number`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='세대 정보';


-- bolivia_db.users definition

CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `apt_code` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `dong` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `ho` varchar(255) DEFAULT NULL,
  `household_id` bigint NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` enum('RESIDENT','ADMIN') DEFAULT NULL,
  `status` enum('PENDING','ACTIVE','LOCKED') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- bolivia_db.announcements definition

CREATE TABLE `announcements` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `author_id` bigint NOT NULL COMMENT '작성자(관리자) ID',
  `title` varchar(255) NOT NULL COMMENT '공지사항 제목',
  `content` text NOT NULL COMMENT '공지사항 내용',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '작성일시',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='공지사항';


-- bolivia_db.bills definition

CREATE TABLE `bills` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `household_id` bigint NOT NULL COMMENT '청구 대상 세대 ID',
  `bill_month` varchar(7) NOT NULL COMMENT '청구 연월 (YYYY-MM 형식)',
  `bill_date` date NOT NULL COMMENT '청구 생성일(월 기준 1일로 세팅 가능)',
  `total_amount` decimal(12,2) NOT NULL COMMENT '총 청구 금액',
  `status` enum('미납','완납','부분납') NOT NULL DEFAULT '미납' COMMENT '납부 상태',
  `due_date` date NOT NULL COMMENT '납부 마감일',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '청구서 생성일시',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_bill_month` (`household_id`,`bill_month`),
  KEY `idx_bills_status` (`status`),
  CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='월별 관리비 청구서';


-- bolivia_db.community_posts definition

CREATE TABLE `community_posts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `author_id` bigint NOT NULL COMMENT '작성자 ID',
  `category` varchar(50) NOT NULL DEFAULT '자유게시판' COMMENT '게시판 분류 (예: 중고장터)',
  `title` varchar(255) NOT NULL COMMENT '게시글 제목',
  `content` text NOT NULL COMMENT '게시글 내용',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '작성일시',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `community_posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='커뮤니티 게시글';


-- bolivia_db.maintenance_requests definition

CREATE TABLE `maintenance_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `requester_id` bigint NOT NULL COMMENT '요청자(주민) ID',
  `category` varchar(50) NOT NULL COMMENT '문제 유형 (예: 배관, 전기)',
  `description` text NOT NULL COMMENT '상세 설명',
  `status` enum('접수됨','처리중','완료됨','보류') NOT NULL DEFAULT '접수됨' COMMENT '처리 상태',
  `assigned_admin_id` bigint DEFAULT NULL COMMENT '담당 관리자 ID',
  `completed_at` timestamp NULL DEFAULT NULL COMMENT '처리 완료일시',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '요청일시',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  `cost` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '처리 비용',
  PRIMARY KEY (`id`),
  KEY `requester_id` (`requester_id`),
  KEY `assigned_admin_id` (`assigned_admin_id`),
  KEY `idx_maintenance_requests_status` (`status`),
  CONSTRAINT `maintenance_requests_ibfk_1` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`),
  CONSTRAINT `maintenance_requests_ibfk_2` FOREIGN KEY (`assigned_admin_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='유지보수 요청';


-- bolivia_db.payments definition

CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bill_id` bigint NOT NULL COMMENT '관련 청구서 ID',
  `user_id` bigint NOT NULL COMMENT '결제자 ID',
  `payment_amount` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '결제 금액',
  `payment_method` varchar(50) NOT NULL COMMENT '결제 수단 (예: QR코드, 오프라인)',
  `payment_status` varchar(30) DEFAULT NULL COMMENT '결제 상태 (PENDING/COMPLETED 등)',
  `transaction_id` varchar(100) DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '결제일시',
  `receipt_url` varchar(500) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `bill_id` (`bill_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='결제 내역';


-- bolivia_db.reservations definition

CREATE TABLE `reservations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '예약자 ID',
  `facility_id` bigint NOT NULL COMMENT '예약 시설 ID',
  `start_time` datetime NOT NULL COMMENT '예약 시작 시간',
  `end_time` datetime NOT NULL COMMENT '예약 종료 시간',
  `status` enum('승인대기','승인됨','거절됨','취소됨') NOT NULL DEFAULT '승인대기' COMMENT '예약 상태',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '예약 신청일시',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '상태 변경일시',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `facility_id` (`facility_id`),
  KEY `idx_reservations_status` (`status`),
  KEY `idx_reservations_time` (`start_time`,`end_time`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='공용 시설 예약';


-- bolivia_db.bill_items definition

CREATE TABLE `bill_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bill_id` bigint NOT NULL COMMENT '청구서 ID',
  `item_name` varchar(100) NOT NULL COMMENT '항목명 (예: 일반관리비, 수도요금)',
  `amount` decimal(12,2) NOT NULL COMMENT '항목 금액',
  PRIMARY KEY (`id`),
  KEY `bill_id` (`bill_id`),
  CONSTRAINT `bill_items_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='청구서 상세 항목';
