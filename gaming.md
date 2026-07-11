---
title: Gaming Guide
description: Optimize your gaming setup, improve performance, and discover the best tools.
---

<div class="guide-hero">
  <h1>Gaming Guide</h1>
  <p class="guide-meta"><GuideIcon name="pencil" :size="14" /> Written by <strong>Nero</strong></p>
  <p class="guide-intro">From PC builds and performance tuning to console modding and indie game discovery, this guide covers everything you need for a better gaming experience across every platform.</p>
</div>

## PC Gaming

### PC Build Guide

<div class="card-grid-2">
  <div class="fa-card reveal">
    <div class="fa-header high">
      <span class="fa-header-icon">🖥️</span>
      <h4>Entry Level (~$500)</h4>
    </div>
    <p>Ryzen 5 5600 + RX 6600 + 16GB DDR4 + 500GB NVMe. Runs esports titles at 1080p high and AAA games at 1080p medium. Best bang for buck.</p>
  </div>
  <div class="fa-card reveal">
    <div class="fa-header">
      <span class="fa-header-icon">🎮</span>
      <h4>Mid Range (~$1000)</h4>
    </div>
    <p>Ryzen 5 7600X + RTX 4060 Ti + 32GB DDR5 + 1TB NVMe. Great 1440p performance. Handles any game at high settings.</p>
  </div>
  <div class="fa-card reveal">
    <div class="fa-header medium">
      <span class="fa-header-icon">⚡</span>
      <h4>High End (~$2000+)</h4>
    </div>
    <p>Ryzen 7 7800X3D + RTX 4070 Ti Super + 32GB DDR5 + 2TB NVMe. Excellent 4K gaming. The 7800X3D is currently the best gaming CPU.</p>
  </div>
  <div class="fa-card reveal">
    <div class="fa-header low">
      <span class="fa-header-icon">🚀</span>
      <h4>Ultimate (~$3500+)</h4>
    </div>
    <p>Ryzen 9 7950X3D + RTX 4090 + 64GB DDR5 + 4TB NVMe. Overkill for most, but if you want max FPS at 4K, this is it.</p>
  </div>
</div>

<div class="about-tip reveal">
  <span class="tip-icon">💡</span>
  <span><strong>Tip:</strong> Use <a href="https://pcpartpicker.com/" target="_blank" rel="noopener noreferrer">PCPartPicker</a> to check compatibility and find the best prices. It automatically filters incompatible parts and shows prices across multiple retailers.</span>
</div>

### Performance Optimization

<div class="card-grid-2">
  <div class="fa-card reveal">
    <div class="fa-header">
      <span class="fa-header-icon">🎨</span>
      <h4>Graphics Settings Priority</h4>
    </div>
    <p>For the best visual fidelity per FPS: turn down shadows, reflections, and post-processing first. Keep textures high (they cost little performance). Use DLSS/FSR if available - it's basically free performance.</p>
  </div>
  <div class="fa-card reveal">
    <div class="fa-header">
      <span class="fa-header-icon">🔄</span>
      <h4>Driver Updates</h4>
    </div>
    <p>Keep GPU drivers updated. NVIDIA: GeForce Experience. AMD: Adrenalin. Intel: Arc Control. New drivers often include game-specific optimizations that boost FPS.</p>
  </div>
  <div class="fa-card reveal">
    <div class="fa-header">
      <span class="fa-header-icon">⚙️</span>
      <h4>Windows Game Mode</h4>
    </div>
    <p>Enable Game Mode in Windows Settings. Disable hardware acceleration in Discord and browser while gaming. Close background apps you don't need.</p>
  </div>
  <div class="fa-card reveal">
    <div class="fa-header">
      <span class="fa-header-icon">🖥️</span>
      <h4>Monitor Settings</h4>
    </div>
    <p>Enable your monitor's rated refresh rate in display settings (it defaults to 60Hz on many monitors). Enable FreeSync/G-Sync for tear-free gaming. Use the correct cable (DP 1.4 or HDMI 2.1 for high refresh).</p>
  </div>
</div>

### PC Troubleshooting & Fixes

Inspired by <a href="https://www.pcgamingwiki.com/wiki/Home" target="_blank" rel="noopener noreferrer">PCGamingWiki</a>, the encyclopedia of PC game fixes.

<div class="card-grid-2">
  <div class="fa-card reveal">
    <div class="fa-header">
      <span class="fa-header-icon">🚫</span>
      <h4>Game Won't Launch</h4>
    </div>
    <p>Install latest Visual C++ Redistributables and DirectX. Verify game files in Steam/Epic. Run as administrator. Check antivirus isn't blocking the executable. Update Windows.</p>
  </div>
  <div class="fa-card reveal">
    <div class="fa-header">
      <span class="fa-header-icon">📉</span>
      <h4>Stuttering &amp; Frame Drops</h4>
    </div>
    <p>Disable V-Sync if using FreeSync/G-Sync. Lower shadow quality. Close overlay apps (Discord, Steam, GeForce Experience). Check thermals with MSI Afterburner. Set power plan to High Performance.</p>
  </div>
  <div class="fa-card reveal">
    <div class="fa-header">
      <span class="fa-header-icon">🎮</span>
      <h4>Controller Not Working</h4>
    </div>
    <p>Use Steam Input to remap controllers. For Xbox controllers, update firmware via Xbox Accessories app. For PS controllers, install DS4Windows. Try different USB ports or Bluetooth pairing.</p>
  </div>
  <div class="fa-card reveal">
    <div class="fa-header">
      <span class="fa-header-icon">🔊</span>
      <h4>Audio Issues</h4>
    </div>
    <p>Set correct audio output in Windows Sound Settings. Disable audio enhancements. Update audio drivers. For crackling audio, increase buffer size in your audio interface settings.</p>
  </div>
</div>

<div class="about-tip reveal">
  <span class="tip-icon">💡</span>
  <span><strong>Tip:</strong> <a href="https://www.pcgamingwiki.com/wiki/Home" target="_blank" rel="noopener noreferrer">PCGamingWiki</a> has game-specific fixes for thousands of titles. Search for your game before spending hours troubleshooting.</span>
</div>

## Xbox

### Remote Play & Streaming

<div class="resource-grid">
  <a href="https://github.com/unknownskl/greenlight" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=github.com&sz=32" width="24" height="24" class="resource-favicon" alt="GitHub favicon" />
    <div class="resource-body">
      <h4>Greenlight</h4>
      <p>Open-source client for Xbox xCloud and home streaming. Works on Linux, macOS, Windows, and Steam Deck. Stream your Xbox games to any device.</p>
    </div>
  </a>
  <a href="https://www.xbox.com/en-US/xbox-game-pass" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=xbox.com&sz=32" width="24" height="24" class="resource-favicon" alt="Xbox favicon" />
    <div class="resource-body">
      <h4>Xbox Cloud Gaming</h4>
      <p>Stream hundreds of Game Pass titles to your phone, tablet, or PC. No console required with Game Pass Ultimate.</p>
    </div>
  </a>
</div>

### Xbox Modding & Homebrew

<div class="resource-grid">
  <a href="https://www.reddit.com/r/XboxModding/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=reddit.com&sz=32" width="24" height="24" class="resource-favicon" alt="Reddit favicon" />
    <div class="resource-body">
      <h4>r/XboxModding</h4>
      <p>Community for Xbox hardware and software modding. RGH, JTAG, hard drive upgrades, and custom dashboards.</p>
    </div>
  </a>
  <a href="https://www.reddit.com/r/XboxRetailHomebrew/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=reddit.com&sz=32" width="24" height="24" class="resource-favicon" alt="Reddit favicon" />
    <div class="resource-body">
      <h4>r/XboxRetailHomebrew</h4>
      <p>Homebrew on retail Xbox consoles without modding. Run emulators, homebrew apps, and custom software.</p>
    </div>
  </a>
  <a href="https://www.reddit.com/r/XboxHomebrew/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=reddit.com&sz=32" width="24" height="24" class="resource-favicon" alt="Reddit favicon" />
    <div class="resource-body">
      <h4>r/XboxHomebrew</h4>
      <p>General Xbox homebrew community. Tutorials, app recommendations, and help with running unsigned code.</p>
    </div>
  </a>
  <a href="https://www.darksoftware.xyz" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=darksoftware.xyz&sz=32" width="24" height="24" class="resource-favicon" alt="DarkSoftware favicon" />
    <div class="resource-body">
      <h4>DarkSoftware</h4>
      <p>Archive of firmware files, exploits, and tools for Xbox, PlayStation, and Switch. Essential resource for console modding.</p>
    </div>
  </a>
</div>

### Xbox Modding Guide

<div class="card-grid-2">
  <div class="fa-card reveal">
    <div class="fa-header high">
      <span class="fa-header-icon">🟢</span>
      <h4>Original Xbox</h4>
    </div>
    <p>Most models can be softmoded with splinter cell or MechAssault exploits. Hardmod with tsop flash or modchip for unlimited potential. Great for emulation and media center use.</p>
  </div>
  <div class="fa-card reveal">
    <div class="fa-header high">
      <span class="fa-header-icon">✅</span>
      <h4>Xbox 360</h4>
    </div>
    <p>RGH (Reset Glitch Hack) or JTAG for unsigned code. Slim models are preferred. Run emulators, homebrew games, and backup your disc library.</p>
  </div>
  <div class="fa-card reveal">
    <div class="fa-header medium">
      <span class="fa-header-icon">🔶</span>
      <h4>Xbox One</h4>
    </div>
    <p>Limited modding on retail units. Dev mode available for $20 gives access to retroarch and homebrew. Retail homebrew scene is growing via browser exploits.</p>
  </div>
  <div class="fa-card reveal">
    <div class="fa-header low">
      <span class="fa-header-icon">🔴</span>
      <h4>Xbox Series S/X</h4>
    </div>
    <p>Dev mode is the primary method for homebrew. RetroArch runs well. Retail exploits are actively being researched by the community.</p>
  </div>
</div>

## PlayStation

### PlayStation Modding & Homebrew

<div class="resource-grid">
  <a href="https://vita.hacks.guide" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=vita.hacks.guide&sz=32" width="24" height="24" class="resource-favicon" alt="Vita Hacks Guide favicon" />
    <div class="resource-body">
      <h4>PS Vita Hacks Guide</h4>
      <p>Complete guide to PS Vita custom firmware. From stock to Ensō. Run emulators, homebrew, and PSP games via Adrenaline.</p>
    </div>
  </a>
  <a href="https://www.darksoftware.xyz" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=darksoftware.xyz&sz=32" width="24" height="24" class="resource-favicon" alt="DarkSoftware favicon" />
    <div class="resource-body">
      <h4>DarkSoftware</h4>
      <p>Firmware archives, exploits, and tools for PS3, PS4, PS5, and PS Vita. Essential for staying on hackable firmware versions.</p>
    </div>
  </a>
  <a href="https://www.youtube.com/playlist?list=PLn7ji3VsPy3FRxLrjz5ScpvpTirAxQ3me" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=youtube.com&sz=32" width="24" height="24" class="resource-favicon" alt="YouTube favicon" />
    <div class="resource-body">
      <h4>PS Vita Modding Tutorials</h4>
      <p>Video walkthrough of the entire PS Vita modding process. Step-by-step guide from initial setup to running homebrew.</p>
    </div>
  </a>
</div>

### PlayStation Modding Guide

<div class="card-grid-2">
  <div class="fa-card reveal">
    <div class="fa-header high">
      <span class="fa-header-icon">🟢</span>
      <h4>PS Vita / PS TV</h4>
    </div>
    <p>Complete custom firmware via HENkaku/Ensō. Run RetroArch, Adrenaline (PSP emulator), and native homebrew. SD2Vita adapters give cheap storage. All firmwares 1.03-3.74 supported.</p>
  </div>
  <div class="fa-card reveal">
    <div class="fa-header high">
      <span class="fa-header-icon">✅</span>
      <h4>PS3</h4>
    </div>
    <p>CFW (Custom Firmware) on compatible models. HEN on super slims. Run emulators, backup games, and multimedia apps. Multiman for game management.</p>
  </div>
  <div class="fa-card reveal">
    <div class="fa-header medium">
      <span class="fa-header-icon">🔶</span>
      <h4>PS4</h4>
    </div>
    <p>Jailbreak available on firmware 9.00 and below (via PPPwn). Firmware 11.00 also exploitable. Run homebrew, emulators, and backup games. Stay on low firmware for best results.</p>
  </div>
  <div class="fa-card reveal">
    <div class="fa-header low">
      <span class="fa-header-icon">🔴</span>
      <h4>PS5</h4>
    </div>
    <p>Limited homebrew scene. Firmware exploits are being researched. Currently best used on PS4 for homebrew needs.</p>
  </div>
</div>

<div class="about-tip reveal">
  <span class="tip-icon">⚠️</span>
  <span><strong>Warning:</strong> Modding your console may void your warranty and can risk bricking your device. Always follow guides exactly and keep your device charged during the process.</span>
</div>

## Indie Games

### Indie Game Stores

<div class="resource-grid">
  <a href="https://itch.io" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=itch.io&sz=32" width="24" height="24" class="resource-favicon" alt="itch.io favicon" />
    <div class="resource-body">
      <h4>itch.io</h4>
      <p>The largest indie game marketplace. Thousands of free and paid games. Direct developer support. Many games available as browser-playable.</p>
    </div>
  </a>
  <a href="https://github.com/Emersont1/itchio" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=github.com&sz=32" width="24" height="24" class="resource-favicon" alt="GitHub favicon" />
    <div class="resource-body">
      <h4>itch.io Downloader</h4>
      <p>Open-source command-line tool to download and update your itch.io library. Great for backing up your games.</p>
    </div>
  </a>
  <a href="https://gamejolt.com/games?price=free" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=gamejolt.com&sz=32" width="24" height="24" class="resource-favicon" alt="Game Jolt favicon" />
    <div class="resource-body">
      <h4>Game Jolt</h4>
      <p>Community-driven game platform. Large collection of free indie games. Social features and developer journals.</p>
    </div>
  </a>
  <a href="https://ninjakiwi.com/archive" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=ninjakiwi.com&sz=32" width="24" height="24" class="resource-favicon" alt="Ninja Kiwi favicon" />
    <div class="resource-body">
      <h4>Ninja Kiwi Archive</h4>
      <p>Archive of classic Ninja Kiwi Flash games. Bloons TD and other tower defense classics preserved for browser play.</p>
    </div>
  </a>
  <a href="https://gamdie.com" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=gamdie.com&sz=32" width="24" height="24" class="resource-favicon" alt="Gamdie favicon" />
    <div class="resource-body">
      <h4>Gamdie</h4>
      <p>Curated list of free games across all platforms. Filter by genre, platform, and rating. Great for finding hidden gems.</p>
    </div>
  </a>
</div>

### Before You Play

<div class="about-tip reveal">
  <span class="tip-icon">💡</span>
  <span><strong>Tip:</strong> Check <a href="https://beforeiplay.com/wiki/Main_Page" target="_blank" rel="noopener noreferrer">Before I Play</a> before starting any game. It lists things you should know before playing, like missable achievements, quality-of-life tips, and things the game doesn't tell you.</span>
</div>

## Browser Games

### Browser Game Platforms

<div class="resource-grid">
  <a href="https://www.nitrome.com" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=nitrome.com&sz=32" width="24" height="24" class="resource-favicon" alt="Nitrome favicon" />
    <div class="resource-body">
      <h4>Nitrome</h4>
      <p>Pixel art browser games. High-quality Flash-era games preserved and playable. platformers, puzzles, and action games.</p>
    </div>
  </a>
  <a href="https://www.newgrounds.com/games" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=newgrounds.com&sz=32" width="24" height="24" class="resource-favicon" alt="Newgrounds favicon" />
    <div class="resource-body">
      <h4>Newgrounds</h4>
      <p>The original indie game and animation portal. Thousands of games, animations, and audio projects. Active community since 1995.</p>
    </div>
  </a>
  <a href="https://armorgames.com" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=armorgames.com&sz=32" width="24" height="24" class="resource-favicon" alt="Armor Games favicon" />
    <div class="resource-body">
      <h4>Armor Games</h4>
      <p>Curated browser games. Strong tower defense and strategy sections. Community ratings and reviews help find quality games.</p>
    </div>
  </a>
  <a href="https://itch.io/games/free/platform-web" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=itch.io&sz=32" width="24" height="24" class="resource-favicon" alt="itch.io favicon" />
    <div class="resource-body">
      <h4>itch.io Web Games</h4>
      <p>Free browser-playable games on itch.io. Filter by genre, engine, and play time. No download required.</p>
    </div>
  </a>
  <a href="https://watabou.itch.io" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=itch.io&sz=32" width="24" height="24" class="resource-favicon" alt="itch.io favicon" />
    <div class="resource-body">
      <h4>Watabou</h4>
      <p>Procedurally generated games. Pixel Dungeon and other roguelikes. Unique, replayable browser games.</p>
    </div>
  </a>
  <a href="https://deepnight.net" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=deepnight.net&sz=32" width="24" height="24" class="resource-favicon" alt="Deepnight favicon" />
    <div class="resource-body">
      <h4>Deepnight</h4>
      <p>Developer of procedurally generated games. Spelunky-style platformers and roguelikes. All playable in browser.</p>
    </div>
  </a>
  <a href="https://kindanice.itch.io" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=itch.io&sz=32" width="24" height="24" class="resource-favicon" alt="itch.io favicon" />
    <div class="resource-body">
      <h4>Kindanice</h4>
      <p>Cozy, relaxing browser games. Short, atmospheric experiences perfect for a quick break.</p>
    </div>
  </a>
</div>

## Game Mods

### Modding Platforms

<div class="resource-grid">
  <a href="https://www.nexusmods.com" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=nexusmods.com&sz=32" width="24" height="24" class="resource-favicon" alt="Nexus Mods favicon" />
    <div class="resource-body">
      <h4>Nexus Mods</h4>
      <p>The largest modding community. Millions of mods for thousands of games. Vortex mod manager makes installation easy.</p>
    </div>
  </a>
  <a href="https://gamebanana.com" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=gamebanana.com&sz=32" width="24" height="24" class="resource-favicon" alt="GameBanana favicon" />
    <div class="resource-body">
      <h4>GameBanana</h4>
      <p>Modding community with a focus on cosmetics, maps, and player-created content. Strong community for fighting games and rhythm games.</p>
    </div>
  </a>
  <a href="https://www.moddb.com" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=moddb.com&sz=32" width="24" height="24" class="resource-favicon" alt="ModDB favicon" />
    <div class="resource-body">
      <h4>ModDB</h4>
      <p>Modding database and community. Mods, indie games, and development journals. Great for total conversions and standalone mods.</p>
    </div>
  </a>
  <a href="https://moddinglinked.com" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=moddinglinked.com&sz=32" width="24" height="24" class="resource-favicon" alt="ModdingLinked favicon" />
    <div class="resource-body">
      <h4>ModdingLinked</h4>
      <p>Comprehensive modding guides for Bethesda games. The Midnight Ride (Fallout 4), Viva New Vegas, and A Dragonborn's Fate (Skyrim).</p>
    </div>
  </a>
  <a href="https://github.com/ModOrganizer2/modorganizer" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=github.com&sz=32" width="24" height="24" class="resource-favicon" alt="GitHub favicon" />
    <div class="resource-body">
      <h4>Mod Organizer 2</h4>
      <p>Advanced mod manager for Bethesda games. Profile system, conflict detection, and virtual file system. The tool of choice for serious modders.</p>
    </div>
  </a>
  <a href="https://wand.com" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=wand.com&sz=32" width="24" height="24" class="resource-favicon" alt="WAND favicon" />
    <div class="resource-body">
      <h4>WAND</h4>
      <p>Modding tools and resources. Community-driven modding support for various games.</p>
    </div>
  </a>
</div>

### Modding Tips

<div class="card-grid-2">
  <div class="shared-card reveal">
    <h4>Always Backup Saves</h4>
    <p>Before installing mods, back up your save files. Mods can corrupt saves or make them incompatible. Keep backups in a separate folder.</p>
  </div>
  <div class="shared-card reveal">
    <h4>Read Mod Descriptions</h4>
    <p>Check compatibility, load order requirements, and known issues. Most mod problems come from not reading the instructions.</p>
  </div>
  <div class="shared-card reveal">
    <h4>Install One at a Time</h4>
    <p>Install and test mods individually. If something breaks, you know which mod caused it. Batch installing makes troubleshooting impossible.</p>
  </div>
  <div class="shared-card reveal">
    <h4>Use Mod Managers</h4>
    <p>Vortex, Mod Organizer 2, or the game's built-in manager. Manual installation leads to conflicts and broken load orders.</p>
  </div>
</div>

## Game Recommendations

### Recommendation Platforms

<div class="resource-grid">
  <a href="https://vsrecommendedgames.miraheze.org/wiki/Main_Page" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=miraheze.org&sz=32" width="24" height="24" class="resource-favicon" alt="Miraheze favicon" />
    <div class="resource-body">
      <h4>VS Recommended Games</h4>
      <p>Community-curated game recommendations. Focused on quality titles across all genres and platforms.</p>
    </div>
  </a>
  <a href="https://www.acclaimedvideogames.com" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=acclaimedvideogames.com&sz=32" width="24" height="24" class="resource-favicon" alt="Acclaimed Videogames favicon" />
    <div class="resource-body">
      <h4>Acclaimed Videogames</h4>
      <p>Archive of critically acclaimed games throughout history. Find the best games from every era.</p>
    </div>
  </a>
  <a href="https://steamdb.info/stats/gameratings/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=steamdb.info&sz=32" width="24" height="24" class="resource-favicon" alt="SteamDB favicon" />
    <div class="resource-body">
      <h4>SteamDB Ratings</h4>
      <p>Steam games ranked by player ratings. Find the highest-rated games on Steam with real player data.</p>
    </div>
  </a>
  <a href="https://tastedive.com/games" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=tastedive.com&sz=32" width="24" height="24" class="resource-favicon" alt="TasteDive favicon" />
    <div class="resource-body">
      <h4>TasteDive Games</h4>
      <p>Like "if you like X, try Y" for games. Enter a game you love and discover similar titles you might enjoy.</p>
    </div>
  </a>
  <a href="https://nodal.gg" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=nodal.gg&sz=32" width="24" height="24" class="resource-favicon" alt="Nodal favicon" />
    <div class="resource-body">
      <h4>Nodal</h4>
      <p>Game recommendation engine. Find new games based on your gaming history and preferences.</p>
    </div>
  </a>
</div>

## Essential Tools

### Performance & Monitoring

<div class="resource-grid">
  <a href="https://www.capframex.com" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=capframex.com&sz=32" width="24" height="24" class="resource-favicon" alt="CapFrameX favicon" />
    <div class="resource-body">
      <h4>CapFrameX</h4>
      <p>Frametime analysis tool. Record and analyze FPS, frametime, and system performance. Essential for benchmarking and comparing settings.</p>
    </div>
  </a>
  <a href="https://www.special-k.info" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=special-k.info&sz=32" width="24" height="24" class="resource-favicon" alt="Special K favicon" />
    <div class="resource-body">
      <h4>Special K</h4>
      <p>Advanced game fix and monitoring tool. Fixes stuttering, forces HDR, manages frame pacing. The Swiss Army knife of PC gaming.</p>
    </div>
  </a>
  <a href="https://www.systemrequirementslab.com/cyri/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=systemrequirementslab.com&sz=32" width="24" height="24" class="resource-favicon" alt="System Requirements Lab favicon" />
    <div class="resource-body">
      <h4>System Requirements Lab</h4>
      <p>Check if your PC can run a game. Automatically detects your hardware and compares it to game requirements.</p>
    </div>
  </a>
  <a href="https://www.msi.com/Landing/afterburner/graphics-cards" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=msi.com&sz=32" width="24" height="24" class="resource-favicon" alt="MSI favicon" />
    <div class="resource-body">
      <h4>MSI Afterburner</h4>
      <p>Overclocking and monitoring tool. Show real-time FPS, GPU/CPU temp, usage, and clock speeds as an overlay. Undervolt your GPU for lower temps.</p>
    </div>
  </a>
</div>

### Game Launchers & Libraries

<div class="resource-grid">
  <a href="https://store.steampowered.com/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=store.steampowered.com&sz=32" width="24" height="24" class="resource-favicon" alt="Steam favicon" />
    <div class="resource-body">
      <h4>Steam</h4>
      <p>The biggest PC gaming platform. Sales are legendary. Use Big Picture mode for couch gaming. Steam Input lets you remap any controller.</p>
    </div>
  </a>
  <a href="https://playnite.link/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=playnite.link&sz=32" width="24" height="24" class="resource-favicon" alt="Playnite favicon" />
    <div class="resource-body">
      <h4>Playnite</h4>
      <p>Unified game launcher that combines Steam, Epic, GOG, and more into one library. Open source and lightweight. No more switching between launchers.</p>
    </div>
  </a>
  <a href="https://lutris.net/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=lutris.net&sz=32" width="24" height="24" class="resource-favicon" alt="Lutris favicon" />
    <div class="resource-body">
      <h4>Lutris (Linux)</h4>
      <p>Game manager for Linux. Handles Wine, Proton, and native games. Makes gaming on Linux much easier than doing it manually.</p>
    </div>
  </a>
</div>

### Communication & Streaming

<div class="resource-grid">
  <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=discord.com&sz=32" width="24" height="24" class="resource-favicon" alt="Discord favicon" />
    <div class="resource-body">
      <h4>Discord</h4>
      <p>The standard for gaming communication. Create servers, voice chat, screen share. Use Krisp noise suppression (free) to filter background noise.</p>
    </div>
  </a>
  <a href="https://parsec.app/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=parsec.app&sz=32" width="24" height="24" class="resource-favicon" alt="Parsec favicon" />
    <div class="resource-body">
      <h4>Parsec</h4>
      <p>Low-latency game streaming. Host a game on your PC and play from anywhere. Great for local multiplayer with friends over the internet.</p>
    </div>
  </a>
  <a href="https://store.steampowered.com/remoteplay" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=store.steampowered.com&sz=32" width="24" height="24" class="resource-favicon" alt="Steam favicon" />
    <div class="resource-body">
      <h4>Steam Remote Play</h4>
      <p>Free streaming from your own PC. Play your Steam library on any device on your network (or over the internet).</p>
    </div>
  </a>
</div>

### Learning & Tutorials

<div class="resource-grid">
  <a href="https://www.youtube.com/c/TroubleChute/featured" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=youtube.com&sz=32" width="24" height="24" class="resource-favicon" alt="YouTube favicon" />
    <div class="resource-body">
      <h4>TroubleChute</h4>
      <p>PC gaming troubleshooting and optimization tutorials. Fix stuttering, improve FPS, and resolve common gaming issues.</p>
    </div>
  </a>
</div>

## Cloud Gaming & Game Pass

<div class="card-grid-2">
  <a href="https://www.xbox.com/en-US/xbox-game-pass" target="_blank" rel="noopener noreferrer" class="shared-card reveal">
    <h4>Xbox Game Pass</h4>
    <p>Netflix for games. Hundreds of games for $10-15/month. Includes Xbox Cloud Gaming - play on your phone, tablet, or low-end PC via streaming. Day one releases for Microsoft games.</p>
  </a>
  <a href="https://www.nvidia.com/en-us/geforce-now/" target="_blank" rel="noopener noreferrer" class="shared-card reveal">
    <h4>GeForce Now</h4>
    <p>Stream games you already own from NVIDIA's servers. Connects to Steam, Epic, and other stores. Free tier (1-hour sessions) or Priority ($10/month, 6-hour sessions).</p>
  </a>
  <a href="https://www.amazon.com/luna/" target="_blank" rel="noopener noreferrer" class="shared-card reveal">
    <h4>Amazon Luna</h4>
    <p>Amazon's cloud gaming service. Integrated with Twitch. Available through Prime Gaming for some free games.</p>
  </a>
  <a href="https://store.steampowered.com/remoteplay" target="_blank" rel="noopener noreferrer" class="shared-card reveal">
    <h4>Steam Remote Play</h4>
    <p>Free streaming from your own PC. Play your Steam library on any device on your network (or over the internet).</p>
  </a>
</div>

## Controller & Peripherals

<div class="resource-grid">
  <a href="https://www.xbox.com/en-US/accessories/controllers" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=xbox.com&sz=32" width="24" height="24" class="resource-favicon" alt="Xbox favicon" />
    <div class="resource-body">
      <h4>Xbox Wireless Controller</h4>
      <p>Best compatibility. Works natively with Windows. Good ergonomics, reliable build. The standard for PC gaming.</p>
    </div>
  </a>
  <a href="https://www.playstation.com/en-us/accessories/dualsense-wireless-controller/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=playstation.com&sz=32" width="24" height="24" class="resource-favicon" alt="PlayStation favicon" />
    <div class="resource-body">
      <h4>PS5 DualSense</h4>
      <p>Haptic feedback and adaptive triggers work in some PC games. Better for fighting games (d-pad). Needs USB or Bluetooth.</p>
    </div>
  </a>
  <a href="https://www.8bitdo.com/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=8bitdo.com&sz=32" width="24" height="24" class="resource-favicon" alt="8BitDo favicon" />
    <div class="resource-body">
      <h4>8BitDo Controllers</h4>
      <p>Retro-styled controllers with modern features. Great for emulation and 2D games. Pro 2 is the most versatile.</p>
    </div>
  </a>
  <a href="https://ds4-windows.com/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <img loading="lazy" src="https://www.google.com/s2/favicons?domain=ds4-windows.com&sz=32" width="24" height="24" class="resource-favicon" alt="DS4Windows favicon" />
    <div class="resource-body">
      <h4>DS4Windows</h4>
      <p>Use a PS4/PS5 controller on Windows with full functionality. Remap buttons, customize light bar, use touchpad as mouse.</p>
    </div>
  </a>
</div>


## Frequently Asked Questions

<details class="faq-item">
<summary>How do I deal with toxic players?</summary>

Mute, block, and move on. Most games have quick-mute (often a key like Tab or a scoreboard option). Don't feed the argument — it only escalates and ruins your session. Report repeat offenders.

</details>

<details class="faq-item">
<summary>Is gaming a waste of time?</summary>

Not by itself. Like any hobby it's fine in moderation and can build problem-solving, coordination, and friendships. It becomes a problem only when it crowds out sleep, school, health, or relationships.

</details>

<details class="faq-item">
<summary>How do I avoid spending too much money?</summary>

Turn off one-click buying, set a monthly entertainment budget, and wait 48 hours before any in-game purchase. Most 'limited' offers aren't actually going anywhere. Free-to-play is designed to wear down your resistance.

</details>

<details class="faq-item">
<summary>How do I find people to play with?</summary>

Discord communities, subreddits for your game, and friend-of-friend invites are the easiest routes. Playing co-op or joining a clan naturally builds a regular group.

</details>

<details class="faq-item">
<summary>Is it bad to use a guide or walkthrough?</summary>

Not at all. Guides are a normal part of gaming and great for stuck spots or optimization. Use them as much as you enjoy — it's your time.

</details>

<details class="faq-item">
<summary>How do I stop rage quitting?</summary>

Take a break the moment you feel tilted — a few minutes away resets your temper. Mute voice chat, lower your stakes, and remember it's a game. Chasing a loss almost always makes it worse.

</details>
<BackLinks />
