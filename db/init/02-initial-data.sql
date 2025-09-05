-- Bolivia Condo Management System Initial Data
-- Version: 1.0.0
-- Date: 2025-09-05

USE bolivia_db;

-- 1. Insert sample households
INSERT INTO `households` (`building_number`, `unit_number`, `owner_name`, `phone_number`, `move_in_date`) VALUES
('101', '101', '김철수', '010-1111-1111', '2020-01-15'),
('101', '102', '이영희', '010-2222-2222', '2020-03-20'),
('101', '201', '박민수', '010-3333-3333', '2021-06-10'),
('101', '202', '정수진', '010-4444-4444', '2021-08-25'),
('102', '101', '최강호', '010-5555-5555', '2022-01-10'),
('102', '102', '한미라', '010-6666-6666', '2022-04-15'),
('102', '201', '오성민', '010-7777-7777', '2022-07-20'),
('102', '202', '임지원', '010-8888-8888', '2023-02-28');

-- 2. Insert admin users (Password: Admin123!)
-- BCrypt hash for 'Admin123!' = $2a$10$9vI3bAmaI8Q2x7D4iMjdReJQhQvz8Y.vNzQvQxPYZxKzT7Wk5bxH.
INSERT INTO `users` (`household_id`, `apt_code`, `dong`, `ho`, `display_name`, `email`, `password_hash`, `phone_number`, `role`, `status`) VALUES
(NULL, 'BOLIVIA', '0000000000', '0000000000', '시스템 관리자', 'admin@bolivia.com', '$2a$10$9vI3bAmaI8Q2x7D4iMjdReJQhQvz8Y.vNzQvQxPYZxKzT7Wk5bxH.', '010-0000-0001', 'ADMIN', 'ACTIVE'),
(NULL, 'BOLIVIA', '0000000000', '0000000001', '관리사무소', 'office@bolivia.com', '$2a$10$9vI3bAmaI8Q2x7D4iMjdReJQhQvz8Y.vNzQvQxPYZxKzT7Wk5bxH.', '010-0000-0002', 'ADMIN', 'ACTIVE');

-- 3. Insert resident users (Password: User123!)
-- BCrypt hash for 'User123!' = $2a$10$YqJLGXiJpCx0O.YyB7.QXeRCQRx7hL5kQXqVZJ2zM3YkGxnNz5YEa
INSERT INTO `users` (`household_id`, `apt_code`, `dong`, `ho`, `display_name`, `email`, `password_hash`, `phone_number`, `role`, `status`) VALUES
(1, 'BOLIVIA', '0000000101', '0000000101', '김철수', 'kim101@bolivia.com', '$2a$10$YqJLGXiJpCx0O.YyB7.QXeRCQRx7hL5kQXqVZJ2zM3YkGxnNz5YEa', '010-1111-1111', 'RESIDENT', 'ACTIVE'),
(2, 'BOLIVIA', '0000000101', '0000000102', '이영희', 'lee102@bolivia.com', '$2a$10$YqJLGXiJpCx0O.YyB7.QXeRCQRx7hL5kQXqVZJ2zM3YkGxnNz5YEa', '010-2222-2222', 'RESIDENT', 'ACTIVE'),
(3, 'BOLIVIA', '0000000101', '0000000201', '박민수', 'park201@bolivia.com', '$2a$10$YqJLGXiJpCx0O.YyB7.QXeRCQRx7hL5kQXqVZJ2zM3YkGxnNz5YEa', '010-3333-3333', 'RESIDENT', 'ACTIVE'),
(4, 'BOLIVIA', '0000000101', '0000000202', '정수진', 'jung202@bolivia.com', '$2a$10$YqJLGXiJpCx0O.YyB7.QXeRCQRx7hL5kQXqVZJ2zM3YkGxnNz5YEa', '010-4444-4444', 'RESIDENT', 'ACTIVE');

-- 4. Insert sample bills for current and previous month
INSERT INTO `bills` (`household_id`, `bill_month`, `bill_date`, `due_date`, `total_amount`, `status`, 
                      `general_fee`, `security_fee`, `cleaning_fee`, `elevator_fee`, 
                      `electricity_fee`, `water_fee`, `heating_fee`, `repair_fund`, `insurance_fee`) VALUES
-- 2025-08 Bills
(1, '2025-08', '2025-08-01', '2025-08-25', 450000.00, '완납', 150000, 30000, 20000, 15000, 80000, 35000, 70000, 30000, 20000),
(2, '2025-08', '2025-08-01', '2025-08-25', 420000.00, '완납', 150000, 30000, 20000, 15000, 65000, 30000, 60000, 30000, 20000),
(3, '2025-08', '2025-08-01', '2025-08-25', 480000.00, '완납', 150000, 30000, 20000, 15000, 90000, 40000, 85000, 30000, 20000),
(4, '2025-08', '2025-08-01', '2025-08-25', 430000.00, '부분납', 150000, 30000, 20000, 15000, 70000, 32000, 63000, 30000, 20000),

-- 2025-09 Bills (Current month)
(1, '2025-09', '2025-09-01', '2025-09-25', 460000.00, '미납', 150000, 30000, 20000, 15000, 85000, 36000, 74000, 30000, 20000),
(2, '2025-09', '2025-09-01', '2025-09-25', 435000.00, '미납', 150000, 30000, 20000, 15000, 70000, 33000, 67000, 30000, 20000),
(3, '2025-09', '2025-09-01', '2025-09-25', 490000.00, '미납', 150000, 30000, 20000, 15000, 95000, 42000, 88000, 30000, 20000),
(4, '2025-09', '2025-09-01', '2025-09-25', 445000.00, '미납', 150000, 30000, 20000, 15000, 75000, 35000, 70000, 30000, 20000);

-- 5. Insert sample payments
INSERT INTO `payments` (`bill_id`, `user_id`, `payment_amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`) VALUES
(1, 3, 450000.00, '계좌이체', '완료', 'TXN2025080101', '2025-08-10 10:30:00'),
(2, 4, 420000.00, '신용카드', '완료', 'TXN2025080102', '2025-08-12 14:20:00'),
(3, 5, 480000.00, '계좌이체', '완료', 'TXN2025080103', '2025-08-15 09:15:00'),
(4, 6, 300000.00, '계좌이체', '완료', 'TXN2025080104', '2025-08-20 16:45:00');

-- 6. Insert sample announcements
INSERT INTO `announcements` (`author_id`, `title`, `content`, `category`, `is_pinned`, `view_count`) VALUES
(1, '9월 정기 소독 안내', '9월 15일(일) 오전 10시부터 오후 2시까지 전체 동 정기 소독이 예정되어 있습니다. 해당 시간에는 출입을 자제해 주시기 바랍니다.', '정기점검', TRUE, 156),
(1, '주차장 보수 공사 안내', '지하 주차장 B2 구역 방수 공사가 9월 20일부터 22일까지 진행됩니다. 해당 구역 주차가 제한되오니 양해 부탁드립니다.', '일반', FALSE, 89),
(2, '2025년 추석 연휴 관리사무소 운영 안내', '추석 연휴 기간(9월 28일~10월 3일) 동안 관리사무소는 오전 9시부터 오후 1시까지 단축 운영합니다.', '일반', TRUE, 234),
(2, '엘리베이터 정기 점검', '9월 10일 오후 2시부터 5시까지 엘리베이터 정기 점검이 있습니다. 점검 시간 동안 계단을 이용해 주세요.', '정기점검', FALSE, 67);

-- 7. Insert sample facilities
INSERT INTO `facilities` (`facility_name`, `facility_type`, `location`, `capacity`, `hourly_rate`, `daily_rate`, `description`, `is_active`) VALUES
('대회의실', '회의실', '관리동 2층', 30, 20000.00, 150000.00, '프로젝터, 음향시설 완비된 대형 회의실', TRUE),
('소회의실', '회의실', '관리동 2층', 10, 10000.00, 70000.00, '소규모 모임에 적합한 회의실', TRUE),
('피트니스센터', '체육시설', '주민공동시설 B1', 50, 0.00, 0.00, '최신 운동기구가 구비된 피트니스 센터', TRUE),
('게스트하우스 A', '게스트룸', '관리동 3층', 4, 0.00, 80000.00, '원룸형 게스트하우스 (더블침대 1, 싱글침대 2)', TRUE),
('파티룸', '파티룸', '주민공동시설 1층', 20, 30000.00, 200000.00, '각종 파티 및 모임용 공간', TRUE);

-- 8. Insert sample reservations
INSERT INTO `reservations` (`facility_id`, `user_id`, `reservation_date`, `start_time`, `end_time`, `purpose`, `number_of_people`, `total_fee`, `status`) VALUES
(1, 3, '2025-09-10', '14:00:00', '16:00:00', '입주자 대표회의', 15, 40000.00, '승인'),
(2, 4, '2025-09-12', '10:00:00', '12:00:00', '독서모임', 8, 20000.00, '대기'),
(4, 5, '2025-09-14', '15:00:00', '12:00:00', '가족 방문', 3, 80000.00, '승인'),
(5, 6, '2025-09-20', '18:00:00', '22:00:00', '생일파티', 15, 120000.00, '대기');

-- 9. Insert sample maintenance tasks
INSERT INTO `tasks` (`requester_id`, `assigned_to`, `title`, `description`, `category`, `priority`, `status`, `location`, `cost`) VALUES
(3, 2, '욕실 수전 누수', '욕실 세면대 수전에서 물이 계속 떨어집니다.', '수도', '보통', '처리중', '101동 101호', 50000.00),
(4, 2, '현관문 잠금장치 고장', '현관문 디지털 도어락이 작동하지 않습니다.', '기타', '높음', '접수됨', '101동 102호', 0.00),
(5, NULL, '복도 전등 교체 요청', '3층 복도 전등이 깜빡거립니다.', '전기', '낮음', '접수됨', '101동 3층 복도', 0.00),
(6, 2, '엘리베이터 이상 소음', '엘리베이터 운행 시 이상한 소음이 발생합니다.', '엘리베이터', '긴급', '완료됨', '101동', 150000.00);

-- 10. Insert sample expenses
INSERT INTO `expenses` (`category`, `subcategory`, `expense_date`, `amount`, `vendor`, `description`, `created_by`) VALUES
('인건비', '관리직원 급여', '2025-08-25', 8500000.00, '관리사무소', '8월 직원 급여 (관리소장 외 4명)', 1),
('유지보수', '엘리베이터 정기점검', '2025-08-15', 350000.00, '한국엘리베이터(주)', '월간 정기 점검 및 부품 교체', 2),
('공과금', '전기료', '2025-08-20', 4200000.00, '한국전력공사', '8월 공용 전기료', 1),
('보험료', '화재보험', '2025-08-01', 850000.00, '삼성화재', '8월 건물 화재보험료', 1);

-- 11. Insert sample incomes
INSERT INTO `incomes` (`category`, `income_date`, `amount`, `source`, `description`, `reference_id`, `created_by`) VALUES
('관리비', '2025-08-10', 450000.00, '101동 101호', '8월 관리비 납부', 1, 1),
('관리비', '2025-08-12', 420000.00, '101동 102호', '8월 관리비 납부', 2, 1),
('시설이용료', '2025-08-15', 40000.00, '대회의실 대여', '회의실 이용료', NULL, 2),
('주차비', '2025-08-01', 150000.00, '방문객 주차', '8월 방문객 주차 수입', NULL, 2);

-- 12. Create indexes for performance optimization
CREATE INDEX idx_bills_household_status ON bills(household_id, status);
CREATE INDEX idx_payments_bill_status ON payments(bill_id, payment_status);
CREATE INDEX idx_users_email_password ON users(email, password_hash);
CREATE INDEX idx_tasks_requester_status ON tasks(requester_id, status);
CREATE INDEX idx_reservations_facility_date ON reservations(facility_id, reservation_date);