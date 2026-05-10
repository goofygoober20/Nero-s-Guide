# 🔐 The Ultimate Password & Security Guide

<div class="meta-info">
  <span>✍️ Written by <strong>Nero</strong></span>
  <span>📅 Updated: May 2026</span>
</div>

::: info Reminder
Your online security is only as strong as your weakest password. This guide covers everything from creating unbreakable passwords to managing 2FA like a pro. Your security is worth the effort. One good password manager and 2FA app will protect everything.
:::

:::warning ⚠️ The Truth

**Password reuse is the #1 security mistake people make.**

When credentials are exposed in data breaches, attackers use automated tools to try those same email/password combinations on hundreds of other sites (Gmail, PayPal, Amazon, etc.). This is called **Credential Stuffing**, and it's devastatingly effective.
:::

## 📚 Table of Contents

<details open>
<summary>Click to expand/collapse</summary>

- [🚀 Quick Start](#quick-start)
- [🔍 Check If You've Been Pwned](#check-pwned)
- [🔐 Password Managers](#password-managers)
- [🔢 Two-Factor Authentication (2FA)](#2fa)
- [🛠️ 2FA Apps](#2fa-apps)
- [🔑 Hardware Keys (YubiKey)](#hardware-keys)
- [🖥️ Self-Hosted Options](#self-hosted)
- [📊 Password Strength Chart](#strength-chart)
- [📝 Best Practices](#best-practices)

</details>

---

## 🚀 Quick Start {#quick-start}

**TL;DR:** Use a password manager, enable 2FA on everything, and never reuse passwords.

| Do This | Not This |
|---------|----------|
| ✅ Use a password manager | ❌ Remembering passwords in your head |
| ✅ Generate random 20+ character passwords | ❌ "Password123" or your pet's name |
| ✅ Enable 2FA on every account | ❌ SMS text codes (least secure) |
| ✅ Check if you've been pwned | ❌ Ignoring breach notifications |

---

## 🔍 Check If You've Been Pwned {#check-pwned}

**[Have I Been Pwned](https://haveibeenpwned.com/Passwords)** is a free service that checks if your passwords have appeared in known data breaches.

### How It Works (Privacy Protected)

Your password is checked using **k-anonymity** — your full password is never sent to their servers:

1. Your password is converted into a SHA-1 hash locally
2. Only the **first 5 characters** of the hash are sent to the API
3. The service returns all suffix matches
4. Your browser completes the comparison locally

### What the Results Mean

| Result | Meaning | Action |
|--------|---------|--------|
| **"No pwnage found"** | Password not in known breaches | Still use a unique password |
| **"Oh no — pwned!"** | Password has appeared in breaches | ❌ NEVER use this password anywhere |

> **18+ billion monthly requests** are processed through this service — it's trusted worldwide.

---

## 🔐 Password Managers {#password-managers}

Password managers generate, store, and auto-fill strong unique passwords. You only need to remember **one master password**.

### Top Recommendations

| Manager | Platform | Price | Best For |
|---------|----------|-------|----------|
| **[Bitwarden](https://bitwarden.com)** | All platforms | Free / $10/yr | Overall best (open source) |
| **[Proton Pass](https://proton.me/pass)** | All platforms | Free / Premium | Privacy-focused users |
| **[KeePass](https://keepass.info)** | Windows | Free (open source) | Advanced users, offline storage |
| **[KeePassXC](https://keepassxc.org)** | Win/Mac/Linux | Free (open source) | Cross-platform KeePass fork |
| **[1Password](https://1password.com)** | All platforms | ~$36/yr | Polished UI, family sharing |
| **[LessPass](https://lesspass.com)** | Web/CLI | Free | Stateless password generator |

### Bitwarden Alternative Clients

| Client | Platform | Description |
|--------|----------|-------------|
| **VaultWarden** | Self-hosted | Unofficial Bitwarden server backend |
| **Bitwarden CLI** | Terminal | Command-line access |
| **KeeWeb** | Web/Desktop | KeePass-compatible web client |

### KeePass Ecosystem

| Tool | Purpose |
|------|---------|
| **KeePass** | Original Windows client |
| **KeePassXC** | Cross-platform fork (recommended) |
| **KeePass2Android** | Android client |
| **Strongbox** | iOS client (KeePass-compatible) |
| **Plugins** | Hundreds available for customization |
| **Read-Only mode** | Prevent accidental database changes |

### Other Options

| Tool | Description |
|------|-------------|
| **Pashword** | URL-based password generator |
| **Spectre** | Password manager with local encryption |

---

## 🔢 Two-Factor Authentication (2FA) {#2fa}

2FA adds a second layer of security — something you know (password) + something you have (code from an app or hardware key).

### Types of 2FA (Best to Worst)

| Type | Security | Convenience | Best For |
|------|----------|-------------|----------|
| **Hardware Key (YubiKey)** | 🔒🔒🔒🔒🔒 | Medium | High-value accounts |
| **TOTP (Authenticator App)** | 🔒🔒🔒🔒 | High | Most accounts |
| **SMS Text Codes** | 🔒 | High | ⚠️ Only when nothing else available |

### 📋 2FA Directory

**[2FA Directory](https://2fa.directory)** — A comprehensive list of websites that support 2FA, with details on which methods they offer.

> Always check this site before signing up for a service to ensure it supports proper 2FA.

---

## 🛠️ 2FA Apps {#2fa-apps}

### Best TOTP Authenticator Apps

| App | Platform | Features |
|-----|----------|----------|
| **[Ente Auth](https://ente.io/auth)** | All platforms | Open source, cross-platform sync, encrypted backups |
| **[Aegis](https://getaegis.app)** | Android | Open source, encrypted exports, biometric lock |
| **[2FAS](https://2fas.com)** | iOS/Android | Cloud backup, browser extension |
| **[Proton Authenticator](https://proton.me/blog/proton-authenticator)** | All platforms | End-to-end encrypted |
| **[Stratum](https://stratumauth.com)** | iOS | Open source, Watch app |
| **[OTP Auth](https://cooperrs.de/otpauth.html)** | iOS | Apple Watch support, iCloud sync |
| **[Tofu](https://tofu.auth.com)** | iOS | Minimalist, open source |
| **[FreeOTPPlus](https://github.com/helloworld1/FreeOTPPlus)** | Android | Fork of Red Hat's FreeOTP |
| **[Mauth](https://github.com/X1aomu/Mauth)** | iOS | Simple and clean |
| **[AuthMe](https://authme.software)** | Android | Open source, material design |
| **[OTPClient](https://github.com/paolostivanin/OTPClient)** | Linux | Desktop OTP client |

### Browser Extensions

| Extension | Platform | Description |
|-----------|----------|-------------|
| **[Authenticator](https://github.com/Authenticator-Extension/Authenticator)** | Chrome/Edge/Firefox | TOTP in your browser |

### Steam-Specific

| Tool | Platform | Description |
|------|----------|-------------|
| **[steamguard-cli](https://github.com/dyc3/steamguard-cli)** | CLI | Generate Steam 2FA codes, confirm trades |

### Token Extraction

| Tool | Purpose |
|------|---------|
| **[OTP Helper](https://github.com/ente-io/OTP-Helper)** | Extract OTP tokens from screenshots or QR codes |

---

## 🔑 Hardware Keys (YubiKey) {#hardware-keys}

YubiKeys are physical USB/NFC devices that provide the strongest 2FA protection.

### YubiKey Compatible Apps

| App | Platform | YubiKey Support |
|-----|----------|-----------------|
| **[Yubioath](https://www.yubico.com/products/yubico-authenticator/)** | Desktop/Mobile | Full TOTP + FIDO2 |
| **[KeePassXC](https://keepassxc.org/docs/KeePassXC_UserGuide.html#_yubikey_challenge_response)** | Win/Mac/Linux | Challenge-response + 2FA |
| **Bitwarden** | All platforms | FIDO2 WebAuthn |
| **Proton Pass** | All platforms | Hardware key support |

---

## 🖥️ Self-Hosted Options {#self-hosted}

For users who want full control over their data:

| Tool | Purpose | Description |
|------|---------|-------------|
| **[VaultWarden](https://github.com/dani-garcia/vaultwarden)** | Password Manager | Unofficial Bitwarden server (lightweight) |
| **[2FAuth](https://github.com/Bubka/2FAuth)** | 2FA | Web-based TOTP manager |
| **[Bitwarden Self-Host](https://bitwarden.com/self-host/)** | Password Manager | Official self-hosted option |

---

## 📊 Password Strength Chart {#strength-chart}

| Password Type | Example | Time to Crack | Verdict |
|---------------|---------|---------------|---------|
| Common dictionary | `password123` | Instant | ❌ Useless |
| 8 characters, mixed case | `P@ssw0rd` | ~1 hour | ❌ Very weak |
| 10 characters, random | `xK9#mP2$vL` | ~5 years | ⚠️ Moderate |
| 12+ characters, random | `g7#mK9$xR2@vL` | ~200 years | ✅ Strong |
| 20+ characters, random | `9x#KmP2$vL8@nQ5&wR3` | Millions of years | 🔒 Unbreakable |

> **Source:** Hive Systems Password Table

### The Math

- A **12-character random password** (upper, lower, numbers, symbols) has ~6.5 x 10²³ possible combinations
- Even at 1 trillion guesses per second (unrealistically fast), it takes ~20,000 years to crack

---

## 📝 Best Practices {#best-practices}

### Password Rules

| Rule | Why |
|------|-----|
| **Never reuse passwords** | One breach doesn't compromise all accounts |
| **Minimum 16 characters** | Length > complexity |
| **Use random generation** | No patterns, dictionary words, or personal info |
| **Change only when compromised** | Regular changes aren't helpful (NIST guidelines) |

### Account Security Checklist

- [ ] Use a password manager for ALL accounts
- [ ] Enable 2FA on every account that supports it
- [ ] Keep backup codes in a secure location (not just your password manager)
- [ ] Use a unique email for important accounts (banking, primary email)
- [ ] Regularly check [Have I Been Pwned](https://haveibeenpwned.com) for your email and passwords

### What NOT to Do

| Don't | Why |
|-------|-----|
| ❌ Use personal info (birthday, pet name) | Easily found on social media |
| ❌ Use common substitutions (P@ssw0rd) | Attackers know these patterns |
| ❌ Write passwords on sticky notes | Physical security matters |
| ❌ Store passwords in browsers | Browser storage isn't properly encrypted |
| ❌ Share passwords via email/SMS | Plain text transmission |

---

## 🔄 Emergency Recovery

### If You've Been Pwned

1. **Change the password** immediately on the affected account
2. **Change the same password** on any other site where you reused it
3. **Enable 2FA** if you haven't already
4. **Check for unauthorized activity** (login history, connected apps, forwarding rules)
5. **Use a password manager** going forward

### Backup Your 2FA

Most authenticator apps allow exporting seeds/QR codes:

- **Ente Auth:** Encrypted cloud backup
- **Aegis:** Encrypted JSON export
- **2FAS:** Cloud backup via Google Drive
- **KeePassXC:** Store TOTP seeds alongside passwords

> ⚠️ **Store backup codes and 2FA seeds offline** (printed, encrypted USB, or secure offline storage).

---

## 📑 Credits & Resources

### Tools Mentioned
- [Have I Been Pwned](https://haveibeenpwned.com/Passwords) — Check breached passwords
- [2FA Directory](https://2fa.directory) — Find 2FA-enabled sites
- [Bitwarden](https://bitwarden.com) — Recommended password manager
- [Ente Auth](https://ente.io/auth) — Recommended 2FA app

### Further Reading
- [NIST SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html) — Digital identity guidelines (section 5.1.1.1 for password rules)
- [Hive Systems Password Table](https://www.hivesystems.io/password) — Interactive cracking time estimate
