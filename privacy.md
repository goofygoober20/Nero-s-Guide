---
title: Online Privacy Guide
description: Protect your digital identity - threat modeling, browser hardening, private search, encrypted DNS, email aliases, VPNs, mobile privacy, file/link scanners, and data removal. Built around free, open-source, local-first tools.
---

<script setup></script>

# The Ultimate Online Privacy Guide

 
::: danger ⚠️ START WITH YOUR THREAT MODEL
There is no such thing as 100% anonymous or 100% private. Privacy is about **raising the cost** of tracking you to more than your adversary is willing to pay. 
:::
::: warning Before changing anything
Decide **who you're protecting yourself from** - advertisers and data brokers, a snooping ISP, a person who is causing you danger, or a nation-state. The right tools are completely different for each. Don't burn yourself out installing things you don't need.
:::
 
<p class="legend"><span class="legend-dot green"></span> Recommended free / open-source &nbsp;·&nbsp; <span class="legend-dot orange"></span> Paid or use with caution &nbsp;·&nbsp; <span class="legend-dot red"></span> Advanced / high-threat only</p>
 
## Start Here: Know Your Threat Model {#threat-model}
 
Privacy isn't one-size-fits-all. Pick the "route" that matches who you're actually up against, then follow the sections that apply. Most people only need the green route.
 
<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>🟢 The Everyday Route</h4>
    <p>You want to stop advertisers, data brokers, and your ISP from profiling you, and avoid getting your accounts breached. <strong>This covers ~90% of people.</strong> Focus on: Browser Hardening, Private Search, Encrypted DNS, Email Aliases, a Password Manager + 2FA, and Data Removal.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>🔴 The High-Threat Route</h4>
    <p>You're a journalist, activist, or someone facing a powerful, targeted adversary. You need everything in the everyday route <strong>plus</strong> compartmentalized identities, Tor, a hardened or amnesic OS (Tails/Qubes), and strict OPSEC. Mistakes here have real consequences - read <a href="#common-mistakes">Common Mistakes</a> first.</p>
  </div>
</div>
 
::: tip Ask yourself four questions
1. **What am I protecting?** (messages, location, identity, browsing)
2. **Who from?** (advertisers, ISP, an individual, a corporation, a government)
3. **How much effort can they spend?**
4. **What happens if I fail?**
 
Your answers decide how far down this guide you need to go.
:::
 
## How You're Tracked {#how-tracked}
 
You can't defend against what you don't understand. These are the main ways you're identified and followed online - each section below counters one or more of them.
 
<div class="card-grid-3">
  <div class="shared-card">
    <h4>IP Address</h4>
    <p>Your real-world "return address." Reveals your rough location and ties activity to your ISP account. Countered by VPNs and Tor.</p>
  </div>
  <div class="shared-card">
    <h4>DNS Queries</h4>
    <p>Every site you visit starts with a DNS lookup. By default your ISP sees (and can log/sell) every domain. Countered by encrypted DNS.</p>
  </div>
  <div class="shared-card">
    <h4>Cookies & Trackers</h4>
    <p>Third-party cookies and tracking scripts follow you across sites to build an ad profile. Countered by browser hardening + uBlock Origin.</p>
  </div>
  <div class="shared-card">
    <h4>Browser Fingerprinting</h4>
    <p>Your screen size, fonts, GPU, and settings combine into a near-unique "fingerprint" - no cookies needed. Countered by hardened/standardized browsers.</p>
  </div>
  <div class="shared-card">
    <h4>Metadata & EXIF</h4>
    <p>Photos carry GPS coordinates and device info; files carry author names and timestamps. You leak it without realizing. Countered by metadata scrubbing.</p>
  </div>
  <div class="shared-card">
    <h4>Behavioral & Account Linking</h4>
    <p>Reused usernames, logins, and writing style link your "anonymous" activity to the real you. Countered by good OPSEC and identity separation.</p>
  </div>
</div>
 
## Browser Hardening {#browser-hardening}
 
Your browser is the single biggest source of leaks. Harden it first.
 
<div class="card-grid-2">
  <div class="shared-card">
    <h4>Firefox Hardening</h4>
    <p>Set <strong>Enhanced Tracking Protection</strong> to <strong>Strict</strong> (this enables <strong>Total Cookie Protection</strong>, which isolates cookies per-site - the modern replacement for the old <code>privacy.firstparty.isolate</code> tweak). Turn on <strong>HTTPS-Only Mode</strong>, install <strong>uBlock Origin</strong>, and use <strong>Multi-Account Containers</strong>. For a one-step hardened setup, use the <strong>arkenfox user.js</strong> or switch to <strong>LibreWolf</strong>.</p>
  </div>
  <div class="shared-card">
    <h4>Chrome / Chromium Hardening</h4>
    <p>Install <strong>uBlock Origin</strong>, block third-party cookies, and enable <strong>"Always use secure connections."</strong> Turn on <strong>Global Privacy Control (GPC)</strong> - the legally-recognized successor to the now-defunct "Do Not Track." (Chrome's Manifest V3 weakens ad blockers, so Firefox/LibreWolf is the stronger choice.)</p>
  </div>
</div>
 
::: tip Two settings that are now obsolete
**HTTPS Everywhere** was retired by the EFF (its job is built into every browser now - just enable HTTPS-Only Mode). **Do Not Track (DNT)** is dead too; sites ignored it, so use **Global Privacy Control (GPC)** instead, which some laws actually enforce.
:::
 
<SmartResourceGuide category="privacy" />

 
## Private Search Engines {#search-engines}
 
Google logs your searches and ties them to your account and IP. Switch your default search engine - it's a 30-second change with a big payoff.
 
<div class="card-grid-2">
  <a href="https://duckduckgo.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/duckduckgo.com.ico" alt="" loading="lazy" /><h4>DuckDuckGo</h4></div>
    <p>The easy default. No search history tied to you, clean results, built-in tracker blocking. Results sourced largely from Bing.</p>
    <div class="platforms"><span>Web</span><span>Android</span><span>iOS</span></div>
  </a>
  <a href="https://search.brave.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/brave.com.ico" alt="" loading="lazy" /><h4>Brave Search</h4></div>
    <p>Uses its own independent index (not just reselling Google/Bing), so results aren't filtered through Big Tech. No tracking.</p>
    <div class="platforms"><span>Web</span></div>
  </a>
  <a href="https://www.startpage.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/startpage.com.ico" alt="" loading="lazy" /><h4>Startpage</h4></div>
    <p>Gives you Google's results without Google's tracking - it proxies the query for you. Good if you miss Google's result quality.</p>
    <div class="platforms"><span>Web</span></div>
  </a>
  <a href="https://searx.space/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/searx.space.ico" alt="" loading="lazy" /><h4>SearXNG</h4></div>
    <p>Open-source metasearch engine you can self-host or use via public instances. Aggregates many engines, stores nothing. The power-user pick.</p>
    <div class="platforms"><span>Web</span><span>Self-host</span></div>
  </a>
</div>
 
## Encrypted DNS {#encrypted-dns}
 
Even with HTTPS, your **DNS lookups** can reveal every site you visit to your ISP. Encrypted DNS (DoH/DoT) closes that leak and can block ads/malware network-wide.
 
<div class="card-grid-3">
  <a href="https://nextdns.io/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/nextdns.io.ico" alt="" loading="lazy" /><h4>NextDNS</h4></div>
    <p>Customizable encrypted DNS with ad/tracker/malware blocking and logging you control. Generous free tier. Works on every device.</p>
    <div class="platforms"><span>Win</span><span>Mac</span><span>Linux</span><span>Android</span><span>iOS</span><span>Router</span></div>
  </a>
  <a href="https://quad9.net/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/quad9.net.ico" alt="" loading="lazy" /><h4>Quad9</h4></div>
    <p>Swiss-based non-profit resolver (<code>9.9.9.9</code>) that blocks known-malicious domains and keeps no PII. Set-and-forget.</p>
    <div class="platforms"><span>All</span></div>
  </a>
  <a href="https://1.1.1.1/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/cloudflare.com.ico" alt="" loading="lazy" /><h4>Cloudflare 1.1.1.1</h4></div>
    <p>Fast encrypted DNS (DoH/DoT). The <code>1.1.1.1 for Families</code> variant adds malware/adult-content blocking. Privacy-audited.</p>
    <div class="platforms"><span>Win</span><span>Mac</span><span>Android</span><span>iOS</span></div>
  </a>
</div>
 
## Email Privacy {#email-privacy}
 
Standard email (Gmail/Outlook) is scanned and tied to your identity. Use an encrypted provider for sensitive mail, and **aliases** everywhere else so one breach can't follow you.
 
<div class="card-grid-2">
  <a href="https://proton.me/mail" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/proton.me.ico" alt="" loading="lazy" /><h4>Proton Mail</h4></div>
    <p>End-to-end encrypted email based in Switzerland. Free tier available; paid plans add custom domains and more storage. (Verify current free-tier limits on signup - they change.)</p>
    <div class="platforms"><span>Web</span><span>Android</span><span>iOS</span><span>Desktop</span></div>
  </a>
  <a href="https://tuta.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/tuta.com.ico" alt="" loading="lazy" /><h4>Tuta (formerly Tutanota)</h4></div>
    <p>Open-source, end-to-end encrypted email + calendar, based in Germany. Encrypts subject lines too. Free tier with 1GB.</p>
    <div class="platforms"><span>Web</span><span>Android</span><span>iOS</span><span>Desktop</span></div>
  </a>
  <a href="https://simplelogin.io/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/simplelogin.io.ico" alt="" loading="lazy" /><h4>SimpleLogin / Addy.io</h4></div>
    <p>Email aliases that forward to your real inbox. Give every service a unique address - if one leaks or spams you, kill that alias alone. Both open source.</p>
    <div class="platforms"><span>Web</span><span>Android</span><span>iOS</span><span>Extension</span></div>
  </a>
  <a href="https://support.apple.com/en-us/105078" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #f39c12;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/apple.com.ico" alt="" loading="lazy" /><h4>Apple Hide My Email</h4></div>
    <p>If you're in the Apple ecosystem, iCloud+ generates random forwarding addresses built into Safari and Sign in with Apple. Convenient but Apple-only and paid.</p>
    <div class="platforms"><span>iOS</span><span>Mac</span><span>Web</span></div>
  </a>
</div>
 
## VPNs & Tor {#vpns-tor}
 
::: warning A VPN is not magic
A VPN hides your IP from websites and your traffic from your ISP - but it **shifts all that trust to the VPN provider**. A VPN does *not* make you anonymous. Only use a vetted **no-logs** provider, and never trust "free" VPNs that monetize your data. For true anonymity against a serious adversary, you need **Tor**, not a VPN.
:::
 
<div class="card-grid-3">
  <a href="https://mullvad.net/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/mullvad.net.ico" alt="" loading="lazy" /><h4>Mullvad VPN</h4></div>
    <p>Top pick. No email needed - you get a random account number. Accepts cash and Monero. Flat €5/month, no tiers. Open-source apps, independently audited.</p>
    <div class="platforms"><span>Win</span><span>Mac</span><span>Linux</span><span>Android</span><span>iOS</span></div>
  </a>
  <a href="https://protonvpn.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/protonvpn.com.ico" alt="" loading="lazy" /><h4>Proton VPN</h4></div>
    <p>From the Proton team. The only reputable free tier (no logs, no ads, just slower). Paid adds higher speeds and port forwarding. Open source + audited.</p>
    <div class="platforms"><span>Win</span><span>Mac</span><span>Linux</span><span>Android</span><span>iOS</span></div>
  </a>
  <a href="https://www.ivpn.net/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/ivpn.net.ico" alt="" loading="lazy" /><h4>IVPN</h4></div>
    <p>No logs, open source, accepts cash and Monero. Very transparent, multi-hop available. Pricier but principled.</p>
    <div class="platforms"><span>Win</span><span>Mac</span><span>Linux</span><span>Android</span><span>iOS</span></div>
  </a>
  <a href="https://www.torproject.org/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #e74c3c;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/torproject.org.ico" alt="" loading="lazy" /><h4>Tor Browser</h4></div>
    <p>Routes your traffic through three relays so no single point knows both who you are and what you're doing. The real anonymity tool. Slower, and requires good habits to stay safe.</p>
    <div class="platforms"><span>Win</span><span>Mac</span><span>Linux</span><span>Android</span></div>
  </a>
</div>
 
::: tip Going deeper on Tor and onion services
If your threat model calls for Tor, read the **[Dark Web Guide](/darkweb)** for how to use it safely (and its limits). Note that some privacy communities now debate Tor's resistance to nation-state adversaries - it's excellent against everyone *except* possibly a global passive observer.
:::
 
## Mobile Privacy {#mobile-privacy}
 
Your phone is the most invasive tracking device you own - always-on location, a unique advertising ID, and dozens of apps phoning home. Don't skip this.
 
<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>📱 Android: quick wins</h4>
    <p>Settings → Privacy → <strong>delete/reset your Advertising ID</strong>. Audit app permissions (location, mic, camera). Install apps from <strong>F-Droid</strong> for open-source alternatives. Disable "Web &amp; App Activity" if you use a Google account.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>🍎 iOS: quick wins</h4>
    <p>Settings → Privacy &amp; Security → Tracking → <strong>turn off "Allow Apps to Request to Track."</strong> Limit location to "While Using." Turn on <strong>Lockdown Mode</strong> if you're high-risk. Use <strong>Hide My Email</strong> (above).</p>
  </div>
  <a href="https://grapheneos.org/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #e74c3c;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/grapheneos.org.ico" alt="" loading="lazy" /><h4>GrapheneOS</h4></div>
    <p>Hardened, de-Googled Android for Pixel phones. The gold standard for mobile privacy/security: sandboxed Google Play (optional), per-app network/sensor controls. For high-threat users.</p>
    <div class="platforms"><span>Pixel</span></div>
  </a>
  <a href="https://f-droid.org/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/f-droid.org.ico" alt="" loading="lazy" /><h4>F-Droid</h4></div>
    <p>App store for free and open-source Android apps - no Google account, no tracking, builds you can audit. Your source for private alternatives.</p>
    <div class="platforms"><span>Android</span></div>
  </a>
</div>
 
::: tip Privacy by design exists
A growing number of apps keep <em>everything</em> on-device with no account or cloud - for example <a href="https://logzero.app/" target="_blank" rel="noopener noreferrer">LogZero</a> (a fully on-device iOS tracker). When choosing any app, check its App Store/Play "Data Safety" / "App Privacy" label and prefer "Data Not Collected."
:::
 
## Password Managers & 2FA {#passwords-2fa}
 
Reused passwords are the #1 way ordinary people get compromised. A password manager + two-factor authentication fixes most account risk on its own.
 
<div class="about-tip-row">
 
::: tip Full comparison lives in the Password Guide
See the **[Password Guide](/passwords)** for a detailed breakdown of password managers and 2FA apps, or take the quizzes below.
:::
 
</div>
 
<div class="card-grid-2">
  <a href="/password-quiz" class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>🔐 Password Manager Quiz</h4>
    <p>Answer 7 quick questions to find the best password manager for your needs.</p>
  </a>
  <a href="/2fa-quiz" class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>🛡️ 2FA App Quiz</h4>
    <p>Find the right two-factor authentication app for your devices and habits.</p>
  </a>
</div>
 
::: tip Go beyond app-based 2FA
For your most important accounts (email, bank, password manager), use a **hardware security key** (YubiKey, or any FIDO2 key) or **passkeys**. They're phishing-proof in a way SMS and even app codes are not. **Never use SMS 2FA if you can avoid it** - SIM-swapping defeats it.
:::

<blockquote class="quiz-callout">
  <strong>Not sure what privacy tools you actually need?</strong>
  <a href="/privacy-threat-model-quiz">Take the Privacy Threat Model Quiz &rarr;</a>
</blockquote>
 
## Encryption, Files & Private Transfer {#encryption-files}
 
Encrypt what's sensitive, strip metadata before you share, and send files without handing them to a third party.
 
<div class="card-grid-2">
  <a href="https://cryptomator.org/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/cryptomator.org.ico" alt="" loading="lazy" /><h4>Cryptomator</h4></div>
    <p>Encrypt files <em>before</em> they sync to Google Drive, Dropbox, iCloud, etc. Open source, cross-platform, zero-knowledge.</p>
    <div class="platforms"><span>Win</span><span>Mac</span><span>Linux</span><span>Android</span><span>iOS</span></div>
  </a>
  <a href="https://www.veracrypt.fr/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/veracrypt.fr.ico" alt="" loading="lazy" /><h4>VeraCrypt</h4></div>
    <p>Full-disk and container encryption. Create encrypted volumes or encrypt your whole drive. The actively-maintained successor to TrueCrypt.</p>
    <div class="platforms"><span>Win</span><span>Mac</span><span>Linux</span></div>
  </a>
  <a href="https://altersend.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/altersend.com.ico" alt="" loading="lazy" /><h4>AlterSend</h4></div>
    <p>Peer-to-peer, end-to-end encrypted file transfer. Pair devices with a QR code; files travel directly between them - never touching a server. No accounts, no size limits, open source (Apache-2.0).</p>
    <div class="platforms"><span>Win</span><span>Mac</span><span>Linux</span><span>Android</span><span>iOS</span></div>
  </a>
  <a href="https://sunasty.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/sunasty.com.ico" alt="" loading="lazy" /><h4>Sunasty</h4></div>
    <p>140+ in-browser file tools - compress, convert, merge, sign, and crucially <strong>strip EXIF/GPS metadata from photos</strong>. Nothing is uploaded; it all runs locally via WebAssembly.</p>
    <div class="platforms"><span>Web</span><span>PWA</span></div>
  </a>
  <a href="https://compresso.codeforreal.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://www.google.com/s2/favicons?domain=compresso.codeforreal.com&sz=32" alt="" loading="lazy" /><h4>Compresso</h4></div>
    <p>Lightweight no-upload image compressor. Runs entirely in the browser - just drag, compress, download. Good when you only need image compression without the full tool suite.</p>
    <div class="platforms"><span>Web</span></div>
  </a>
</div>
 
::: warning Always scrub metadata before sharing
A single photo can leak the exact GPS coordinates where it was taken, plus your phone model and timestamp. Documents leak author names and edit history. Strip metadata (with Sunasty above, or ExifTool) **before** posting anything you don't want geolocating you.
:::
 
## Verify Before You Trust: File & Link Scanners {#scanners}
 
Got a suspicious link, attachment, or download? **Check it before you open it.** These free sandboxes let you inspect something without exposing your own machine. Essential reading alongside the [Dark Web Guide](/darkweb).
 
<div class="card-grid-2">
  <a href="https://www.virustotal.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/virustotal.com.ico" alt="" loading="lazy" /><h4>VirusTotal</h4></div>
    <p>Scans a file or URL against 70+ antivirus engines at once and shows the consensus. The first stop for "is this file/link malicious?"</p>
    <div class="platforms"><span>Web</span><span>API</span></div>
  </a>
  <a href="https://urlscan.io/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/urlscan.io.ico" alt="" loading="lazy" /><h4>urlscan.io</h4></div>
    <p>A "sandbox for the web": it visits a URL <em>for</em> you and reports every resource it loads, redirects, screenshots, and the IPs behind it - so you never have to click it yourself.</p>
    <div class="platforms"><span>Web</span><span>API</span></div>
  </a>
  <a href="https://virusscan.jotti.org/en" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/jotti.org.ico" alt="" loading="lazy" /><h4>Jotti's Malware Scan</h4></div>
    <p>Free multi-engine file scanner (up to 5 files at a time). A good independent second opinion to VirusTotal.</p>
    <div class="platforms"><span>Web</span></div>
  </a>
  <a href="https://www.urlvoid.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/urlvoid.com.ico" alt="" loading="lazy" /><h4>URLVoid</h4></div>
    <p>Reputation checker for domains/URLs - cross-references dozens of blocklists and safety services. Quick way to vet an unfamiliar site.</p>
    <div class="platforms"><span>Web</span></div>
  </a>
  <a href="https://www.threat.rip/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #f39c12;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/threat.rip.ico" alt="" loading="lazy" /><h4>Threat.rip</h4></div>
    <p>File threat-analysis portal for deeper inspection. <strong>Caveat:</strong> requires a free account to upload, so read its submission policy first.</p>
    <div class="platforms"><span>Web</span></div>
  </a>
  <a href="https://www.malwarebytes.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #f39c12;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/malwarebytes.com.ico" alt="" loading="lazy" /><h4>Malwarebytes</h4></div>
    <p>On-device anti-malware with a capable free on-demand scanner for cleaning an already-infected machine. <strong>Caveat:</strong> commercial, with upsells (VPN/premium) - the free scanner is the useful part.</p>
    <div class="platforms"><span>Win</span><span>Mac</span><span>Android</span><span>iOS</span></div>
  </a>
</div>
 
::: danger One important warning
**Never upload confidential files to a public scanner.** Anything you submit to VirusTotal/Jotti can be shared with their partners and, in some cases, downloaded by paying researchers. For sensitive documents, scan with a local tool instead. Public scanners are for *untrusted* files you received, not *your own private* ones.
:::
 
## Your Digital Footprint & Data Removal {#data-removal}
 
Privacy isn't only about going forward - it's also cleaning up what's already out there. Data brokers compile and sell dossiers on you (address, phone, relatives). Here's how to fight back.
 
<div class="card-grid-2">
  <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/haveibeenpwned.com.ico" alt="" loading="lazy" /><h4>Have I Been Pwned</h4></div>
    <p>Check if your email or phone appeared in a breach, and subscribe for alerts. If you show up, change those passwords and enable 2FA immediately.</p>
    <div class="platforms"><span>Web</span></div>
  </a>
  <a href="https://justdelete.me/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/justdelete.me.ico" alt="" loading="lazy" /><h4>JustDeleteMe</h4></div>
    <p>A directory of direct links and difficulty ratings for deleting your account from hundreds of services. Start by closing old accounts you no longer use.</p>
    <div class="platforms"><span>Web</span></div>
  </a>
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>🧹 DIY Broker Opt-Outs (Free)</h4>
    <p>The free route: manually opt out of the big data brokers (Spokeo, Whitepages, BeenVerified, Radaris, etc.). Tedious but effective. Privacy Guides and the IntelTechniques workbook maintain up-to-date opt-out lists.</p>
  </div>
  <a href="https://www.serus.ai/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #f39c12;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/serus.ai.ico" alt="" loading="lazy" /><h4>Serus</h4></div>
    <p>Automated data-removal + footprint monitoring if you'd rather not do it by hand. <strong>Caveat:</strong> it's a paid SaaS, and any removal service necessarily ingests your personal data to find it - a trade-off to weigh against the free DIY route.</p>
    <div class="platforms"><span>Web</span></div>
  </a>
</div>
 
## Private Operating Systems {#operating-systems}
 
For the high-threat route, your OS itself matters. Windows and macOS phone home constantly; these are built for privacy.
 
<div class="card-grid-3">
  <a href="https://tails.net/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #e74c3c;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/tails.net.ico" alt="" loading="lazy" /><h4>Tails</h4></div>
    <p>An amnesic OS you boot from a USB stick. Routes everything through Tor and forgets everything on shutdown. The classic choice for journalists and at-risk users.</p>
    <div class="platforms"><span>USB boot</span></div>
  </a>
  <a href="https://www.whonix.org/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #e74c3c;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/whonix.org.ico" alt="" loading="lazy" /><h4>Whonix</h4></div>
    <p>Runs in two VMs so your real IP can never leak, even if an app is compromised. Often paired with Qubes for serious isolation.</p>
    <div class="platforms"><span>VM</span></div>
  </a>
  <a href="https://www.qubes-os.org/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #e74c3c;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/qubes-os.org.ico" alt="" loading="lazy" /><h4>Qubes OS</h4></div>
    <p>"Security through compartmentalization" - each task runs in its own isolated qube. Steep learning curve, but the most secure desktop OS available.</p>
    <div class="platforms"><span>Desktop</span></div>
  </a>
</div>
 
::: tip Easier first step: Linux
You don't have to jump straight to Tails or Qubes. Just switching from Windows to a mainstream Linux distro removes a huge amount of built-in telemetry. See the **[Linux Guide](/linux)** to get started.
:::
 
## Common Mistakes That Burn You {#common-mistakes}
 
The best tools in the world won't save you from bad habits. Most people who get de-anonymized do it to themselves. These are the classics (drawn from real OPSEC case studies).
 
<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Reusing a username or handle</h4>
    <p>The same nickname across forums, your "anonymous" account, and an old gaming profile links everything to you. Anonymous identities must be <strong>completely separate</strong> - new name, new email, never cross-referenced.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Mixing real and anonymous identities</h4>
    <p>Logging into your personal Gmail over the same Tor session, or checking a private account once from your home IP, can collapse months of careful separation in a single click.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Posting photos with metadata</h4>
    <p>Uploading a picture with intact EXIF/GPS data has located plenty of people who thought they were anonymous. Always strip metadata first (see <a href="#encryption-files">Files</a>).</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Bragging (the ego problem)</h4>
    <p>Talking about what you did, where, or when - even vaguely - hands your adversary timeline and detail. Many famous downfalls came from someone who couldn't resist telling people.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Trusting a VPN to make you anonymous</h4>
    <p>A VPN moves trust, it doesn't erase you. Don't do high-risk things behind a VPN thinking it's the same as Tor - it isn't.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Doing it all at once and giving up</h4>
    <p>Privacy is incremental. Trying to flip every switch in a weekend leads to broken workflows and abandonment. Pick your threat model, do the green route, then build from there.</p>
  </div>
</div>
 
::: danger Consistency beats perfection
A single slip - one login, one reused name, one un-scrubbed photo - can undo everything. Anonymity is a habit, not a toolkit. If your threat model is serious, write down your rules and follow them every single time.
:::
 
## Credits & Resources {#credits}
 
The people and projects this guide stands on. All free, all worth your time.
 
<div class="sources-grid">
  <div class="source-card">
    <div class="source-header">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
      <strong>The Hitchhiker's Guide to Online Anonymity</strong>
    </div>
    <p class="source-citation">The definitive, exhaustive anonymity guide. No ads, no affiliate links - the inspiration for this guide's structure.</p>
    <a href="https://anonymousplanet.net/" target="_blank" rel="noopener noreferrer" class="source-link">Visit &rarr;</a>
  </div>
  <div class="source-card">
    <div class="source-header">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      <strong>Privacy Guides</strong>
    </div>
    <p class="source-citation">Community-maintained, regularly-updated recommendations for privacy tools across every category.</p>
    <a href="https://www.privacyguides.org/" target="_blank" rel="noopener noreferrer" class="source-link">Visit &rarr;</a>
  </div>
  <div class="source-card">
    <div class="source-header">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
      <strong>EFF Surveillance Self-Defense</strong>
    </div>
    <p class="source-citation">The Electronic Frontier Foundation's plain-language guides to threat modeling and protecting yourself.</p>
    <a href="https://ssd.eff.org/" target="_blank" rel="noopener noreferrer" class="source-link">Visit &rarr;</a>
  </div>
  <div class="source-card">
    <div class="source-header">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
      <strong>The OPSEC Bible</strong>
    </div>
    <p class="source-citation">Real-world OPSEC case studies and failures - the basis for the "Common Mistakes" section.</p>
    <a href="https://bible.beginnerprivacy.com/" target="_blank" rel="noopener noreferrer" class="source-link">Visit &rarr;</a>
  </div>
  <div class="source-card">
    <div class="source-header">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
      <strong>Have I Been Pwned</strong>
    </div>
    <p class="source-citation">Free breach-notification service. Check your exposure and subscribe for alerts.</p>
    <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer" class="source-link">Visit &rarr;</a>
  </div>
  <div class="source-card">
    <div class="source-header">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <strong>VirusTotal</strong>
    </div>
    <p class="source-citation">Scan files and URLs against 70+ engines before you trust them.</p>
    <a href="https://www.virustotal.com/" target="_blank" rel="noopener noreferrer" class="source-link">Visit &rarr;</a>
  </div>
</div>
 
<div class="related-grid">
  <a href="/passwords" class="related-card"><GuideIcon name="lock" class="related-icon" /> Password Guide</a>
  <a href="/linux" class="related-card"><GuideIcon name="monitor" class="related-icon" /> Linux Guide</a>
  <a href="/darkweb" class="related-card"><GuideIcon name="globe" class="related-icon" /> Dark Web Guide</a>
</div>
 

## Frequently Asked Questions

<details class="faq-item">
<summary>Is a VPN enough for privacy?</summary>

No. A VPN hides your traffic from your ISP and the local network, but it does not stop websites, advertisers, or the VPN provider itself from tracking you. Pair it with a hardened browser, private search engine, and email aliases for real coverage.

</details>

<details class="faq-item">
<summary>Can my school see my browsing?</summary>

If you are on the school Wi-Fi or a school-issued device, yes — they can see and log activity, and often use content filters. A VPN hides the content from the network but may violate school acceptable-use rules, and the school can still see that you connected to a VPN. On your own phone using cellular data, they generally cannot see what you browse.

</details>

<details class="faq-item">
<summary>Doesn't privacy only matter if you have something to hide?</summary>

Privacy is about control, not secrecy. Your data is used to set prices, target ads, shape what you see, and make decisions about you (loans, jobs, insurance). 'Nothing to hide' still means you deserve a say in who builds a profile of your life.

</details>

<details class="faq-item">
<summary>What's the single most important privacy change I can make?</summary>

Use a password manager plus unique emails/aliases so a breach at one site can't cascade into the rest of your accounts. It's the highest-leverage step for most people.

</details>

<details class="faq-item">
<summary>Is incognito/private mode actually private?</summary>

No. It only stops your local browser from saving history and cookies. Your ISP, employer, school, and the websites you visit can still see everything. It is not a privacy tool.

</details>

<details class="faq-item">
<summary>Are privacy browsers like Brave or Firefox enough on their own?</summary>

They help a lot by blocking trackers by default, but they are not complete. Combine them with private search (like DuckDuckGo or Startpage), encrypted DNS, and good account hygiene to cover the gaps.

</details>
<BackLinks />
 
<style scoped>
.guide-hero {
  padding: 1.75rem;
  margin: 1.5rem 0 2rem;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.guide-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0 0 0.75rem;
}
.guide-intro {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  margin: 0;
}
 
/* Legend */
.legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin: 0 0 1.5rem;
}
.legend-dot {
  display: inline-block;
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  vertical-align: middle;
}
.legend-dot.green { background: #27ae60; }
.legend-dot.orange { background: #f39c12; }
.legend-dot.red { background: #e74c3c; }
 
/* Card grids */
.card-grid-2,
.card-grid-3 {
  display: grid;
  gap: 1rem;
  margin: 1.25rem 0;
}
.card-grid-2 { grid-template-columns: repeat(2, 1fr); }
.card-grid-3 { grid-template-columns: repeat(3, 1fr); }
 
.shared-card {
  display: block;
  padding: 1.1rem 1.2rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: inherit;
  text-decoration: none;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}
a.shared-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}
.shared-card h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}
.shared-card p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
 
/* Card head with favicon */
.card-head {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 0.5rem;
}
.card-head h4 { margin: 0; }
.card-fav {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  flex-shrink: 0;
  object-fit: contain;
  background: var(--vp-c-bg);
}
 
/* Platform badges */
.platforms {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.75rem;
}
.platforms span {
  font-size: 0.62rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 0.12rem 0.4rem;
  border-radius: 5px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
}
 
/* Sources grid */
.sources-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1.25rem 0;
}
.source-card {
  padding: 1.1rem 1.2rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.source-header {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 0.5rem;
}
.source-header svg { color: var(--vp-c-brand-1); flex-shrink: 0; }
.source-header strong { font-size: 0.95rem; }
.source-citation {
  margin: 0 0 0.75rem;
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
.source-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.source-link:hover { text-decoration: underline; }
 
/* Related guides */
.related-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 2rem 0 1rem;
}
.related-card {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: border-color 0.18s ease, transform 0.18s ease;
}
.related-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}
.related-icon { color: var(--vp-c-brand-1); }
 
@media (max-width: 768px) {
  .card-grid-2,
  .card-grid-3,
  .sources-grid {
    grid-template-columns: 1fr;
  }
}
</style>
 