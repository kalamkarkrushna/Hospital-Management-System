# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

To report a security vulnerability, please open a private issue at:

https://github.com/kalamkarkrushna/Hospital-Management-System/security/advisories

You can expect an acknowledgment within 48 hours and a resolution timeline depending on severity.

## Security Practices

- JWT tokens are signed with HMAC-SHA and expire after 24 hours
- Passwords are hashed with BCrypt
- Rate limiting (20 req/min) is enforced on auth and admin endpoints
- CORS is restricted to the frontend origin
- SQL injection is prevented via Spring Data JDBC parameterized queries
- Multi-tenant data isolation is enforced via `hospital_id` on all queries
- HttpOnly cookies are used alongside Bearer tokens for JWT transmission
