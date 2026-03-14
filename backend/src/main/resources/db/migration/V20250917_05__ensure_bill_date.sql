-- Ensure bills.bill_date exists and is populated to satisfy JPA validation

-- 1) Add column bill_date if missing
SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'bills'
     AND COLUMN_NAME = 'bill_date'
);
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE bills ADD COLUMN bill_date DATE NULL AFTER bill_month',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2) Backfill bill_date from bill_month (YYYY-MM -> YYYY-MM-01) if null
UPDATE bills
SET bill_date = COALESCE(
    STR_TO_DATE(CONCAT(bill_month, '-01'), '%Y-%m-%d'),
    due_date
)
WHERE bill_date IS NULL;

