# Security Policy

## 🔒 Overview

The Ark.Alliance.Portfolio project takes security seriously. This document outlines our security practices, supported versions, and how to report vulnerabilities.

---

## 📋 Table of Contents

- [Supported Versions](#supported-versions)
- [Security Features](#security-features)
- [Reporting a Vulnerability](#reporting-a-vulnerability)
- [Security Best Practices](#security-best-practices)
- [Dependency Management](#dependency-management)

---

## ✅ Supported Versions

We provide security updates for the following versions:

| Version | Supported          | Notes |
|---------|--------------------|-------|
| 1.x.x   | ✅ Active support   | Latest stable |
| 0.x.x   | ⚠️ Limited support  | Critical fixes only |

---

## 🛡️ Security Features

### Authentication & Authorization

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | bcrypt with cost factor 12 |
| **JWT Tokens** | HS256 algorithm with configurable expiration |
| **Role-Based Access** | Admin role for CMS operations |
| **Session Management** | Stateless JWT with refresh tokens (planned) |

### API Security

| Feature | Implementation |
|---------|----------------|
| **HTTPS** | Enforced in production |
| **CORS** | Configured whitelist of allowed origins |
| **Rate Limiting** | Request throttling (planned) |
| **Input Validation** | Zod schema validation on all endpoints |

### HTTP Security Headers

The backend uses [Helmet.js](https://helmetjs.github.io/) to set security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HSTS)
- `Content-Security-Policy` (customizable)

### Data Protection

| Feature | Implementation |
|---------|----------------|
| **API Key Encryption** | AES-256 encryption for stored AI API keys |
| **Environment Variables** | Sensitive config via `.env` (not committed) |
| **Database** | SQLite with file-level permissions |

---

## 🚨 Reporting a Vulnerability

We appreciate responsible disclosure of security vulnerabilities.

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities

2. **Email us** at: **security@ark-alliance.io**

3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

| Timeline | Action |
|----------|--------|
| **24 hours** | Acknowledgment of your report |
| **72 hours** | Initial assessment and severity classification |
| **7 days** | Status update with remediation plan |
| **30 days** | Target resolution for critical issues |

### Recognition

We believe in recognizing security researchers:
- Credit in release notes (with your permission)
- Hall of Fame listing (planned)

---

## 🔐 Security Best Practices

### For Developers

1. **Never commit secrets**
   ```bash
   # Use .env files (already in .gitignore)
   cp .env.example .env
   ```

2. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

3. **Use environment variables for sensitive data**
   ```typescript
   // ✅ Good
   const secret = process.env.JWT_SECRET;
   
   // ❌ Never do this
   const secret = "hardcoded-secret";
   ```

4. **Validate all inputs**
   ```typescript
   import { z } from 'zod';
   
   const LoginSchema = z.object({
       username: z.string().min(3).max(50),
       password: z.string().min(8)
   });
   ```

### For Deployment

1. **Use HTTPS in production**
2. **Set secure CORS origins**
3. **Enable HSTS**
4. **Use strong JWT secrets** (min 256 bits)
5. **Implement rate limiting**
6. **Enable audit logging**

### For Users

1. **Use strong, unique passwords**
2. **Keep your browser updated**
3. **Log out after admin sessions**
4. **Don't share admin credentials**

---

## 📦 Dependency Management

### Automated Scanning

- GitHub Dependabot enabled for security updates
- npm audit runs in CI pipeline
- Snyk integration (planned)

### Audit Commands

```bash
# Check for vulnerabilities
npm audit

# Fix automatically (when safe)
npm audit fix

# Full report
npm audit --json > audit-report.json
```

### Known Vulnerabilities

We aim to have **zero known high/critical vulnerabilities** in production dependencies.

| Severity | Policy |
|----------|--------|
| Critical | Patch within 24 hours |
| High | Patch within 7 days |
| Medium | Patch in next release |
| Low | Evaluate and schedule |

---

## 📜 Security Changelog

| Date | Description |
|------|-------------|
| 2024-12 | Added Helmet security headers |
| 2024-12 | Implemented JWT authentication |
| 2024-12 | Added bcrypt password hashing |
| 2024-12 | Encrypted AI API key storage |

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

<div align="center">
  <sub>Ark Alliance Ecosystem | © M2H.IO</sub>
</div>
