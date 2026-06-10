---
title: Dark Web Guide
description: An educational guide to understanding Tor, the dark web, and how to browse safely and anonymously.
---

# The Ultimate Dark Web Guide

<div class="guide-hero">
  <p class="guide-meta"><GuideIcon name="pencil" :size="14" /> Written by <strong>Nero</strong> &middot; <GuideIcon name="clock" :size="14" /> Updated: May 2026 &middot; <GuideIcon name="clock" :size="14" /> Read time: 10 min</p>
  <p class="guide-intro">An educational guide to the Tor network and dark web. Learn how to browse safely, protect your privacy, and understand the layers of the internet.</p>
</div>

::: danger ⚠️ IMPORTANT DISCLAIMER
This guide is for **educational purposes only**. The Tor browser is a legitimate privacy tool used by millions of people worldwide, including journalists, activists, law enforcement, and ordinary citizens. However, **you are responsible for your own actions**. Accessing illegal content or engaging in illicit activities can lead to serious legal consequences. This guide does not condone or encourage any illegal activity.
:::

## Important Warnings

### 1. The Dark Web is NOT a Game

<div class="warning-card">
  <strong>It's Dangerous</strong>
  <p>The dark web contains scams, malware, illegal marketplaces, and genuinely disturbing content. You <strong>will</strong> be found if you commit any serious crimes online - your complete privacy doesn't exist online.</p>
</div>

### 2. Your ISP Can See You Using Tor

<div class="warning-card">
  <strong>No Hidden Connection</strong>
  <p>Your Internet Service Provider can detect that you are connecting to the Tor network. While they cannot see what you're doing, they know you're using Tor.</p>
</div>

### 3. Tor is NOT a Virus Scanner

<div class="warning-card">
  <strong>No Built-in Protection</strong>
  <p>The Tor Browser has <strong>no built-in antivirus protection</strong>. Any file you download could be infected with malware. You are responsible for scanning files yourself.</p>
</div>

### 4. Logging In Ruins Anonymity

<div class="warning-card">
  <strong>Identity Exposure</strong>
  <p>If you log into your real email, social media, or any personal account while using Tor, you have <strong>destroyed your anonymity</strong>. The website will know exactly who you are.</p>
</div>

### 5. JavaScript is a Risk

<div class="warning-card">
  <strong>IP Leak Risk</strong>
  <p>Tor Browser disables JavaScript by default on HTTP sites, but <strong>manually enabling it can expose your real IP address</strong> through exploits. Leave JavaScript off unless absolutely necessary.</p>
</div>

### 6. Don't Maximize Your Browser Window

<div class="warning-card">
  <strong>Fingerprinting Risk</strong>
  <p>Maximizing your Tor Browser window can reveal your screen resolution, which can be used as a fingerprinting technique to identify you.</p>
</div>

### 7. Downloading is Dangerous

<div class="warning-card">
  <strong>Malware Risk</strong>
  <p>Downloading files through Tor is <strong>not recommended</strong> unless you know exactly what you're doing. Files can contain malware, trackers, or be used to deanonymize you.</p>
</div>

### 8. Know the Law in Your Country

<div class="warning-card">
  <strong>Legal Status Varies</strong>
  <p>Tor is legal in the USA, Canada, UK, and EU (with monitoring). It is restricted or illegal in China, Russia, Iran, Belarus, and Venezuela. Heavily restricted in North Korea, Turkmenistan, and Eritrea.</p>
</div>

<div class="about-tip">
  <GuideIcon name="info" class="tip-icon" />
  <span>If you are in a country where Tor is illegal, do not use it without proper protections (VPN before Tor).</span>
</div>

## What is Tor? {#what-is-tor}

**Tor** (The Onion Router) is free, open-source software that enables anonymous communication by directing your internet traffic through a worldwide volunteer network of servers (nodes).

<div class="card-grid-2">
  <div class="shared-card">
    <h4>Hides your IP address</h4>
    <p>Websites see a Tor exit node IP, not yours</p>
  </div>
  <div class="shared-card">
    <h4>Encrypts traffic multiple times</h4>
    <p>Like layers of an onion (hence the name)</p>
  </div>
  <div class="shared-card">
    <h4>No logs</h4>
    <p>The Tor network is designed not to keep records</p>
  </div>
  <div class="shared-card">
    <h4>Access to .onion sites</h4>
    <p>Special hidden services only reachable via Tor</p>
  </div>
</div>

<div class="about-tip">
  <GuideIcon name="info" class="tip-icon" />
  <span><strong>Who uses Tor legally?</strong> Journalists communicating with whistleblowers, law enforcement conducting undercover operations, activists avoiding censorship, IT professionals testing security, and ordinary citizens who value privacy.</span>
</div>

## The Surface Web vs Deep Web vs Dark Web {#web-layers}

<div class="card-grid-3">
  <div class="shared-card">
    <h4>Surface Web</h4>
    <p>Public websites indexed by Google. Accessible via standard browser. <em>Examples:</em> Reddit, Wikipedia, YouTube</p>
  </div>
  <div class="shared-card">
    <h4>Deep Web</h4>
    <p>Content not indexed (private databases, email, banking). Accessible via standard browser + login. <em>Examples:</em> Your Gmail, bank account</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Dark Web</h4>
    <p>Deliberately hidden websites. Accessible via Tor browser + .onion address. <em>Examples:</em> Darknet markets, whistleblower sites</p>
  </div>
</div>

## Step-by-Step Setup Guide {#setup-guide}

### Step 1: Download Tor Browser

<div class="resource-grid">
  <a href="https://www.torproject.org" target="_blank" class="resource-card">
    <GuideIcon name="globe" class="resource-icon" />
    <div class="resource-body">
      <h4>Official Website</h4>
      <p>https://www.torproject.org - download from here only</p>
    </div>
  </a>
</div>

::: warning
NEVER download Tor from third-party sites. Only use the official Tor Project website.
:::

### Step 2: Verify the Signature (Optional but Recommended)

<div class="card-grid-2">
  <div class="shared-card">
    <h4>Download</h4>
    <p>Download the <code>.asc</code> signature file</p>
  </div>
  <div class="shared-card">
    <h4>Import Key</h4>
    <p><code>gpg --auto-key-locate nodefault,wkd --locate-keys torbrowser@torproject.org</code></p>
  </div>
  <div class="shared-card">
    <h4>Verify</h4>
    <p><code>gpg --verify tor-browser-linux64-14.0.tar.xz.asc</code></p>
  </div>
</div>

### Step 3: Install and Launch

<div class="steps-grid">
  <div class="step-card">
    <span class="step-number">1</span>
    <div>
      <strong>Windows</strong>
      <p>Run the installer, follow prompts</p>
    </div>
  </div>
  <div class="step-card">
    <span class="step-number">2</span>
    <div>
      <strong>macOS</strong>
      <p>Drag Tor Browser to Applications folder</p>
    </div>
  </div>
  <div class="step-card">
    <span class="step-number">3</span>
    <div>
      <strong>Linux</strong>
      <p>Extract the archive, run <code>start-tor-browser.desktop</code></p>
    </div>
  </div>
  <div class="step-card">
    <span class="step-number">4</span>
    <div>
      <strong>Android</strong>
      <p>Download Tor Browser for Android from Google Play or F-Droid</p>
    </div>
  </div>
  <div class="step-card">
    <span class="step-number">5</span>
    <div>
      <strong>iOS</strong>
      <p>Use Onion Browser (recommended)</p>
    </div>
  </div>
</div>

### Step 4: Configure Security Settings

Tor Browser has three security levels:

<div class="card-grid-3">
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>Standard (Default)</h4>
    <p>JavaScript enabled on HTTPS. Fonts enabled. Click-to-play video/audio.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #f39c12;">
    <h4>Safer</h4>
    <p>JavaScript disabled on non-HTTPS. Fonts disabled. Click-to-play media.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Safest</h4>
    <p>JavaScript disabled everywhere. Fonts disabled. Click-to-play media.</p>
  </div>
</div>

<div class="about-tip">
  <GuideIcon name="info" class="tip-icon" />
  <span><strong>Recommendation:</strong> Set to <strong>Safest</strong> unless a site specifically requires otherwise.</span>
</div>

**How to change:**
1. Click the shield icon next to the address bar
2. Click "Advanced Security Settings"
3. Select your desired level

### Step 5: Check That It's Working

Visit: [https://check.torproject.org](https://check.torproject.org)

You should see: *"Congratulations. This browser is configured to use Tor."*

### Step 6 (Optional): Use Bridges If Tor is Blocked

Bridges are secret Tor entry points that aren't publicly listed. Use them if Tor is blocked in your country or network.

<div class="resource-grid">
  <a href="https://tb-manual.torproject.org/bridges/" target="_blank" class="resource-card" style="text-decoration: none; cursor: default;">
    <GuideIcon name="star" class="resource-icon" />
    <div class="resource-body">
      <h4>Email</h4>
      <p>bridges@torproject.org (from a Gmail or Riseup account)</p>
    </div>
  </a>
  <a href="https://t.me/GetBridgesBot" target="_blank" class="resource-card" style="text-decoration: none; cursor: default;">
    <GuideIcon name="chat" class="resource-icon" />
    <div class="resource-body">
      <h4>Telegram</h4>
      <p>@GetBridgesBot</p>
    </div>
  </a>
  <div class="resource-card" style="text-decoration: none; cursor: default;">
    <GuideIcon name="shield" class="resource-icon" />
    <div class="resource-body">
      <h4>Moat (Built-in)</h4>
      <p>Click "Configure" → "Tor is censored" in Tor Browser</p>
    </div>
  </div>
</div>

## Safety Rules for Browsing {#safety-rules}

### The 10 Commandments of Dark Web Safety

<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>1. Never log into personal accounts</h4>
    <p>Destroys anonymity instantly</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>2. Disable JavaScript</h4>
    <p>Prevents IP leaks and exploits</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>3. Don't maximize your browser</h4>
    <p>Screen size can fingerprint you</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>4. Use HTTPS only</h4>
    <p>Exit nodes can read non-HTTPS traffic</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>5. Never download files carelessly</h4>
    <p>Files can contain malware or trackers</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>6. Don't use your real email</h4>
    <p>Use ProtonMail or temporary email</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>7. Don't share personal info</h4>
    <p>Name, location, photos, etc.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #f39c12;">
    <h4>8. Use a VPN before Tor (optional)</h4>
    <p>Hides Tor usage from ISP</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #f39c12;">
    <h4>9. Close Tor when not in use</h4>
    <p>Reduces risk window</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #f39c12;">
    <h4>10. Verify .onion URLs</h4>
    <p>Phishing sites mimic real addresses</p>
  </div>
</div>

### Optional: VPN + Tor (The "Tor over VPN" Setup)

<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>VPN → Tor (Recommended)</h4>
    <p>ISP sees VPN, VPN sees Tor. Hides Tor usage from ISP.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Tor → VPN (Avoid)</h4>
    <p>Breaks anonymity - do not use this setup.</p>
  </div>
</div>

<div class="about-tip">
  <GuideIcon name="info" class="tip-icon" />
  <span><strong>Recommended VPNs for Tor:</strong> ProtonVPN (free tier available), Mullvad VPN, IVPN. Avoid free VPNs that log your data.</span>
</div>

## Finding .onion Sites {#finding-sites}

<div class="resource-grid">
  <a href="https://dark.fail/" target="_blank" class="resource-card" style="text-decoration: none; cursor: default;">
    <GuideIcon name="check" class="resource-icon" />
    <div class="resource-body">
      <h4>Dark.fail</h4>
      <p>Monitors dark web sites for uptime (clearnet + .onion)</p>
    </div>
  </a>
  <div class="resource-card" style="text-decoration: none; cursor: default;">
    <GuideIcon name="book" class="resource-icon" />
    <div class="resource-body">
      <h4>Tor Wiki</h4>
      <p>Caution: Contains scams and dead links</p>
    </div>
  </div>
  <a href="https://www.reddit.com/r/onions/" target="_blank" class="resource-card" style="text-decoration: none; cursor: default;">
    <GuideIcon name="chat" class="resource-icon" />
    <div class="resource-body">
      <h4>Reddit (clearnet)</h4>
      <p>r/onions, r/deepweb, r/TOR</p>
    </div>
  </a>
</div>

::: warning ⚠️
Most "Hidden Wiki" sites contain links to illegal content. They also contain many scams. Do not click randomly.
:::

## Starter .onion Links {#starter-links}

<div class="card-grid-2">
  <div class="shared-card" style="overflow: hidden;">
    <h4>HiddenWiki</h4>
    <p style="font-family: monospace; font-size: 0.72rem; word-break: break-all; color: var(--vp-c-text-3);">zqktlwiuavvvqqt4ybvgvi7tyo4hjl5xgfuvpdf6otjiycgwqbym2qad.onion/</p>
  </div>
  <div class="shared-card" style="overflow: hidden;">
    <h4>DanielWin</h4>
    <p style="font-family: monospace; font-size: 0.72rem; word-break: break-all; color: var(--vp-c-text-3);">danielas3rtn54uwmofdo3x2bsdifr47huasnmbgqzfrec5ubupvtpid.onion/</p>
  </div>
  <div class="shared-card" style="overflow: hidden;">
    <h4>TorTaxi</h4>
    <p style="font-family: monospace; font-size: 0.72rem; word-break: break-all; color: var(--vp-c-text-3);">tortaxi2dev6xjwbaydqzla77rrnth7yn2oqzjfmiuwn5h6vsk2a4syd.onion</p>
  </div>
  <div class="shared-card" style="overflow: hidden;">
    <h4>Comic Book Library</h4>
    <p style="font-family: monospace; font-size: 0.72rem; word-break: break-all; color: var(--vp-c-text-3);">comicbookinlujt3ka3nklhpnqustzfqjpsurjb3m5z7teeqqyj4vsqd.onion/</p>
  </div>
  <div class="shared-card" style="overflow: hidden;">
    <h4>Shadow Wiki</h4>
    <p style="font-family: monospace; font-size: 0.72rem; word-break: break-all; color: var(--vp-c-text-3);">zsxjtsgzborzdllyp64c6pwnjz5eic76bsksbxzqefzogwcydnkjy3yd.onion/</p>
  </div>
</div>

<div class="about-tip">
  <GuideIcon name="alert" class="tip-icon" />
  <span>These sites are just a starting point. Proceed with extreme caution and don't download anything, no exceptions.</span>
</div>
