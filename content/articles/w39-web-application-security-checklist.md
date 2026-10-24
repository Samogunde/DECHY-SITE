---
slug: web-application-security-checklist
type: guides
category: guide
service: cybersecurity
title: Web Application Security Checklist Before You Launch | DECHY
description: "A practical web application security checklist: authentication, data protection, input validation, dependencies, infrastructure and monitoring before launch."
h1: Security Checklist Before You Launch a Web App
summary: "A practical web application security checklist: authentication, data protection, input validation, dependencies, infrastructure and monitoring before launch."
answer: "Before launching a web app, check six areas: login and access control, data protection, input handling, dependencies and updates, infrastructure settings, and monitoring and recovery. Most breaches come from basic mistakes, such as weak access control, unpatched software, exposed secrets and unvalidated input, not from exotic attacks. This checklist covers the essentials in plain language, so owners can ask the right questions and developers can tick the boxes."
intent: web application security checklist
date: 2026-10-24
author: DECHY Team
---

This is a practical guide, not a full security audit. Apps that handle payments, health data or other sensitive information should also get an independent security review.

## 1. Authentication and sessions

How users prove who they are.

- [ ] Passwords are stored using a strong, modern hashing method, never as plain text
- [ ] Minimum password rules are sensible, and common breached passwords are blocked
- [ ] Multi-factor authentication is available, and required for admin accounts
- [ ] Login attempts are rate limited, to slow down guessing attacks
- [ ] Password reset links expire quickly and work only once
- [ ] Sessions expire after inactivity, and logout truly ends the session
- [ ] Session cookies are marked Secure, HttpOnly and SameSite
- [ ] Error messages do not reveal whether an email exists
- [ ] A proven authentication service or library is used, instead of custom code

## 2. Authorization and access control

What each user is allowed to do. This is the most common serious flaw.

- [ ] Every request checks permissions on the server, not only in the interface
- [ ] Users cannot view or change other users' data by changing an ID in the URL
- [ ] Admin functions are separated and protected
- [ ] Roles follow the principle of least privilege
- [ ] API (the defined way one system shares data with another) endpoints enforce the same rules as the screens
- [ ] File uploads and downloads are checked for ownership
- [ ] Test accounts and default credentials are removed

Ask your developer to test what happens when user A tries to access user B's records. It should fail every time.

## 3. Data protection

- [ ] All traffic uses HTTPS, with a valid certificate and automatic renewal
- [ ] HTTP requests redirect to HTTPS, and HSTS is enabled
- [ ] Sensitive data is encrypted at rest, in databases and backups
- [ ] The app collects only the data it needs
- [ ] Payment details are handled by a certified payment provider, not stored on your servers
- [ ] Personal data is protected according to the laws that apply to you, such as GDPR (the EU's data protection law)
- [ ] Logs don't contain passwords, tokens or full card numbers
- [ ] Backups are encrypted, and restoring from them has been tested
- [ ] A data retention and deletion approach exists

## 4. Input handling

Attackers send unexpected input. Treat all input as untrusted.

- [ ] Every input is validated on the server, including forms, URLs, headers and uploads
- [ ] Database queries use parameterized queries, to prevent SQL injection
- [ ] Output is escaped properly, to prevent cross-site scripting (XSS)
- [ ] Forms are protected against cross-site request forgery (CSRF)
- [ ] File uploads restrict type and size, scan content and store files outside the web root
- [ ] Redirects and external links are validated
- [ ] Rate limits and spam protection are on public forms and APIs
- [ ] A content security policy limits what scripts can run

## 5. Secrets and configuration

- [ ] API keys, passwords and tokens are kept in environment variables or a secrets manager, not in code or repositories
- [ ] No secrets appear in front-end code, since anyone can read it
- [ ] Keys have the minimum permissions needed
- [ ] Production and test environments use different keys and databases
- [ ] Debug modes and detailed error pages are off in production
- [ ] Default admin pages, sample files and unused features are removed
- [ ] Security headers are set: Content-Security-Policy, X-Content-Type-Options, Referrer-Policy and others

If any secret was ever committed to a code repository, treat it as exposed and replace it.

## 6. Dependencies and updates

Modern apps rely on hundreds of third-party packages.

- [ ] All dependencies are up to date, with known vulnerabilities fixed
- [ ] An automated tool checks dependencies for security issues regularly
- [ ] Unused packages are removed
- [ ] The operating system, runtime and database are patched
- [ ] There is a process to apply security updates quickly after launch

Many real breaches come from known flaws in outdated software that nobody updated.

## 7. Infrastructure

- [ ] Servers and databases are not exposed to the public internet unless needed
- [ ] Firewalls and network rules allow only necessary traffic
- [ ] Administrative access uses keys or strong authentication, and is limited by IP or VPN where possible
- [ ] Cloud storage buckets are private by default, with permissions reviewed
- [ ] Separate accounts or environments exist for development, testing and production
- [ ] Access for team members is reviewed, and removed when they leave
- [ ] DDoS protection and a web application firewall are considered for public apps

## 8. Logging, monitoring and response

- [ ] Important events are logged: logins, failed logins, permission changes and admin actions
- [ ] Logs are stored safely and are hard to tamper with
- [ ] Alerts fire for suspicious activity and errors
- [ ] Uptime monitoring is in place
- [ ] An incident plan exists: who does what if something goes wrong
- [ ] Contact details for reporting a vulnerability are published
- [ ] Backups run automatically, and there is a tested recovery plan

## 9. Testing

- [ ] Automated tests cover critical flows, including permissions
- [ ] A security scan has been run, using automated tools for common issues
- [ ] Code is reviewed by someone other than the author
- [ ] For sensitive apps, an independent penetration test is carried out before launch
- [ ] Findings are fixed and re-tested, not just recorded

## 10. Privacy and legal

- [ ] A privacy policy explains what you collect and why
- [ ] A cookie notice and consent tool are in place, where required
- [ ] Terms of use are published
- [ ] You know which laws apply, such as GDPR, CCPA or industry rules
- [ ] Third-party services have been reviewed for data handling
- [ ] Users can request access to or deletion of their data, where required

This is general information, not legal advice. Check your obligations with a qualified professional.

## Five questions for your developer

1. **How do you prevent one user seeing another user's data?**
2. **Where are our passwords, keys and secrets stored?**
3. **How do you keep dependencies and servers updated?**
4. **What gets logged, and who is alerted if something looks wrong?**
5. **How would we recover if the database were lost or corrupted?**

Clear, confident answers are a good sign. Vague ones are a reason to dig deeper.

## Common mistakes

- Treating security as a final step instead of a part of every step
- Checking permissions in the front end only
- Leaving test data and default accounts in production
- Exposing secrets in code or screenshots
- Ignoring updates after launch
- No backups, or backups that were never tested
- Assuming the hosting provider handles everything

## How DECHY checks web application security

We use this checklist on the applications we build, and we can run it on yours. A security review with us costs {{fact:price.cybersecurity-security-review}}. It covers login, access rules, data handling, dependencies and hosting, and ends with a list of fixes in order of risk.

When you need deeper testing, a penetration test with fixes costs {{fact:price.cybersecurity-penetration-test-and-fixes}}. Hardening and monitoring costs {{fact:price.cybersecurity-hardening-and-monitoring}}. It adds alerts, logging and regular patching. Compliance readiness for frameworks such as SOC 2 or ISO 27001 costs {{fact:price.cybersecurity-compliance-readiness}}.

We explain each finding in plain language. You see what the risk is, how likely it is and what it would take to fix. Nothing is left as a vague warning.

Use the [cost estimator](/tools/cost-estimator/) for a range, or [ask us to review your application](/contact/) before your next launch.

## Frequently asked questions

### What is the most common web app security flaw?
Broken access control, where users can reach data or functions they should not. Test it carefully.

### Do I need a penetration test before launch?
For apps that handle payments, personal or health data, or business-critical information, yes. For simple sites, solid practices and automated scans may be enough.

### Is HTTPS enough to make my app secure?
No. HTTPS protects data in transit. You also need strong access control, input handling, updates and safe storage.

### How often should I update my app's dependencies?
Check weekly with automated tools, and apply security fixes quickly. Review the full set of dependencies at least monthly.

### What is OWASP?
A non-profit that publishes the widely used list of the most serious web application risks. Good developers use it as a baseline.

### What if I'm not technical?
Use this checklist to ask questions, and request a written security summary from your developer before launch. An independent review adds confidence for important apps.

## Next step

Getting ready to launch? We'll review your app against this checklist and tell you plainly what needs fixing first. [Talk to DECHY](/contact/).
