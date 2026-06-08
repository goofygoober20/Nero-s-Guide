---
title: Password & Security Guide
description: Everything you need to know about passwords, 2FA, and keeping your accounts secure.
---

# The Password & Security Guide

<div class="guide-hero">
  <p class="guide-meta"><GuideIcon name="clock" :size="14" /> Last Updated: June 8th 2026</p>
  <p class="guide-intro">Your online security is only as strong as your weakest password. This guide covers password managers, two-factor authentication, breach checking, and best practices to keep your accounts safe.</p>
</div>

## Table of Contents

<details open>
<summary>Click to expand/collapse</summary>

- [Check If You've Been Pwned](#check-pwned)
- [Password Managers](#password-managers)
- [Two-Factor Authentication](#2fa)
- [Password Strength Chart](#strength-chart)
- [Tools](#tools)
- [Credits & Resources](#credits)

</details>

## Check If You've Been Pwned {#check-pwned}

<div class="pwned-card">
  <div class="pwned-body">
    <h3>Have I Been Pwned</h3>
    <p>A free service that checks if your passwords or email have appeared in known data breaches. Trusted worldwide with over 18+ billion monthly requests.</p>
    <a href="https://haveibeenpwned.com/Passwords" target="_blank" class="external-btn">Check Your Passwords &rarr;</a>
  </div>
</div>

### What to do if you've been pwned

<div class="steps-grid">
  <div class="step-card">
    <span class="step-number">1</span>
    <div>
      <strong>Change the compromised password immediately</strong>
      <p>Use your password manager to generate a new, unique one.</p>
    </div>
  </div>
  <div class="step-card">
    <span class="step-number">2</span>
    <div>
      <strong>Check for password reuse</strong>
      <p>If you used that password elsewhere, change it on every site.</p>
    </div>
  </div>
  <div class="step-card">
    <span class="step-number">3</span>
    <div>
      <strong>Enable 2FA on the account</strong>
      <p>Add a second layer of protection to prevent future breaches.</p>
    </div>
  </div>
  <div class="step-card">
    <span class="step-number">4</span>
    <div>
      <strong>Monitor your other accounts</strong>
      <p>Check your email for suspicious activity and log out of unknown devices.</p>
    </div>
  </div>
</div>

## Password Managers {#password-managers}

Password managers generate, store, and auto-fill strong unique passwords. You only need to remember <strong>one master password</strong>.

<div class="manager-grid">
  <div class="manager-card">
    <GuideIcon name="lock" class="manager-icon" />
    <h4>Bitwarden</h4>
    <div class="manager-tags">
      <span class="tag tag-green">Open Source</span>
      <span class="tag tag-green">Free Tier</span>
      <span class="tag tag-green">2FA</span>
    </div>
    <p>Best overall. Unlimited devices on the free plan with all core features.</p>
    <a href="https://bitwarden.com" target="_blank" class="manager-link">Visit &rarr;</a>
  </div>
  <div class="manager-card">
    <GuideIcon name="lock" class="manager-icon" />
    <h4>Proton Pass</h4>
    <div class="manager-tags">
      <span class="tag tag-green">Open Source</span>
      <span class="tag tag-green">Free Tier</span>
      <span class="tag tag-green">2FA</span>
    </div>
    <p>Privacy-first from the makers of Proton Mail. Built-in email aliasing.</p>
    <a href="https://proton.me/pass" target="_blank" class="manager-link">Visit &rarr;</a>
  </div>
  <div class="manager-card">
    <GuideIcon name="lock" class="manager-icon" />
    <h4>KeePassXC</h4>
    <div class="manager-tags">
      <span class="tag tag-green">Open Source</span>
      <span class="tag tag-green">Free</span>
      <span class="tag tag-green">Local</span>
    </div>
    <p>Best local-only option. Full control over your encrypted database file.</p>
    <a href="https://keepassxc.org" target="_blank" class="manager-link">Visit &rarr;</a>
  </div>
  <div class="manager-card">
    <GuideIcon name="globe" class="manager-icon" />
    <h4>VaultWarden</h4>
    <div class="manager-tags">
      <span class="tag tag-green">Open Source</span>
      <span class="tag tag-green">Free</span>
      <span class="tag tag-green">Self-Host</span>
    </div>
    <p>Lightweight self-hosted Bitwarden-compatible server for full data control.</p>
    <a href="https://github.com/dani-garcia/vaultwarden" target="_blank" class="manager-link">Visit &rarr;</a>
  </div>
</div>

<blockquote class="quiz-callout">
  <strong>Not sure which is right for you?</strong>
  <a href="/password-quiz">Take the Password Manager Quiz &rarr;</a>
</blockquote>

## Two-Factor Authentication {#2fa}

2FA adds a second layer of security &mdash; something you know (password) + something you have (a code from an app or hardware key).

<div class="fa-grid">
  <div class="fa-card">
    <div class="fa-header high">
      <GuideIcon name="lock" class="fa-header-icon" />
      <div>
        <h4>Hardware Key</h4>
        <span class="fa-security">Security: <strong>High</strong></span>
      </div>
    </div>
    <p>Physical device like a YubiKey. The most secure 2FA method available.</p>
    <span class="fa-best">Best for: High-value accounts (email, banking)</span>
  </div>
  <div class="fa-card">
    <div class="fa-header medium">
      <GuideIcon name="phone" class="fa-header-icon" />
      <div>
        <h4>TOTP App</h4>
        <span class="fa-security">Security: <strong>Medium</strong></span>
      </div>
    </div>
    <p>Time-based one-time codes from an authenticator app like Ente Auth.</p>
    <span class="fa-best">Best for: Most everyday accounts</span>
  </div>
  <div class="fa-card">
    <div class="fa-header low">
      <GuideIcon name="chat" class="fa-header-icon" />
      <div>
        <h4>SMS Codes</h4>
        <span class="fa-security">Security: <strong>Low</strong></span>
      </div>
    </div>
    <p>Texted codes &mdash; vulnerable to SIM swapping attacks. Avoid when possible.</p>
    <span class="fa-best">Only when nothing else is available</span>
  </div>
</div>

<div class="fa-directory-card">
  <div class="fa-dir-body">
    <h4>2FA Directory</h4>
    <p>A comprehensive list of websites that support 2FA, with details on which methods they offer. Check this before signing up for any service.</p>
    <a href="https://2fa.directory" target="_blank" class="external-btn">Browse 2FA Directory &rarr;</a>
  </div>
</div>

<blockquote class="quiz-callout">
  <strong>Need help choosing a 2FA app?</strong>
  <a href="/2fa-quiz">Take the 2FA App Quiz &rarr;</a>
</blockquote>

## Password Strength Chart {#strength-chart}

<div class="strength-chart">
  <div class="strength-row danger">
    <div class="strength-left">
      <div class="strength-label">Common dictionary</div>
      <div class="strength-example"><code>password123</code></div>
    </div>
    <div class="strength-center">
      <div class="strength-bar" style="width: 10%; background: #e74c3c;"></div>
    </div>
    <div class="strength-right">
      <div class="strength-time">Instant</div>
      <span class="strength-verdict verdict-danger">&#10060; Useless</span>
    </div>
  </div>
  <div class="strength-row warning">
    <div class="strength-left">
      <div class="strength-label">8 chars, mixed case</div>
      <div class="strength-example"><code>P@ssw0rd</code></div>
    </div>
    <div class="strength-center">
      <div class="strength-bar" style="width: 25%; background: #e67e22;"></div>
    </div>
    <div class="strength-right">
      <div class="strength-time">~1 hour</div>
      <span class="strength-verdict verdict-warning">&#10060; Very weak</span>
    </div>
  </div>
  <div class="strength-row medium-tier">
    <div class="strength-left">
      <div class="strength-label">10 chars, random</div>
      <div class="strength-example"><code>xK9#mP2$vL</code></div>
    </div>
    <div class="strength-center">
      <div class="strength-bar" style="width: 50%; background: #f39c12;"></div>
    </div>
    <div class="strength-right">
      <div class="strength-time">~5 years</div>
      <span class="strength-verdict verdict-medium">&#9888;&#65039; Moderate</span>
    </div>
  </div>
  <div class="strength-row good">
    <div class="strength-left">
      <div class="strength-label">12+ chars, random</div>
      <div class="strength-example"><code>g7#mK9$xR2@vL</code></div>
    </div>
    <div class="strength-center">
      <div class="strength-bar" style="width: 75%; background: #27ae60;"></div>
    </div>
    <div class="strength-right">
      <div class="strength-time">~200 years</div>
      <span class="strength-verdict verdict-good">&#10004;&#65039; Strong</span>
    </div>
  </div>
  <div class="strength-row best">
    <div class="strength-left">
      <div class="strength-label">20+ chars, random</div>
      <div class="strength-example"><code>9x#KmP2$vL8@nQ5&amp;wR3</code></div>
    </div>
    <div class="strength-center">
      <div class="strength-bar" style="width: 100%; background: #2ecc71;"></div>
    </div>
    <div class="strength-right">
      <div class="strength-time">Millions of years</div>
      <span class="strength-verdict verdict-best">&#128274; Unbreakable</span>
    </div>
  </div>
</div>

<p class="strength-source">Source: Hive Systems Password Table</p>

## Credits & Resources {#credits}

<div class="resource-grid">
  <a href="https://haveibeenpwned.com/Passwords" target="_blank" class="resource-card">
    <GuideIcon name="search" class="resource-icon" />
    <div class="resource-body">
      <h4>Have I Been Pwned</h4>
      <p>Check if your passwords or email have appeared in known data breaches</p>
    </div>
  </a>
  <a href="https://2fa.directory" target="_blank" class="resource-card">
    <GuideIcon name="list" class="resource-icon" />
    <div class="resource-body">
      <h4>2FA Directory</h4>
      <p>Find which websites support two-factor authentication and which methods</p>
    </div>
  </a>
  <a href="https://bitwarden.com" target="_blank" class="resource-card">
    <GuideIcon name="lock" class="resource-icon" />
    <div class="resource-body">
      <h4>Bitwarden</h4>
      <p>Recommended open-source password manager with a generous free tier</p>
    </div>
  </a>
  <a href="https://ente.io/auth" target="_blank" class="resource-card">
    <GuideIcon name="phone" class="resource-icon" />
    <div class="resource-body">
      <h4>Ente Auth</h4>
      <p>Recommended open-source 2FA authenticator app</p>
    </div>
  </a>
  <a href="https://pages.nist.gov/800-63-3/sp800-63b.html" target="_blank" class="resource-card">
    <GuideIcon name="book" class="resource-icon" />
    <div class="resource-body">
      <h4>NIST SP 800-63B</h4>
      <p>Official digital identity guidelines for password security rules</p>
    </div>
  </a>
  <a href="https://www.hivesystems.io/password" target="_blank" class="resource-card">
    <GuideIcon name="chart" class="resource-icon" />
    <div class="resource-body">
      <h4>Hive Systems Password Table</h4>
      <p>Interactive password cracking time estimates and research</p>
    </div>
  </a>
</div>

<style scoped>
.guide-hero {
  text-align: center;
  padding: 1rem 1rem 1.5rem;
  position: relative;
  overflow: hidden;
}

.guide-meta {
  position: relative;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin: 0 0 0.5rem;
}

.guide-intro {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

/* Tip box */
.about-tip {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: var(--vp-c-brand-soft);
  border: 1px solid var(--vp-c-divider);
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 1rem 0;
}

.tip-icon {
  flex-shrink: 0;
  font-size: 1.1rem;
}

details {
  margin-bottom: 1.5rem;
}

/* Pwned card */
.pwned-card {
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  padding: 1.5rem;
  margin-bottom: 2rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.pwned-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.pwned-body h3 {
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
}

.pwned-body p {
  margin: 0 0 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.5;
}

.external-btn {
  display: inline-block;
  padding: 0.55rem 1.2rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  background: var(--vp-c-brand-1);
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}

.external-btn:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

/* Remediation steps */
.steps-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.step-card {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-card div strong {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 0.15rem;
}

.step-card div p {
  margin: 0;
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

/* Manager grid */
.manager-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.5rem 0;
}

.manager-card {
  padding: 1.25rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.manager-card:hover {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand-1);
}

.manager-icon {
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
}

.manager-card h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.manager-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 0.6rem;
}

.tag {
  display: inline-block;
  font-size: 0.63rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.tag-green {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.manager-card p {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
  margin: 0 0 0.75rem;
}

.manager-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.manager-link:hover {
  text-decoration: underline;
}

/* Quiz callout */
.quiz-callout {
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  margin: 1.5rem 0;
  font-style: normal;
}

.quiz-callout a {
  display: inline-block;
  margin-left: 0.3rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.quiz-callout a:hover {
  text-decoration: underline;
}

/* 2FA cards */
.fa-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin: 1.5rem 0;
}

.fa-card {
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.fa-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
}

.fa-header.high {
  background: rgba(46, 204, 113, 0.12);
}

.fa-header.medium {
  background: rgba(243, 156, 18, 0.12);
}

.fa-header.low {
  background: rgba(231, 76, 60, 0.1);
}

.fa-header-icon {
  font-size: 1.3rem;
}

.fa-header h4 {
  margin: 0;
  font-size: 0.95rem;
}

.fa-security {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}

.fa-card p {
  padding: 0.75rem 1.1rem 0;
  margin: 0;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

.fa-best {
  display: block;
  padding: 0.5rem 1.1rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

/* 2FA directory card */
.fa-directory-card {
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  padding: 1.25rem;
  margin: 1.5rem 0;
}

.fa-dir-body h4 {
  margin: 0 0 0.4rem;
  font-size: 1rem;
}

.fa-dir-body p {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* Strength chart */
.strength-chart {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.strength-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.strength-left {
  min-width: 140px;
}

.strength-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.strength-example {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  margin-top: 0.1rem;
}

.strength-example code {
  font-size: 0.72rem;
  background: var(--vp-c-bg);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  color: var(--vp-c-text-2);
}

.strength-center {
  flex: 1;
  height: 8px;
  background: var(--vp-c-bg);
  border-radius: 4px;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.strength-right {
  text-align: right;
  min-width: 120px;
}

.strength-time {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.strength-verdict {
  font-size: 0.72rem;
  font-weight: 600;
}

.verdict-danger { color: #e74c3c; }
.verdict-warning { color: #e67e22; }
.verdict-medium { color: #f39c12; }
.verdict-good { color: #27ae60; }
.verdict-best { color: #2ecc71; }

.strength-source {
  text-align: center;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-top: 0.75rem;
}

/* Resource grid (matching sleeping.md pattern) */
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.resource-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.resource-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand-1);
}

.resource-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.resource-body h4 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.resource-body p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

@media (max-width: 640px) {
  .steps-grid {
    grid-template-columns: 1fr;
  }

  .manager-grid {
    grid-template-columns: 1fr;
  }

  .fa-grid {
    grid-template-columns: 1fr;
  }

  .tool-grid {
    grid-template-columns: 1fr;
  }

  .resource-grid {
    grid-template-columns: 1fr;
  }

  .strength-row {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .strength-left {
    min-width: 100%;
  }

  .strength-right {
    min-width: 100%;
    text-align: left;
  }
}
</style>
