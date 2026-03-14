# Legacy Service Issues (com.example.bolivia)

## 1. Transaction Management Missing (UserBatchService)
- `confirm(String tokenKey)` in `UserBatchService.java` loops over users and calls `upsertOne()`.
- Neither method has `@Transactional`.
- If an exception occurs, partial changes are committed (e.g. `households` inserted but `user` fails), breaking atomicity.

## 2. SQL / Prepared Statement Practices (PaymentService)
- `itemsSql` uses string concatenation for `IN` clause: `... WHERE bill_id IN (" + billIds.stream().map(String::valueOf).collect(Collectors.joining(",")) + ")"`.
- Though safe against SQLi (because IDs are `Long`), it is poor practice. Should use `NamedParameterJdbcTemplate`.
