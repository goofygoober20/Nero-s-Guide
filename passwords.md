# 🔐 The Password & Security Guide

<div class="meta-info">
  <span>📅 Last Updated: May 28th 2026</span>
</div>

::: info Reminder
Your online security is only as strong as your weakest password. Your security is worth the effort. One good password manager and 2FA app will protect everything.
:::


## 📚 Table of Contents

<details open>
<summary>Click to expand/collapse</summary>

- [🔍 Check If You've Been Pwned](#check-pwned)
- [🔐 Password Managers](#password-managers)
- [🔢 Two-Factor Authentication (2FA)](#2fa)
- [📊 Password Strength Chart](#strength-chart)
- [📑 Credits & Resources](#credits)


</details>


## 🔍 Check If You've Been Pwned {#check-pwned}

**[Have I Been Pwned](https://haveibeenpwned.com/Passwords)** is a free service that checks if your passwords have appeared in known data breaches.

> **18+ billion monthly requests** are processed through this service,  it's trusted worldwide.

## 🔐 Password Managers {#password-managers}

Password managers generate, store, and auto-fill strong unique passwords. You only need to remember **one master password**, we highly recommend utilizing one. 

> 🎯 **Not sure which password manager is right for you?** [Take the Password Manager Quiz →](/password-quiz)

## 🔢 Two-Factor Authentication (2FA) {#2fa}

2FA adds a second layer of security. A password + something you have (code from an app or hardware key).

| Type | Security | Convenience | Best For |
|------|----------|------------------|----------|
| **Hardware Key (YubiKey)** |   High | Medium | High-value accounts |
| **TOTP (Authenticator App)** | Medium | High | Most accounts |
| **SMS Text Codes** | Low  | High | Only when nothing else available |

### 📋 2FA Directory

**[2FA Directory](https://2fa.directory)** - A comprehensive list of websites that support 2FA, with details on which methods they offer.

> Always check this site before signing up for a service to ensure it supports proper 2FA.


🔒 **Need help choosing a 2FA app?** [Take the 2FA App Quiz](/2fa-quiz)


## 📊 Password Strength Chart {#strength-chart}

| Password Type | Example | Time to Crack | Verdict |
|---------------|---------|---------------|---------|
| Common dictionary | `password123` | Instant | ❌ Useless |
| 8 characters, mixed case | `P@ssw0rd` | ~1 hour | ❌ Very weak |
| 10 characters, random | `xK9#mP2$vL` | ~5 years | ⚠️ Moderate |
| 12+ characters, random | `g7#mK9$xR2@vL` | ~200 years | ✅ Strong |
| 20+ characters, random | `9x#KmP2$vL8@nQ5&wR3` | Millions of years | 🔒 Unbreakable |

> **Source:** Hive Systems Password Table

Need help creating a password? [Check out our password generator](tools/password-generator)

Already have a password? [Test your password's strength](tools/password-strength-tester)


## 📑 Credits & Resources {#credits}

### Tools Mentioned
- [Have I Been Pwned](https://haveibeenpwned.com/Passwords) — Check breached passwords
- [2FA Directory](https://2fa.directory) — Find 2FA-enabled sites
- [Bitwarden](https://bitwarden.com) — Recommended password manager
- [Ente Auth](https://ente.io/auth) — Recommended 2FA app

### Further Reading
- [NIST SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html) — Digital identity guidelines (section 5.1.1.1 for password rules)
- [Hive Systems Password Table](https://www.hivesystems.io/password) — Interactive cracking time estimate
