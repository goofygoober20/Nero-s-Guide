# 🧅 The Ultimate Dark Web Guide

<div class="meta-info">
  <span>✍️ Written by <strong>Nero</strong></span>
  <span>📅 Updated: May 2026</span>
  <span>⏱️ Read time: 10 min</span>
</div>

::: danger ⚠️ IMPORTANT DISCLAIMER
This guide is for **educational purposes only**. The Tor browser is a legitimate privacy tool used by millions of people worldwide, including journalists, activists, law enforcement, and ordinary citizens. However, **you are responsible for your own actions**. Accessing illegal content or engaging in illicit activities can lead to serious legal consequences. This guide does not condone or encourage any illegal activity.
:::

## 🚨 WARNINGS

Before you proceed, understand the following:

### 1. The Dark Web is NOT a Game

The dark web contains scams, malware, illegal marketplaces, and genuinely disturbing content. You **will** be found if you commit any serious crimes online, your complete privicy doesnt exist online. 

### 2. Your ISP Can See You Using Tor

Your Internet Service Provider can detect that you are connecting to the Tor network. While they cannot see what you're doing, they know you're using Tor. 

### 3. Tor is NOT a Virus Scanner

The Tor Browser has **no built-in antivirus protection**. Any file you download could be infected with malware. You are responsible for scanning files yourself.

### 4. Logging In Ruins Anonymity

If you log into your real email, social media, or any personal account while using Tor, you have **destroyed your anonymity**. The website will know exactly who you are.

### 5. JavaScript is a Risk

Tor Browser disables JavaScript by default on HTTP sites, but **manually enabling it can expose your real IP address** through exploits. Leave JavaScript off unless absolutely necessary.

### 6. Don't Maximize Your Browser Window

Maximizing your Tor Browser window can reveal your screen resolution, which can be used as a fingerprinting technique to identify you.

### 7. Downloading is Dangerous

Downloading files through Tor is **not recommended** unless you know exactly what you're doing. Files can contain malware, trackers, or be used to deanonymize you.

### 8. Know the Law in Your Country

| Country | Tor Status |
|---------|------------|
| USA, Canada, UK, EU | Legal (with monitoring) |
| China, Russia, Iran, Belarus, Venezuela | Restricted or Illegal |
| North Korea, Turkmenistan, Eritrea | Heavily restricted |

::: info
If you are in a country where Tor is illegal, do not use it without proper protections (VPN before Tor)
:::
## 📚 Table of Contents

- [What is Tor?](#what-is-tor)
- [How Tor Works](#how-tor-works)
- [The Surface Web vs Deep Web vs Dark Web](#web-layers)
- [Step-by-Step Setup Guide](#setup-guide)
- [Safety Rules for Browsing](#safety-rules)
- [Finding .onion Sites](#finding-sites)
- [My Personal Starter Links](#starter-links)
- [Common Scams to Avoid](#scams)
- [FAQs](#faqs)
- [Sources & Further Reading](#sources)

---

## What is Tor? {#what-is-tor}

**Tor** (The Onion Router) is free, open-source software that enables anonymous communication by directing your internet traffic through a worldwide volunteer network of servers (nodes).

| Feature | What It Does |
|---------|--------------|
| **Hides your IP address** | Websites see a Tor exit node IP, not yours |
| **Encrypts traffic multiple times** | Like layers of an onion (hence the name) |
| **No logs** | The Tor network is designed not to keep records |
| **Access to .onion sites** | Special hidden services only reachable via Tor |

::: tip 
Who uses Tor legally?

 Journalists communicating with whistleblowers, law enforcement conducting undercover operations, activists avoiding censorship, IT professionals testing security, and ordinary citizens who value privacy.
:::

## The Surface Web vs Deep Web vs Dark Web {#web-layers}

| Layer | What It Is | Access | Example |
|-------|-----------|--------|---------|
| **Surface Web** | Public websites indexed by Google | Standard browser | Reddit, Wikipedia, YouTube |
| **Deep Web** | Content not indexed (private databases, email, banking) | Standard browser + login | Your Gmail, bank account, company intranet |
| **Dark Web** | Deliberately hidden websites | Tor browser + .onion address | Darknet markets, whistleblower sites |
---

## Step-by-Step Setup Guide {#setup-guide}

### Step 1: Download Tor Browser

| Source | Link |
|--------|------|
| **Official Website** | [https://www.torproject.org](https://www.torproject.org) |
| **Alternative (if blocked)** | Use bridges (see below) |

::: warning
NEVER download Tor from third-party sites. Only use the official Tor Project website.
:::
### Step 2: Verify the Signature (Optional but Recommended)

- Download the `.asc` signature file
- Import the Tor signing key: `gpg --auto-key-locate nodefault,wkd --locate-keys torbrowser@torproject.org`
- Verify: `gpg --verify tor-browser-linux64-14.0.tar.xz.asc`

### Step 3: Install and Launch

| Platform | Instructions |
|----------|--------------|
| **Windows** | Run the installer, follow prompts |
| **macOS** | Drag Tor Browser to Applications folder |
| **Linux** | Extract the archive, run `start-tor-browser.desktop` |
| **Android** | Download **Tor Browser for Android** from Google Play or F-Droid |
| **iOS** | Use **Onion Browser** (recommended) |

### Step 4: Configure Security Settings

Tor Browser has three security levels:

| Level | JavaScript | Fonts | MathML | Video/Audio |
|-------|------------|-------|--------|-------------|
| **Standard** (default) | Enabled | Enabled | Enabled | Click-to-play |
| **Safer** | Disabled on non-HTTPS | Disabled | Disabled | Click-to-play |
| **Safest** | Disabled everywhere | Disabled | Disabled | Click-to-play |

::: tip
Recommendation: Set to **Safest** unless a site specifically requires otherwise.
:::
**How to change:**
1. Click the shield icon next to the address bar
2. Click "Advanced Security Settings"
3. Select your desired level

### Step 5: Check That It's Working

Visit: [https://check.torproject.org](https://check.torproject.org)

You should see: *"Congratulations. This browser is configured to use Tor."*

### Step 6 (Optional): Use Bridges If Tor is Blocked

Bridges are secret Tor entry points that aren't publicly listed. Use them if Tor is blocked in your country or network.

| How to Get Bridges |
|--------------------|
| Email: **bridges@torproject.org** (from a Gmail or Riseup account) |
| Telegram: [@GetBridgesBot](https://t.me/getbridgesbot) |
| Moat: Built into Tor Browser (click "Configure" → "Tor is censored") |

---

## Safety Rules for Browsing {#safety-rules}

### The 10 Commandments of Dark Web Safety

| # | Rule | Why |
|---|------|-----|
| 1 | **Never log into personal accounts** | Destroys anonymity instantly |
| 2 | **Disable JavaScript** | Prevents IP leaks and exploits |
| 3 | **Don't maximize your browser** | Screen size can fingerprint you |
| 4 | **Use HTTPS only** | Exit nodes can read non-HTTPS traffic |
| 5 | **Never download files carelessly** | Files can contain malware or trackers |
| 6 | **Don't use your real email** | Use ProtonMail or temporary email |
| 7 | **Don't share personal info** | Name, location, photos, etc. |
| 8 | **Use a VPN before Tor** (optional) | Hides Tor usage from ISP |
| 9 | **Close Tor when not in use** | Reduces risk window |
| 10 | **Verify .onion URLs** | Phishing sites mimic real addresses |

### Optional: VPN + Tor (The "Tor over VPN" Setup)

For maximum privacy, some users connect to a VPN **before** launching Tor Browser.

| Setup | What It Does | Best For |
|-------|--------------|----------|
| **VPN → Tor** | ISP sees VPN, VPN sees Tor | Hiding Tor usage from ISP |
| **Tor → VPN** | (Not recommended, breaks anonymity) | Avoid this |

::: tip Recommended VPNs for Tor
 ProtonVPN (free tier available), Mullvad VPN, IVPN. Avoid free VPNs that log your data.
:::
---

## Finding .onion Sites {#finding-sites}


### Where to Find Verified Links

| Source | Description |
|--------|-------------|
| **Dark.fail** | Monitors dark web sites for uptime (clearnet + .onion) |
| **Tor Wiki** | Caution: Contains scams and dead links |
| **Reddit** (clearnet) | r/onions, r/deepweb, r/TOR |

::: warning ⚠️ **Warning** 
Most "Hidden Wiki" sites contain links to illegal content. They also contain many scams. Do not click randomly.
:::
---

## My Personal Starter Links {#starter-links}

### .onion Sites

| Site | .onion Address 
|------|----------------|
| **HiddenWiki** | `zqktlwiuavvvqqt4ybvgvi7tyo4hjl5xgfuvpdf6otjiycgwqbym2qad.onion/` | 
| **DanielWin** | `danielas3rtn54uwmofdo3x2bsdifr47huasnmbgqzfrec5ubupvtpid.onion/` |
| **TorTaxi** | `tortaxi2dev6xjwbaydqzla77rrnth7yn2oqzjfmiuwn5h6vsk2a4syd.onion` | 
| **Comic Book Libary** | `comicbookinlujt3ka3nklhpnqustzfqjpsurjb3m5z7teeqqyj4vsqd.onion/` | 
| **Shadow Wiki** | `zsxjtsgzborzdllyp64c6pwnjz5eic76bsksbxzqefzogwcydnkjy3yd.onion/` | 

::: info
These sites are just a starting point for the rabbit hole, these sites can connect you to more hidden sites. Proceed with extreme caution and dont download anything, no expections.
:::
