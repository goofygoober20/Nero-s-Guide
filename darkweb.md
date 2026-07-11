---
title: Dark Web Guide
description: An educational guide to understanding Tor, the dark web, and how to browse safely and anonymously.
---

<script setup></script>

# The Ultimate Dark Web Guide

::: danger ⚠️ IMPORTANT DISCLAIMER
This guide is for **educational purposes only**. The Tor browser is a legitimate privacy tool used by millions worldwide. However, **you are responsible for your own actions**. Accessing illegal content or engaging in illicit activities can lead to serious legal consequences. This guide does not condone or encourage any illegal activity.
:::

## Important Warnings {#important-warnings}

Before diving into the technical setup, it is crucial to understand the reality of the dark web. It is not a game, and the consequences of mistakes can be severe. 

::: warning The Dark Web is NOT a Game
The dark web contains scams, malware, illegal marketplaces, and genuinely disturbing content. You **will** be found if you commit any serious crimes online. Complete privacy does not exist, and law enforcement has sophisticated tools to deanonymize users.
:::

Your Internet Service Provider can detect that you are connecting to the Tor network. While they cannot see *what* you are doing, they know you are using Tor. This can raise flags in certain environments. Additionally, the Tor Browser has **no built-in antivirus protection**. Any file you download could be infected with malware, **and you are entirely responsible for scanning files yourself.**

::: danger Logging In Ruins Anonymity
If you log into your real email, social media, or any personal account while using Tor, you have **destroyed your anonymity**. The website will instantly know exactly who you are, linking your real identity to your Tor activity.
:::

JavaScript is the number one way your IP address can be leaked or your browser exploited. Tor Browser disables JavaScript by default on HTTP sites, but manually enabling it can expose your real IP address through exploits. Leave JavaScript off unless absolutely necessary. Also, don't maximize your browser window, this reveals your exact screen resolution, which can be used as a fingerprinting technique to uniquely identify you among other Tor users.

::: warning Know the Law in Your Country
Tor is legal in the USA, Canada, UK, and EU (though often monitored). However, it is restricted or outright illegal in China, Russia, Iran, Belarus, and Venezuela. It is heavily restricted in North Korea, Turkmenistan, and Eritrea. If you are in a country where Tor is illegal, do not use it without proper protections like a VPN.
:::

## What is Tor? {#what-is-tor}

**Tor** (The Onion Router) is free, open-source software that enables anonymous communication by directing your internet traffic through a worldwide volunteer network of servers (nodes). It works by encrypting your traffic multiple times and bouncing it through these nodes, like layers of an onion. 

When you use Tor, websites see the IP address of the Tor exit node rather than your real IP address. The network is designed not to keep logs, and it grants you access to `.onion` sites, which are special hidden services that are only reachable via the Tor network.

<div class="flowchart">
 <div class="flow-node client">You</div>
 <div class="flow-arrow">&darr;</div>
 <div class="flow-node entry">Guard Node</div>
 <div class="flow-label">Knows your IP, not your destination</div>
 <div class="flow-arrow">&darr;</div>
 <div class="flow-node middle">Middle Node</div>
 <div class="flow-label">Knows neither IP nor destination</div>
 <div class="flow-arrow">&darr;</div>
 <div class="flow-node exit">Exit Node</div>
 <div class="flow-label">Knows destination, not your IP</div>
 <div class="flow-arrow">&darr;</div>
 <div class="flow-node dest">Destination</div>
 <div class="flow-label">Sees exit node IP only</div>
</div>

::: info Who uses Tor legally?
Tor is used by millions of legitimate users. This includes journalists communicating with whistleblowers, law enforcement conducting undercover operations, activists avoiding censorship in oppressive regimes, IT professionals testing security, and ordinary citizens who simply value their digital privacy.
:::

## The Surface Web vs Deep Web vs Dark Web {#web-layers}

To understand the dark web, you need to understand how the internet is layered:

*   **Surface Web:** This is the public internet indexed by search engines like Google. It includes sites like Reddit, Wikipedia, and YouTube. It is accessible via any standard browser.
*   **Deep Web:** This is content not indexed by search engines. It includes private databases, email inboxes, and online banking. It is accessible via a standard browser, but requires a login or specific URL. Your Gmail and bank account are part of the Deep Web.
*   **Dark Web:** This is a small, deliberately hidden subset of the Deep Web. These websites are only accessible via the Tor browser using special `.onion` addresses. Examples include whistleblower drop sites, privacy forums, and darknet markets.

## Step-by-Step Setup Guide {#setup-guide}

### Step 1: Download Tor Browser

You must download Tor Browser directly from the official source. **NEVER download Tor from third-party sites**, as they may contain malware or modified versions of the browser designed to compromise your anonymity.

::: warning Official Download Only
Always download from the official website: [https://www.torproject.org](https://www.torproject.org)
:::

### Step 2: Verify the Signature (Optional but Recommended)

Verifying the signature ensures you downloaded the authentic Tor Browser and not a modified version containing malware. 

1. Download the `.asc` signature file alongside the installer.
2. Import the Tor Browser Developers key:
   ```bash
   gpg --auto-key-locate nodefault,wkd --locate-keys torbrowser@torproject.org
   ```
3. Verify the signature
   ```bash
   gpg --verify tor-browser-linux64-14.0.tar.xz.asc
   ```
### Step 3: Install and Launch
Installation is straightforward across all major platforms:
Windows: Run the downloaded .exe installer and follow the prompts.
macOS: Open the .dmg file and drag the Tor Browser icon into your Applications folder.
Linux: Extract the downloaded archive and run the start-tor-browser.desktop script.
Android: Download "Tor Browser" directly from the Google Play Store or F-Droid.
iOS: Apple does not allow the official Tor Browser on the App Store. Use Onion Browser instead, which is the recommended alternative.

### Step 4: Configure Security Settings

Tor Browser offers three security levels. You can change these by clicking the shield icon next to the address bar and selecting "Advanced Security Settings".
<div class="tier-grid">
 <div class="tier-card">
 <span class="tier-accent standard"></span>
 <h4>Standard (Default)</h4>
 <p>JavaScript enabled on HTTPS. Fonts enabled. Click-to-play video/audio.</p>
 </div>
 <div class="tier-card">
 <span class="tier-accent safer"></span>
 <h4>Safer</h4>
 <p>JavaScript disabled on non-HTTPS. Fonts disabled. Click-to-play media.</p>
 </div>
 <div class="tier-card">
 <span class="tier-accent safest"></span>
 <h4>Safest</h4>
 <p>JavaScript disabled everywhere. Fonts disabled. Click-to-play media.</p>
 </div>
</div>

::: tip Recommendation
For maximum anonymity and security on the dark web, set your security level to Safest. Only lower it if a specific site is completely unusable without it.
:::
### Step 5: Check That It's Working

To verify your connection is routing through Tor, visit https://check.torproject.org. You should see a green message stating: "Congratulations. This browser is configured to use Tor."

### Step 6 (Optional): Use Bridges If Tor is Blocked

Bridges are secret Tor entry points that aren't publicly listed. Use them if Tor is blocked in your country or network.
- Moat (Built-in): Click "Configure" → "Tor is censored" in Tor Browser.
- Email: Email bridges@torproject.org from a Gmail or Riseup account.
- Telegram: Use the bot @GetBridgesBot.
Safety Rules for Browsing {#safety-rules}

If you are going to browse the dark web, you must adhere to strict operational security (OPSEC). Here are the 10 commandments of dark web safety:
<div class="rule-grid">
 <div class="rule-card critical">
 <div class="rule-card-header">
 <h4>1. Never log into personal accounts</h4>
 <input type="checkbox" class="rule-checkbox" aria-label="Check off rule 1">
 </div>
 <p>Destroys anonymity instantly</p>
 </div>
 <div class="rule-card critical">
 <div class="rule-card-header">
 <h4>2. Disable JavaScript</h4>
 <input type="checkbox" class="rule-checkbox" aria-label="Check off rule 2">
 </div>
 <p>Prevents IP leaks and exploits</p>
 </div>
 <div class="rule-card critical">
 <div class="rule-card-header">
 <h4>3. Don't maximize your browser</h4>
 <input type="checkbox" class="rule-checkbox" aria-label="Check off rule 3">
 </div>
 <p>Screen size can fingerprint you</p>
 </div>
 <div class="rule-card critical">
 <div class="rule-card-header">
 <h4>4. Use HTTPS only</h4>
 <input type="checkbox" class="rule-checkbox" aria-label="Check off rule 4">
 </div>
 <p>Exit nodes can read non-HTTPS traffic</p>
 </div>
 <div class="rule-card critical">
 <div class="rule-card-header">
 <h4>5. Never download files carelessly</h4>
 <input type="checkbox" class="rule-checkbox" aria-label="Check off rule 5">
 </div>
 <p>Files can contain malware or trackers</p>
 </div>
 <div class="rule-card critical">
 <div class="rule-card-header">
 <h4>6. Don't use your real email</h4>
 <input type="checkbox" class="rule-checkbox" aria-label="Check off rule 6">
 </div>
 <p>Use ProtonMail or temporary email</p>
 </div>
 <div class="rule-card critical">
 <div class="rule-card-header">
 <h4>7. Don't share personal info</h4>
 <input type="checkbox" class="rule-checkbox" aria-label="Check off rule 7">
 </div>
 <p>Name, location, photos, etc.</p>
 </div>
 <div class="rule-card warn">
 <div class="rule-card-header">
 <h4>8. Use a VPN before Tor (optional)</h4>
 <input type="checkbox" class="rule-checkbox" aria-label="Check off rule 8">
 </div>
 <p>Hides Tor usage from ISP</p>
 </div>
 <div class="rule-card warn">
 <div class="rule-card-header">
 <h4>9. Close Tor when not in use</h4>
 <input type="checkbox" class="rule-checkbox" aria-label="Check off rule 9">
 </div>
 <p>Reduces risk window</p>
 </div>
 <div class="rule-card warn">
 <div class="rule-card-header">
 <h4>10. Verify .onion URLs</h4>
 <input type="checkbox" class="rule-checkbox" aria-label="Check off rule 10">
 </div>
 <p>Phishing sites mimic real addresses</p>
 </div>
</div>

### Optional: VPN + Tor (The "Tor over VPN" Setup)

If you need to hide the fact that you are using Tor from your ISP, you can route your traffic through a VPN first.
VPN → Tor (Recommended): Your ISP sees the VPN connection, and the VPN sees you connecting to Tor. This effectively hides your Tor usage.
Tor → VPN (Avoid): This breaks the anonymity model of the Tor network and can actually route your traffic through a single VPN exit node, deanonymizing you. Do not use this setup.
::: tip Recommended VPNs for Tor
ProtonVPN (has a free tier), Mullvad VPN, and IVPN are highly recommended. Avoid free VPNs that log your data or sell your bandwidth.
:::
How to Interact with People {#interacting}

- Interacting with others on the dark web requires a high level of paranoia and technical discipline. Trust is earned through cryptographic proof, not assumed. You should assume everyone is a scammer or law enforcement until proven otherwise.
- Use PGP Encryption: Never send sensitive messages in plaintext. Use Pretty Good Privacy (PGP) to encrypt your communications. Always verify the recipient's public key fingerprint through a secondary channel to prevent man-in-the-middle attacks.
- Maintain Strict OPSEC: Never use your real name, email, or identifiable habits. Use unique pseudonyms for different contexts. Never reuse passwords or PGP keys across different personas or platforms, as this can link your identities together.
::: tip Avoid Real-Time Chat
Real-time messaging can leak metadata, such as your typing speed, response times, and local timestamps. Prefer asynchronous communication like encrypted emails or forum PMs, and always keep JavaScript disabled.
:::
Verify Identities: Before sharing sensitive information or funds, verify the other party. Check their PGP signature history, forum reputation, and look for consistent, long-term activity rather than a brand-new account.

## How to Not Get Scammed {#avoiding-scams}

The dark web is playground with and for scammers looking to steal your cryptocurrency. Protecting your funds requires vigilance and a healthy dose of skepticism.
::: danger Beware of "Finalize Early"
New or unverified vendors asking you to "Finalize Early" (release funds before delivery) are almost always running a scam. Only use Finalize Early for highly trusted, long-standing vendors with a proven track record.
:::
- Analyze Vendor Reviews: Scammers frequently buy fake reviews. Look for detailed, specific feedback with photos or PGP-signed reviews. Be highly suspicious of accounts that only have generic, short 5-star reviews.
- Start with Test Orders: Never place a massive order with a new vendor. Always start with a small "test order" to verify the vendor's reliability, product quality, and shipping stealth before committing larger amounts of money.
- Understand Escrow Risks: While escrow protects buyers from vendor scams, market administrators can pull an "exit scam" and steal all funds held in escrow. Diversify your funds and don't keep large balances in a single market.
::: danger Verify URLs Constantly
Phishing sites mimic real markets to steal your login credentials and PGP keys. Always bookmark your .onion links and verify the URL character-by-character. Never click unsolicited links sent via messages.
:::

### Too Good to Be True: 
If a deal seems impossibly cheap or a vendor is giving away high-value items for free, it is a trap. Scammers use greed to bypass your logical security checks.
## What to Do If You're in Trouble {#in-trouble}

If things go wrong, whether physically or digitally, you need to act quickly and calmly to minimiaze any damage already done, and prevent any future damage. 
::: danger If an Agent Knocks at Your Door
If law enforcement or hostile individuals arrive at your physical location, do not panic. Your physical safety and legal rights come first. Do not consent to searches without a warrant, and remain silent until you have legal representation. 

Consult this comprehensive legal guide on how to handle the situation:

[Read the "If an Agent Knocks" Guide](https://docs.google.com/document/d/176Yds1p63Q3iaKilw0luChMzlJhODdiPvF2I4g9eIXo/edit?usp=sharing)
:::

### Immediate Digital Lockdown

If you suspect your digital security has been compromised (e.g., you downloaded a malicious file or visited a phishing site), take these steps immediately:
- Disconnect Immediately: Pull the Ethernet cable or turn off Wi-Fi/Bluetooth. This stops remote access, data exfiltration, and tracking.
- Power Down Completely: Shut down the device entirely (do not just put it to sleep or hibernate). This clears the RAM, destroying active session keys and passwords.
- Do Not Reuse the Device: Assume the device is compromised. Do not turn it back on to "check" things. Leave it off until a forensic expert can examine it.
- Revoke Cryptographic Keys: If you have access from a clean, separate device, immediately revoke your PGP keys and change passwords for any linked accounts.
::: info Legal & Security Resources
If you need professional help, reach out to organizations that specialize in digital rights and security:
Electronic Frontier Foundation (EFF): A leading nonprofit defending digital civil liberties, providing extensive resources on encryption and legal rights.
Access Now: Offers a Digital Security Helpline providing one-on-one emergency support and advice for activists and at-risk individuals.
:::

## Finding .onion Sites {#finding-sites}

Finding reliable .onion links can be difficult since search engines don't index them. Here are a few trusted starting points:
- Dark.fail: Monitors dark web sites for uptime and provides verified links (accessible via clearnet and Tor).
- Tor Wiki: A wiki-style directory, but use with caution as it contains scams and dead links.
- Reddit (Clearnet): Subreddits like r/onions, r/deepweb, and r/TOR often share verified links and news.
::: warning ⚠️
Most "Hidden Wiki" sites contain links to illegal content and are riddled with scams. Do not click randomly.
:::
## Starter .onion Links {#starter-links}

Here are some common, relatively safe starting points to explore the dark web:

- **HiddenWiki** (Directory) — `zqktlwiuavvvqqt4ybvgvi7tyo4hjl5xgfuvpdf6otjiycgwqbym2qad.onion/`
- **DanielWin** (Directory) — `danielas3rtn54uwmofdo3x2bsdifr47huasnmbgqzfrec5ubupvtpid.onion/`
- **TorTaxi** (Directory) — `tortaxi2dev6xjwbaydqzla77rrnth7yn2oqzjfmiuwn5h6vsk2a4syd.onion`
- **Comic Book Library** (Library) — `comicbookinlujt3ka3nklhpnqustzfqjpsurjb3m5z7teeqqyj4vsqd.onion/`
- **Shadow Wiki** (Directory) — `zsxjtsgzborzdllyp64c6pwnjz5eic76bsksbxzqefzogwcydnkjy3yd.onion/`

::: danger Proceed with Extreme Caution
These sites are just a starting point. They are directories that link to other parts of the dark web. Do not download anything from them, no exceptions.
:::

## Credits & Resources {#credits}

<div class="sources-grid">

<div class="source-card">
 <div class="source-header">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" class="source-icon"><path d="M12 2C8 2 5 5 5 9c0 3 2 5 2 7 0 1-1 2-1 3s1 3 6 3 6-2 6-3-1-2-1-3c0-2 2-4 2-7 0-4-3-7-7-7z"/><path d="M12 2v20"/><path d="M8 4c2 2 6 2 8 0"/><path d="M7 8c2 2 8 2 10 0"/><path d="M8 12c2 2 6 2 8 0"/></svg>
 <strong>The Tor Project</strong>
 </div>
 <p class="source-citation">The official source for the Tor browser, documentation, and the latest updates on the Tor network.</p>
 <a href="https://www.torproject.org/" target="_blank" rel="noopener noreferrer" class="source-link">Visit Tor Project &rarr;</a>
</div>

<div class="source-card">
 <div class="source-header">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="source-icon"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
 <strong>If an Agent Knocks</strong>
 </div>
 <p class="source-citation">A comprehensive legal guide on what to do and what your rights are if law enforcement arrives at your door.</p>
 <a href="https://docs.google.com/document/d/176Yds1p63Q3iaKilw0luChMzlJhODdiPvF2I4g9eIXo/edit?usp=sharing" target="_blank" rel="noopener noreferrer" class="source-link">Read the Guide &rarr;</a>
</div>

<div class="source-card">
 <div class="source-header">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="source-icon"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/><path d="M12 11.55V21l-7.5-4.25V9.3L12 11.55m0-8.9l7.5 4.25v7.45L12 16.55V2.65z"/></svg>
 <strong>Electronic Frontier Foundation</strong>
 </div>
 <p class="source-citation">A leading nonprofit defending digital civil liberties, providing extensive resources on encryption and legal rights.</p>
 <a href="https://www.eff.org/" target="_blank" rel="noopener noreferrer" class="source-link">Visit EFF &rarr;</a>
</div>

<div class="source-card">
 <div class="source-header">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" class="source-icon"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
 <strong>Access Now</strong>
 </div>
 <p class="source-citation">Offers a Digital Security Helpline providing one-on-one emergency support and advice for at-risk individuals.</p>
 <a href="https://www.accessnow.org/help/" target="_blank" rel="noopener noreferrer" class="source-link">Get Help &rarr;</a>
</div>

<div class="source-card">
 <div class="source-header">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" class="source-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
 <strong>Dark.fail</strong>
 </div>
 <p class="source-citation">A trusted directory that monitors dark web sites for uptime and provides verified `.onion` links for popular services.</p>
 <a href="https://dark.fail/" target="_blank" rel="noopener noreferrer" class="source-link">Check Uptime &rarr;</a>
</div>

</div>


## Frequently Asked Questions

<details class="faq-item">
<summary>Is it illegal to access the dark web?</summary>

Accessing it (e.g., via Tor) is legal in most countries. What's illegal is the activity — buying drugs, weapons, or stolen data. Simply browsing is not a crime.

</details>

<details class="faq-item">
<summary>Do I need Tor to access it?</summary>

The dark web's hidden services (.onion) require Tor or a similar onion-capable browser. Standard browsers can't reach them, and you shouldn't try to force them to.

</details>

<details class="faq-item">
<summary>Is the dark web dangerous?</summary>

It can be — scams, malware, and illegal marketplaces are common, and law enforcement monitors some spaces. Stick to legitimate uses (privacy, whistleblowing, onion versions of normal sites) and never transact.

</details>

<details class="faq-item">
<summary>Can I get viruses from the dark web?</summary>

Risk is higher than the normal web. Don't download files, keep Tor updated, and avoid suspicious links. Treat every download as potentially hostile.

</details>

<details class="faq-item">
<summary>Why would a normal person use it?</summary>

For privacy and censorship resistance: journalists, activists, and people in restrictive regimes use it to communicate safely. Many mainstream sites (e.g., the New York Times, BBC) offer onion versions.

</details>

<details class="faq-item">
<summary>How do I stay safe if I browse it?</summary>

Use the official Tor Browser with default settings, never enable scripts on untrusted sites, don't reveal personal info, and keep it isolated from your real identity. When in doubt, don't click.

</details>
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

/* Grids and shared cards */
.card-grid-2, .card-grid-3 {
 display: grid;
 gap: 1rem;
 margin: 1.5rem 0;
}
.card-grid-2 { grid-template-columns: 1fr 1fr; }
.card-grid-3 { grid-template-columns: 1fr 1fr 1fr; }

.shared-card {
 padding: 1.25rem;
 border-radius: 14px;
 border: 1px solid var(--vp-c-divider);
 background: var(--vp-c-bg-soft);
 transition: transform 0.25s ease, border-color 0.25s ease;
}
.shared-card:hover {
 transform: translateY(-3px);
 border-color: var(--vp-c-brand-1);
}
.shared-card h4 {
 margin: 0 0 0.5rem;
 font-size: 1rem;
}
.shared-card p {
 font-size: 0.85rem;
 color: var(--vp-c-text-2);
 line-height: 1.5;
 margin: 0;
}

/* Sources grid */
.sources-grid {
 display: grid;
 grid-template-columns: 1fr 1fr;
 gap: 1rem;
 margin-top: 2rem;
}
.source-card {
 padding: 1.25rem;
 border-radius: 14px;
 border: 1px solid var(--vp-c-divider);
 background: var(--vp-c-bg-soft);
 transition: transform 0.25s ease, border-color 0.25s ease;
}
.source-card:hover {
 transform: translateY(-3px);
 border-color: var(--vp-c-brand-1);
}
.source-header {
 display: flex;
 align-items: center;
 gap: 0.75rem;
 margin-bottom: 0.5rem;
}
.source-icon {
 color: var(--vp-c-brand-1);
 flex-shrink: 0;
}
.source-header strong {
 font-size: 0.95rem;
}
.source-citation {
 font-size: 0.82rem;
 color: var(--vp-c-text-2);
 line-height: 1.5;
 margin: 0 0 0.75rem;
}
.source-link {
 font-size: 0.8rem;
 font-weight: 600;
 color: var(--vp-c-brand-1);
 text-decoration: none;
}
.source-link:hover {
 text-decoration: underline;
}

/* ——— Rule Cards (10 Commandments) ——— */
.rule-grid {
 display: grid;
 grid-template-columns: 1fr 1fr;
 gap: 1rem;
 margin: 1.5rem 0;
}
.rule-card {
 padding: 1.25rem;
 border-radius: 14px;
 border: 1px solid var(--vp-c-divider);
 background: var(--vp-c-bg-soft);
 transition: transform 0.25s ease, border-color 0.25s ease;
}
.rule-card:hover {
 transform: translateY(-3px);
}
.rule-card.critical { border-left: 4px solid #e74c3c; }
.rule-card.warn { border-left: 4px solid #f39c12; }
.rule-card-header {
 display: flex;
 justify-content: space-between;
 align-items: flex-start;
 gap: 0.75rem;
 margin-bottom: 0.35rem;
}
.rule-card-header h4 {
 margin: 0;
 font-size: 0.95rem;
 line-height: 1.4;
}
.rule-card p {
 margin: 0;
 font-size: 0.85rem;
 color: var(--vp-c-text-2);
 line-height: 1.5;
}
.rule-checkbox {
 width: 1.1rem;
 height: 1.1rem;
 border-radius: 4px;
 border: 2px solid var(--vp-c-divider);
 cursor: pointer;
 flex-shrink: 0;
 margin-top: 0.15rem;
 accent-color: var(--vp-c-brand-1);
}
.rule-checkbox:checked {
 border-color: var(--vp-c-brand-1);
}

/* ——— Security Tier Cards (Step 4) ——— */
.tier-grid {
 display: grid;
 grid-template-columns: 1fr 1fr 1fr;
 gap: 1rem;
 margin: 1.5rem 0;
}
.tier-card {
 padding: 0 1.25rem 1.25rem;
 border-radius: 14px;
 border: 1px solid var(--vp-c-divider);
 background: var(--vp-c-bg-soft);
 transition: transform 0.25s ease;
}
.tier-card:hover { transform: translateY(-3px); }
.tier-accent {
 display: block;
 height: 4px;
 margin: 0 -1.25rem 0.75rem;
 border-radius: 14px 14px 0 0;
}
.tier-accent.standard { background: #27ae60; }
.tier-accent.safer { background: #f39c12; }
.tier-accent.safest { background: #c0392b; }
.tier-card h4 { margin: 0 0 0.5rem; font-size: 1rem; }
.tier-card p { margin: 0; font-size: 0.85rem; color: var(--vp-c-text-2); line-height: 1.5; }


/* ——— Onion Routing Flowchart ——— */
.flowchart {
 display: flex;
 flex-direction: column;
 align-items: center;
 gap: 0.5rem;
 margin: 1.5rem 0;
 padding: 1.5rem 1rem;
 background: var(--vp-c-bg-soft);
 border-radius: 14px;
 border: 1px solid var(--vp-c-divider);
}
.flow-node {
 display: inline-flex;
 align-items: center;
 justify-content: center;
 gap: 0.35rem;
 padding: 0.6rem 1rem;
 border-radius: 8px;
 font-size: 0.8rem;
 font-weight: 600;
 min-width: 140px;
 text-align: center;
}
.flow-node.client { background: #2c3e50; color: #fff; border-color: #2c3e50; }
.flow-node.entry { background: #27ae60; color: #fff; border-color: #27ae60; }
.flow-node.middle { background: #2980b9; color: #fff; border-color: #2980b9; }
.flow-node.exit { background: #e74c3c; color: #fff; border-color: #e74c3c; }
.flow-node.dest { background: #8e44ad; color: #fff; border-color: #8e44ad; }
.flow-label {
 font-size: 0.75rem;
 color: var(--vp-c-text-2);
 text-align: center;
 max-width: 200px;
 line-height: 1.4;
}
.flow-arrow {
 font-size: 1.2rem;
 color: var(--vp-c-text-3);
 line-height: 1;
}

/* Responsive */
@media (max-width: 768px) {
 .card-grid-3, .sources-grid, .tier-grid {
 grid-template-columns: 1fr;
 }
}
@media (max-width: 640px) {
 .card-grid-2, .rule-grid {
 grid-template-columns: 1fr;
 }
}
</style>

