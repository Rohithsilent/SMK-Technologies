# SMK TechVora Firestore Security Specification

## 1. Data Invariants
1. **Default Deny**: All paths default to `allow read, write: if false;`.
2. **PII Isolation**: `users/{userId}` (containing `email`) and `campus_enquiries/{enquiryId}` are never readable by arbitrary signed-in users. Public transcripts live exclusively in `public_transcripts/{handle}` with zero PII fields.
3. **Anti-Privilege-Escalation**: New user profiles created by non-admins must have `role == 'student'` and `uid == request.auth.uid`. Non-admins cannot alter `role` or `uid` on update.
4. **Ownership Integrity**: Every student-owned record (`diagnostic_attempts`, `topic_mastery`, `oa_submissions`, `project_submissions`, `public_transcripts`) enforces `userId == request.auth.uid` on create and immutability of `userId` and creation timestamps on update.
5. **Terminal State Locking**: Once a `project_submissions` document has `status == 'verified'`, students cannot overwrite it; only admins can modify rubric scores or mentor notes.
6. **Temporal & Size Integrity**: Every write validates `request.time` for server timestamps and enforces explicit `.size()` ceilings on all strings and document IDs (`isValidId`).

## 2. Dirty Dozen Payloads (Must Return PERMISSION_DENIED)
1. **Self-Admin Escalation**: `POST /users/{uid}` with `role: "admin"` by non-admin -> DENIED.
2. **Role Mutation Attack**: `PATCH /users/{uid}` changing `role` from `"student"` to `"mentor"` -> DENIED.
3. **Cross-User PII Read**: `GET /users/{otherUid}` by another student -> DENIED.
4. **Shadow Field Injection**: `POST /diagnostic_attempts/{id}` with extra field `isVerifiedAdmin: true` -> DENIED (`hasOnly`).
5. **Identity Spoofing**: `POST /oa_submissions/{id}` with `userId: "victim-uid"` -> DENIED.
6. **ID Poisoning**: `PUT /topic_mastery/{2000-char-junk-id}` -> DENIED (`isValidId`).
7. **Timestamp Forgery**: `POST /diagnostic_attempts/{id}` with client backdated `createdAt` -> DENIED (`== request.time`).
8. **Capstone Self-Grading**: Student `PATCH /project_submissions/{id}` setting `status: "verified"` or `rubricArchitecture: 10` -> DENIED.
9. **Terminal State Tampering**: Student `PATCH /project_submissions/{id}` after mentor verified it -> DENIED.
10. **Enquiry Scraping**: Non-admin `GET` or `LIST /campus_enquiries` -> DENIED.
11. **Unverified Admin Email Spoof**: Token with admin email but `email_verified: false` -> DENIED.
12. **Oversized Payload / Denial-of-Wallet**: `POST /campus_enquiries/{id}` with 100KB `note` -> DENIED (`size() <= 2000`).
