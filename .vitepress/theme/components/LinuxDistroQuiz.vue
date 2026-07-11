<template>
  <div class="linux-distro-quiz">
    <!-- Progress Indicator -->
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
      <div class="progress-text">Question {{ currentStep }} of {{ totalSteps }}</div>
    </div>

    <!-- Question Area -->
    <div v-if="!showResults" class="question-area">
      <h2 class="question-title">{{ currentQuestion.text }}</h2>
      
      <div class="options">
        <div v-for="option in currentQuestion.options" :key="option.value" class="option-group">
          <label class="option-label">
            <input 
              :type="currentQuestion.multi ? 'checkbox' : 'radio'"
              :name="'q' + currentStep"
              :value="option.value"
              :checked="isOptionSelected(option.value)"
              @change="toggleOption(option.value, $event.target.checked)"
              class="option-input"
            />
            <span class="option-text">{{ option.label }}</span>
          </label>
          <p v-if="option.description" class="option-desc">{{ option.description }}</p>
        </div>
      </div>

      <div class="nav-buttons">
        <button 
          v-if="currentStep > 1" 
          @click="prevQuestion" 
          class="nav-btn back"
        >
          ← Back
        </button>
        <button 
          v-if="currentStep < totalSteps" 
          @click="nextQuestion" 
          class="nav-btn next"
          :disabled="!hasAnswer"
        >
          Next →
        </button>
        <button 
          v-if="currentStep === totalSteps" 
          @click="calculateResults" 
          class="nav-btn submit"
          :disabled="!hasAnswer"
        >
          See Results 🎯
        </button>
      </div>
    </div>

    <!-- Results Area -->
    <div v-else class="results-area">
      <h2>Your Linux Distro Matches</h2>
      <p class="results-intro">Based on your answers, here are the best Linux distributions for you:</p>

      <div class="recommendations">
        <div v-for="(rec, index) in rankedResults" :key="rec.name" class="rec-card" :class="{ 'top-match': index === 0 }">
          <div class="rec-rank">{{ index + 1 }}. {{ rec.matchPercent }}% Match</div>
          <div class="rec-header">
            <div class="rec-icon">{{ rec.icon }}</div>
            <div class="rec-title">
              <h3>{{ rec.name }}</h3>
              <span class="rec-badge" :class="rec.badgeClass">{{ rec.badge }}</span>
            </div>
          </div>
          <div class="rec-content">
            <p>{{ rec.description }}</p>
            <div class="rec-pros">
              <strong>✅ Good for:</strong>
              <ul>
                <li v-for="pro in rec.pros.slice(0, 3)" :key="pro">{{ pro }}</li>
              </ul>
            </div>
            <div class="rec-cons" v-if="rec.cons && rec.cons.length">
              <strong>⚠️ Consider:</strong>
              <ul>
                <li v-for="con in rec.cons.slice(0, 2)" :key="con">{{ con }}</li>
              </ul>
            </div>
            <a :href="rec.link" target="_blank" rel="noopener noreferrer" class="rec-link">Learn More →</a>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="exportResults" class="export-btn">📄 Export Results (TXT)</button>
        <button @click="copyResults" class="copy-btn">📋 Copy to Clipboard</button>
        <button @click="resetQuiz" class="reset-btn">⟳ Take Quiz Again</button>
      </div>

      <div class="disclaimer">
        <small>⚠️ Recommendations are based on your preferences. Always test with a live USB before installing!</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ============================================
// QUESTIONS
// ============================================

const questions = [
  {
    id: 1,
    text: "What devices will you run Linux on? (Select all that apply)",
    multi: true,
    options: [
      { value: "laptop", label: "💻 Laptop", description: "Primary daily driver" },
      { value: "desktop", label: "🖥️ Desktop PC", description: "Home/office workstation" },
      { value: "old_hardware", label: "📦 Older Hardware (5+ years)", description: "Reviving an old machine" },
      { value: "vm", label: "📦 Virtual Machine", description: "Running inside VirtualBox/VMware" },
      { value: "server", label: "🖧 Server/VPS", description: "Headless, no GUI needed" }
    ]
  },
  {
    id: 2,
    text: "What's your primary goal?",
    multi: false,
    options: [
      { value: "daily_driver", label: "🏠 Daily Desktop OS", description: "Replace Windows/macOS for everyday use" },
      { value: "learning", label: "📚 Learn Linux Internals", description: "Understand how Linux works under the hood" },
      { value: "development", label: "💻 Software Development", description: "Web, backend, systems programming" },
      { value: "gaming", label: "🎮 Gaming", description: "Steam Deck, Proton, Lutris focus" },
      { value: "privacy", label: "🔒 Privacy & Security", description: "Hardened, minimal attack surface" },
      { value: "server", label: "🌐 Server/Hosting", description: "Web server, Docker, self-hosting" }
    ]
  },
  {
    id: 3,
    text: "How much time are you willing to spend on setup and maintenance?",
    multi: false,
    options: [
      { value: "minimal", label: "⚡ Minimal - Want it working out of the box", description: "Install and forget, graphical tools preferred" },
      { value: "moderate", label: "⚖️ Moderate - Willing to configure", description: "Happy to edit config files, use terminal occasionally" },
      { value: "extensive", label: "🔧 Extensive - Enjoy tinkering", description: "Want full control, don't mind manual setup" }
    ]
  },
  {
    id: 4,
    text: "What's your experience level?",
    multi: false,
    options: [
      { value: "complete_beginner", label: "🌱 Complete Beginner", description: "Never used Linux, new to terminal" },
      { value: "some_experience", label: "📖 Some Experience", description: "Used Linux before, know basic commands" },
      { value: "comfortable", label: "🚀 Comfortable", description: "Comfortable with terminal, package managers, configs" },
      { value: "advanced", label: "🧙 Advanced", description: "Can troubleshoot kernel, write scripts, compile software" }
    ]
  },
  {
    id: 5,
    text: "Do you need specific software compatibility?",
    multi: true,
    options: [
      { value: "ms_office", label: "📝 Microsoft Office", description: "Need Word/Excel/PowerPoint (web versions may work)" },
      { value: "adobe", label: "🎨 Adobe Creative Cloud", description: "Photoshop, Illustrator, Premiere (limited Linux support)" },
      { value: "windows_games", label: "🎮 Windows Games", description: "Anti-cheat games, latest AAA titles" },
      { value: "docker", label: "🐳 Docker/Containers", description: "Development, self-hosting, deployment" },
      { value: "none", label: "✅ None - Open to alternatives", description: "Happy to use LibreOffice, GIMP, native Linux apps" }
    ]
  },
  {
    id: 6,
    text: "How important is system stability vs. latest features?",
    multi: false,
    options: [
      { value: "rock_solid", label: "🏔️ Rock-Solid Stability", description: "Debian/Ubuntu LTS style - older packages, rarely breaks" },
      { value: "balanced", label: "⚖️ Balanced", description: "Regular updates, mostly stable - Fedora/openSUSE style" },
      { value: "cutting_edge", label: "🌊 Cutting Edge", description: "Latest kernels, drivers, software - Arch/rolling release" }
    ]
  },
  {
    id: 7,
    text: "Do you prefer a specific desktop environment style?",
    multi: false,
    options: [
      { value: "modern", label: "✨ Modern (GNOME)", description: "Clean, touch-friendly, workflow-focused" },
      { value: "traditional", label: "📋 Traditional (KDE/Cinnamon)", description: "Start menu, taskbar, system tray - Windows-like" },
      { value: "lightweight", label: "⚡ Lightweight (XFCE/MATE/LXQt)", description: "Fast, minimal resources, classic feel" },
      { value: "tiling", label: "🔲 Tiling (i3/Sway/Hyprland)", description: "Keyboard-driven, automatic window management" },
      { value: "no_preference", label: "🤷 No Preference", description: "Happy to try whatever comes default" }
    ]
  },
  {
    id: 8,
    text: "Is open-source philosophy important to you?",
    multi: false,
    options: [
      { value: "essential", label: "🔓 Essential - FLOSS only", description: "Prefer 100% free software, avoid proprietary blobs" },
      { value: "preferred", label: "👍 Preferred but pragmatic", description: "Like open source, will use proprietary drivers/firmware if needed" },
      { value: "not_important", label: "❌ Not Important", description: "Just want things to work, don't care about licensing" }
    ]
  }
]

// ============================================
// DISTRO DATABASE
// ============================================

const distros = [
  {
    id: "ubuntu",
    name: "Ubuntu",
    icon: "🟠",
    badge: "Best for Beginners",
    badgeClass: "best",
    description: "Most popular desktop Linux. Huge community, excellent documentation, works out of the box. LTS releases supported 5 years.",
    pros: ["Largest software availability", "Excellent hardware support", "Huge community/help online", "Easy third-party driver install"],
    cons: ["Snap packages controversial", "More bloat than minimal distros", "GNOME can be resource-heavy"],
    link: "https://ubuntu.com",
    features: {
      platforms: ["laptop", "desktop", "vm", "server"],
      goals: ["daily_driver", "development", "learning"],
      setupEffort: ["minimal"],
      experience: ["complete_beginner", "some_experience"],
      software: ["none", "docker"],
      stability: ["rock_solid", "balanced"],
      desktop: ["modern", "no_preference"],
      foss: ["preferred", "not_important"]
    }
  },
  {
    id: "linux_mint",
    name: "Linux Mint",
    icon: "🟢",
    badge: "Best Windows Switcher",
    badgeClass: "best",
    description: "Based on Ubuntu LTS but with a traditional desktop (Cinnamon). No Snaps, pure .deb packages. Familiar, polished, just works.",
    pros: ["Traditional desktop (Cinnamon)", "No Snap forced packages", "Based on Ubuntu LTS stability", "Excellent multimedia codecs out of box"],
    cons: ["Slower package updates", "Less cutting-edge software", "Smaller team than Ubuntu"],
    link: "https://linuxmint.com",
    features: {
      platforms: ["laptop", "desktop", "vm"],
      goals: ["daily_driver", "learning"],
      setupEffort: ["minimal"],
      experience: ["complete_beginner", "some_experience"],
      software: ["none", "docker"],
      stability: ["rock_solid"],
      desktop: ["traditional", "no_preference"],
      foss: ["preferred", "not_important"]
    }
  },
  {
    id: "fedora",
    name: "Fedora Workstation",
    icon: "🔵",
    badge: "Best for Developers",
    badgeClass: "best",
    description: "Upstream-focused, cutting-edge but stable. Default GNOME, excellent Flatpak integration, SELinux by default. Linus Torvalds uses it.",
    pros: ["Latest stable software (6-month cycle)", "Strong Flatpak/FlatHub support", "Great for development", "Wayland-first, modern stack"],
    cons: ["Shorter support cycle (13 months)", "No proprietary drivers in repos", "Can be less stable than LTS"],
    link: "https://getfedora.org",
    features: {
      platforms: ["laptop", "desktop", "vm", "development"],
      goals: ["daily_driver", "development", "learning"],
      setupEffort: ["minimal", "moderate"],
      experience: ["some_experience", "comfortable"],
      software: ["none", "docker", "windows_games"],
      stability: ["balanced"],
      desktop: ["modern", "no_preference"],
      foss: ["preferred", "essential"]
    }
  },
  {
    id: "pop_os",
    name: "Pop!_OS",
    icon: "🛸",
    badge: "Best for Gaming/Creative",
    badgeClass: "best",
    description: "Ubuntu-based with COSMIC desktop (tiling + traditional). NVIDIA drivers pre-installed, great for gaming and creative work.",
    pros: ["NVIDIA ISO available", "Auto-tiling + traditional modes", "Great for gaming/GPU work", "Clean, polished UI"],
    cons: ["Ubuntu-based (Snap issues)", "Single maintainer (System76)", "Less community than Ubuntu/Mint"],
    link: "https://pop.system76.com",
    features: {
      platforms: ["laptop", "desktop", "gaming"],
      goals: ["daily_driver", "gaming", "development"],
      setupEffort: ["minimal"],
      experience: ["complete_beginner", "some_experience"],
      software: ["windows_games", "docker", "none"],
      stability: ["balanced"],
      desktop: ["modern", "traditional", "no_preference"],
      foss: ["preferred", "not_important"]
    }
  },
  {
    id: "debian",
    name: "Debian",
    icon: "🌀",
    badge: "Rock-Solid Stability",
    badgeClass: "best",
    description: "The grandfather of Ubuntu/Mint. Legendary stability, massive repositories, strict free software policy. Choose Stable for servers, Testing for newer desktop.",
    pros: ["Unmatched stability (Stable)", "Huge package repositories", "No corporate influence", "Runs on everything (toasters to mainframes)"],
    cons: ["Older software in Stable", "Non-free firmware separate install", "Manual configuration often needed", "Slower release cycle"],
    link: "https://debian.org",
    features: {
      platforms: ["laptop", "desktop", "server", "old_hardware", "vm"],
      goals: ["daily_driver", "server", "learning", "privacy"],
      setupEffort: ["moderate", "extensive"],
      experience: ["some_experience", "comfortable", "advanced"],
      software: ["none", "docker"],
      stability: ["rock_solid"],
      desktop: ["traditional", "lightweight", "no_preference"],
      foss: ["essential", "preferred"]
    }
  },
  {
    id: "arch",
    name: "Arch Linux",
    icon: "🏹",
    badge: "Ultimate Control",
    badgeClass: "best",
    description: "Rolling release, build-from-scratch installation. You choose every component. AUR provides access to almost any software. Not for beginners.",
    pros: ["Bleeding-edge rolling release", "AUR = massive software availability", "Complete control over system", "Excellent wiki documentation"],
    cons: ["Manual installation required", "Frequent updates can break things", "No hand-holding", "Requires ongoing maintenance"],
    link: "https://archlinux.org",
    features: {
      platforms: ["laptop", "desktop", "vm"],
      goals: ["learning", "development", "daily_driver"],
      setupEffort: ["extensive"],
      experience: ["comfortable", "advanced"],
      software: ["none", "docker", "windows_games"],
      stability: ["cutting_edge"],
      desktop: ["modern", "traditional", "lightweight", "tiling", "no_preference"],
      foss: ["essential", "preferred"]
    }
  },
  {
    id: "endeavouros",
    name: "EndeavourOS",
    icon: "🚀",
    badge: "Arch Made Accessible",
    badgeClass: "best",
    description: "Arch-based with a graphical installer (Calamares). Close to vanilla Arch but easier to start. Great stepping stone to Arch.",
    pros: ["Arch base with easy installer", "Choose DE during install", "AUR access out of box", "Helpful community"],
    cons: ["Still requires terminal comfort", "Rolling release risks", "Smaller than Mint/Ubuntu"],
    link: "https://endeavouros.com",
    features: {
      platforms: ["laptop", "desktop", "vm"],
      goals: ["learning", "development", "daily_driver"],
      setupEffort: ["moderate"],
      experience: ["some_experience", "comfortable"],
      software: ["none", "docker", "windows_games"],
      stability: ["cutting_edge"],
      desktop: ["modern", "traditional", "lightweight", "no_preference"],
      foss: ["preferred", "essential"]
    }
  },
  {
    id: "manjaro",
    name: "Manjaro",
    icon: "💚",
    badge: "User-Friendly Arch",
    badgeClass: "",
    description: "Arch-based with held-back updates for stability. Graphical installer, hardware detection, multiple kernel support. Good middle ground.",
    pros: ["Easier than Arch", "Multiple kernels easily", "Hardware detection", "AUR access"],
    cons: ["Held-back updates can cause issues", "Past security controversies", "Not pure Arch"],
    link: "https://manjaro.org",
    features: {
      platforms: ["laptop", "desktop", "vm", "gaming"],
      goals: ["daily_driver", "gaming", "learning"],
      setupEffort: ["minimal", "moderate"],
      experience: ["complete_beginner", "some_experience"],
      software: ["none", "docker", "windows_games"],
      stability: ["balanced"],
      desktop: ["modern", "traditional", "lightweight", "no_preference"],
      foss: ["preferred", "not_important"]
    }
  },
  {
    id: "opensuse_tumbleweed",
    name: "openSUSE Tumbleweed",
    icon: "🦎",
    badge: "Best Rolling Stable",
    badgeClass: "best",
    description: "Rolling release with automated testing (openQA) before updates. Snapper/Btrfs snapshots for easy rollback. Enterprise-grade reliability.",
    pros: ["Automated QA on every update", "Snapper rollback built-in", "YaST configuration tool", "Excellent KDE integration"],
    cons: ["Large downloads for updates", "Learning curve for YaST/Snapper", "Fewer community tutorials"],
    link: "https://get.opensuse.org/tumbleweed",
    features: {
      platforms: ["laptop", "desktop", "server", "vm"],
      goals: ["daily_driver", "development", "server"],
      setupEffort: ["moderate"],
      experience: ["some_experience", "comfortable"],
      software: ["none", "docker"],
      stability: ["balanced", "cutting_edge"],
      desktop: ["modern", "traditional", "no_preference"],
      foss: ["essential", "preferred"]
    }
  },
  {
    id: "opensuse_leap",
    name: "openSUSE Leap",
    icon: "🦎",
    badge: "Enterprise Stability",
    badgeClass: "",
    description: "Fixed release (like LTS), shares codebase with SUSE Linux Enterprise. Free, stable, great for servers and conservative desktops.",
    pros: ["Enterprise-grade stability", "YaST all-in-one config tool", "Long-term support", "Transactional updates option"],
    cons: ["Older software versions", "Less desktop-focused community", "Large install size"],
    link: "https://get.opensuse.org/leap",
    features: {
      platforms: ["laptop", "desktop", "server", "vm"],
      goals: ["daily_driver", "server", "development"],
      setupEffort: ["moderate"],
      experience: ["some_experience", "comfortable"],
      software: ["none", "docker"],
      stability: ["rock_solid"],
      desktop: ["modern", "traditional", "no_preference"],
      foss: ["preferred", "not_important"]
    }
  },
  {
    id: "nixos",
    name: "NixOS",
    icon: "❄️",
    badge: "Reproducible Builds",
    badgeClass: "best",
    description: "Declarative, reproducible configuration. Entire system defined in code. Rollback to any previous generation instantly. Steep learning curve.",
    pros: ["Truly reproducible systems", "Atomic upgrades/rollbacks", "Declarative config as code", "Massive package set (nixpkgs)"],
    cons: ["Very steep learning curve", "Different paradigm (not FHS)", "Documentation fragmented", "Not for beginners"],
    link: "https://nixos.org",
    features: {
      platforms: ["laptop", "desktop", "server", "vm"],
      goals: ["development", "server", "learning", "privacy"],
      setupEffort: ["extensive"],
      experience: ["advanced"],
      software: ["docker", "none"],
      stability: ["cutting_edge", "balanced"],
      desktop: ["modern", "tiling", "no_preference"],
      foss: ["essential", "preferred"]
    }
  },
  {
    id: "garuda",
    name: "Garuda Linux",
    icon: "🦅",
    badge: "Gaming & Performance",
    badgeClass: "",
    description: "Arch-based, gaming-focused out of the box. Zen kernel, Btrfs + Snapper, gaming tools pre-installed. Beautiful dr460nized KDE edition.",
    pros: ["Gaming optimized (Zen kernel, gamemode)", "Btrfs + Snapper + Timeshift", "Beautiful KDE themes", "Chaotic-AUR for easy AUR access"],
    cons: ["Opinionated defaults", "Can be heavy/bloated", "Arch-based rolling risks"],
    link: "https://garudalinux.org",
    features: {
      platforms: ["laptop", "desktop", "gaming"],
      goals: ["gaming", "daily_driver"],
      setupEffort: ["minimal", "moderate"],
      experience: ["some_experience", "comfortable"],
      software: ["windows_games", "docker", "none"],
      stability: ["balanced", "cutting_edge"],
      desktop: ["modern", "traditional", "no_preference"],
      foss: ["preferred", "not_important"]
    }
  },
  {
    id: "kali",
    name: "Kali Linux",
    icon: "🐉",
    badge: "Security Professionals",
    badgeClass: "",
    description: "Debian-based, pre-installed penetration testing tools. Not a daily driver - for security auditing, forensics, red teaming.",
    pros: ["Hundreds of security tools", "Regular updates", "Multiple desktop options", "ARM images for Pi/mobile"],
    cons: ["Not for daily use", "Root by default (historically)", "Bloated for general use", "Attracts script kiddies"],
    link: "https://kali.org",
    features: {
      platforms: ["laptop", "vm", "server"],
      goals: ["learning", "privacy"],
      setupEffort: ["minimal"],
      experience: ["comfortable", "advanced"],
      software: ["none"],
      stability: ["rock_solid"],
      desktop: ["traditional", "lightweight", "no_preference"],
      foss: ["essential", "preferred"]
    }
  },
  {
    id: "tails",
    name: "Tails",
    icon: "🐛",
    badge: "Maximum Privacy",
    badgeClass: "best",
    description: "Amnesic live OS - routes everything through Tor, forgets everything on shutdown. For journalists, activists, high-threat models.",
    pros: ["Tor enforced for all traffic", "Amnesic - no persistence by default", "Based on Debian stable", "Designed for anonymity"],
    cons: ["Not a daily driver", "Slow (Tor)", "No persistent storage by default", "Very specific use case"],
    link: "https://tails.net",
    features: {
      platforms: ["laptop", "vm"],
      goals: ["privacy"],
      setupEffort: ["minimal"],
      experience: ["some_experience", "comfortable"],
      software: ["none"],
      stability: ["rock_solid"],
      desktop: ["traditional"],
      foss: ["essential"]
    }
  },
  {
    id: "ubuntu_server",
    name: "Ubuntu Server",
    icon: "☁️",
    badge: "Best Server Default",
    badgeClass: "best",
    description: "No GUI, minimal install, 5-year LTS. Cloud-init, MAAS, Landscape integration. Dominates cloud/VPS market.",
    pros: ["5-year LTS support", "Huge cloud provider support", "Excellent documentation", "Snap/APT both available"],
    cons: ["No GUI by default", "Snap push", "More resource usage than minimal"],
    link: "https://ubuntu.com/server",
    features: {
      platforms: ["server", "vm"],
      goals: ["server"],
      setupEffort: ["minimal", "moderate"],
      experience: ["some_experience", "comfortable", "advanced"],
      software: ["docker", "none"],
      stability: ["rock_solid"],
      desktop: ["no_preference"],
      foss: ["preferred", "not_important"]
    }
  },
  {
    id: "debian_server",
    name: "Debian (No Desktop)",
    icon: "🌀",
    badge: "Minimal Server",
    badgeClass: "",
    description: "Netinst or minimal install. You build exactly what you need. Ultimate stability, no bloat, runs on ancient hardware.",
    pros: ["Minimal resource usage", "Rock-solid stability", "Runs on anything", "No corporate baggage"],
    cons: ["Manual everything", "Older packages", "Non-free firmware separate"],
    link: "https://debian.org",
    features: {
      platforms: ["server", "old_hardware", "vm"],
      goals: ["server", "privacy"],
      setupEffort: ["moderate", "extensive"],
      experience: ["comfortable", "advanced"],
      software: ["docker", "none"],
      stability: ["rock_solid"],
      desktop: ["no_preference"],
      foss: ["essential", "preferred"]
    }
  },
  {
    id: "alpine",
    name: "Alpine Linux",
    icon: "🏔️",
    badge: "Containers/Embedded",
    badgeClass: "best",
    description: "Tiny (~5MB base), musl libc, BusyBox. Designed for containers, routers, embedded. Security-focused (PIE, stack protection).",
    pros: ["Extremely small", "Fast boot", "Security hardened", "Docker's default base image"],
    cons: ["musl libc compatibility issues", "Not for desktop use", "Limited package selection", "Steep learning curve"],
    link: "https://alpinelinux.org",
    features: {
      platforms: ["server", "vm", "old_hardware"],
      goals: ["server"],
      setupEffort: ["moderate", "extensive"],
      experience: ["advanced"],
      software: ["docker"],
      stability: ["rock_solid"],
      desktop: ["no_preference"],
      foss: ["essential"]
    }
  },
  {
    id: "rocky",
    name: "Rocky Linux / AlmaLinux",
    icon: "🪨",
    badge: "RHEL Compatible",
    badgeClass: "best",
    description: "1:1 RHEL rebuilds, binary compatible. Free enterprise-grade OS for production servers. 10-year support lifecycle.",
    pros: ["RHEL compatible (free)", "10-year support", "Enterprise stability", "No subscription needed"],
    cons: ["Very conservative packages", "Desktop not a focus", "Slower updates"],
    link: "https://rockylinux.org",
    features: {
      platforms: ["server", "vm"],
      goals: ["server"],
      setupEffort: ["moderate"],
      experience: ["comfortable", "advanced"],
      software: ["docker", "none"],
      stability: ["rock_solid"],
      desktop: ["no_preference"],
      foss: ["preferred", "not_important"]
    }
  },
  {
    id: "linux_lite",
    name: "Linux Lite",
    icon: "💻",
    badge: "Best for Old Hardware",
    badgeClass: "best",
    description: "Ubuntu LTS based, XFCE desktop. Designed for Windows 7 refugees on aging hardware. Includes easy driver/tools helpers.",
    pros: ["Runs on 1GB RAM / old CPUs", "Windows-like XFCE desktop", "Helpful welcome screen", "Lite Software installer"],
    cons: ["Based on older Ubuntu LTS", "Limited to XFCE", "Smaller community"],
    link: "https://linuxliteos.com",
    features: {
      platforms: ["laptop", "desktop", "old_hardware", "vm"],
      goals: ["daily_driver", "learning"],
      setupEffort: ["minimal"],
      experience: ["complete_beginner"],
      software: ["none"],
      stability: ["rock_solid"],
      desktop: ["traditional", "lightweight"],
      foss: ["preferred", "not_important"]
    }
  },
  {
    id: "bodhi",
    name: "Bodhi Linux",
    icon: "🧘",
    badge: "Ultra Lightweight",
    badgeClass: "",
    description: "Ubuntu LTS + Moksha desktop (Enlightenment fork). Beautiful, extremely light, runs on ancient hardware. Minimalist philosophy.",
    pros: ["Runs on 512MB RAM", "Beautiful Moksha desktop", "Ubuntu base = good compatibility", "Minimal bloat"],
    cons: ["Enlightenment learning curve", "Smaller community", "Less hand-holding"],
    link: "https://bodhilinux.com",
    features: {
      platforms: ["laptop", "desktop", "old_hardware", "vm"],
      goals: ["daily_driver", "learning"],
      setupEffort: ["moderate"],
      experience: ["some_experience"],
      software: ["none"],
      stability: ["rock_solid"],
      desktop: ["lightweight"],
      foss: ["preferred", "essential"]
    }
  },
  {
    id: "vanilla_os",
    name: "Vanilla OS",
    icon: "🍦",
    badge: "Immutable & Atomic",
    badgeClass: "best",
    description: "Ubuntu/Debian-based but immutable (ABRoot). Atomic updates, flatpak-first, transactional. Can't break your system with updates.",
    pros: ["Immutable - can't break base", "Atomic updates with rollback", "Flatpak-first (sandboxed)", "Both Ubuntu & Debian base options"],
    cons: ["Newer project", "Immutable learning curve", "Less customization of base"],
    link: "https://vanillaos.org",
    features: {
      platforms: ["laptop", "desktop", "vm"],
      goals: ["daily_driver", "development"],
      setupEffort: ["minimal", "moderate"],
      experience: ["some_experience", "comfortable"],
      software: ["none", "docker"],
      stability: ["balanced"],
      desktop: ["modern", "no_preference"],
      foss: ["preferred", "essential"]
    }
  },
  {
    id: "fedora_silverblue",
    name: "Fedora Silverblue",
    icon: "🔷",
    badge: "Immutable Workstation",
    badgeClass: "",
    description: "Immutable Fedora with rpm-ostree. Container-focused (toolbox/distrobox), Flatpak apps, atomic updates. GNOME by default.",
    pros: ["Immutable base OS", "Easy rollback (rpm-ostree)", "Toolbox/Distrobox for dev", "Verified boot support"],
    cons: ["Layering packages is different", "Requires container workflow", "GNOME only (officially)"],
    link: "https://fedoraproject.org/silverblue",
    features: {
      platforms: ["laptop", "desktop", "vm"],
      goals: ["daily_driver", "development", "privacy"],
      setupEffort: ["moderate"],
      experience: ["comfortable", "advanced"],
      software: ["docker", "none"],
      stability: ["balanced"],
      desktop: ["modern"],
      foss: ["essential", "preferred"]
    }
  },
  {
    id: "elementary",
    name: "elementary OS",
    icon: "🎨",
    badge: "macOS-like Polish",
    badgeClass: "",
    description: "Ubuntu LTS base, custom Pantheon desktop. Beautiful, opinionated, pay-what-you-want AppCenter. Great for designers/creatives.",
    pros: ["Beautiful, consistent UI", "Curated AppCenter", "Privacy-respecting", "Great for creatives"],
    cons: ["Opinionated (less customizable)", "Smaller app ecosystem", "Based on older Ubuntu LTS"],
    link: "https://elementary.io",
    features: {
      platforms: ["laptop", "desktop", "vm"],
      goals: ["daily_driver", "learning"],
      setupEffort: ["minimal"],
      experience: ["complete_beginner", "some_experience"],
      software: ["none"],
      stability: ["rock_solid"],
      desktop: ["modern"],
      foss: ["preferred", "not_important"]
    }
  },
  {
    id: "zorin",
    name: "Zorin OS",
    icon: "🎯",
    badge: "Windows/macOS Lookalike",
    badgeClass: "",
    description: "Ubuntu-based, Zorin Desktop mimics Windows 11 or macOS. Lite edition for old hardware. Paid 'Pro' edition adds more layouts/apps.",
    pros: ["Familiar UI for switchers", "Zorin Appearance tool", "Lite edition for old PCs", "Pre-installed Windows app support (Wine)"],
    cons: ["Core is free, Pro is paid", "Based on Ubuntu LTS (older packages)", "Less community than Mint"],
    link: "https://zorinos.com",
    features: {
      platforms: ["laptop", "desktop", "old_hardware", "vm"],
      goals: ["daily_driver", "learning"],
      setupEffort: ["minimal"],
      experience: ["complete_beginner"],
      software: ["windows_games", "none"],
      stability: ["rock_solid"],
      desktop: ["traditional", "modern", "lightweight"],
      foss: ["not_important", "preferred"]
    }
  }
]

// ============================================
// QUIZ STATE
// ============================================

const currentStep = ref(1)
const answers = ref({ 1: [] }) // Initialize Q1 as array for multi-select
const showResults = ref(false)
const rankedResults = ref([])

const totalSteps = computed(() => questions.length)
const progressPercent = computed(() => (currentStep.value / totalSteps.value) * 100)

const currentQuestion = computed(() => {
  return questions.find(q => q.id === currentStep.value)
})

// Check if an option is selected
function isOptionSelected(optionValue) {
  const currentAnswers = answers.value[currentStep.value]
  if (!currentAnswers) return false
  if (Array.isArray(currentAnswers)) {
    return currentAnswers.includes(optionValue)
  }
  return currentAnswers === optionValue
}

// Toggle option for multi-select questions
function toggleOption(optionValue, isChecked) {
  const currentAnswers = answers.value[currentStep.value]
  
  if (currentQuestion.value.multi) {
    // Multi-select (checkboxes)
    let newAnswers = Array.isArray(currentAnswers) ? [...currentAnswers] : []
    if (isChecked) {
      if (!newAnswers.includes(optionValue)) {
        newAnswers.push(optionValue)
      }
    } else {
      newAnswers = newAnswers.filter(v => v !== optionValue)
    }
    answers.value[currentStep.value] = newAnswers
  } else {
    // Single select (radio)
    answers.value[currentStep.value] = optionValue
  }
}

const hasAnswer = computed(() => {
  const answer = answers.value[currentStep.value]
  if (!answer) return false
  if (Array.isArray(answer)) return answer.length > 0
  return true
})

function nextQuestion() {
  if (currentStep.value < totalSteps.value && hasAnswer.value) {
    currentStep.value++
    // Initialize next multi-select question as array
    if (questions[currentStep.value - 1].multi) {
      answers.value[currentStep.value] = []
    }
  }
}

function prevQuestion() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Calculate match percentage for each distro
function calculateResults() {
  const userSelections = answers.value
  
  // Extract answers
  const selectedPlatforms = userSelections[1] || []
  const selectedGoal = userSelections[2]
  const selectedSetupEffort = userSelections[3]
  const selectedExperience = userSelections[4]
  const selectedSoftware = userSelections[5] || []
  const selectedStability = userSelections[6]
  const selectedDesktop = userSelections[7]
  const selectedFoss = userSelections[8]
  
  const results = distros.map(distro => {
    let matchScore = 0
    let maxScore = 0
    
    // Platform match (weight: 15%)
    const platformMatch = distro.features.platforms.some(p => selectedPlatforms.includes(p))
    if (selectedPlatforms.length > 0) {
      maxScore += 15
      if (platformMatch) matchScore += 15
    }
    
    // Goal match (weight: 20%)
    if (selectedGoal) {
      maxScore += 20
      if (distro.features.goals.includes(selectedGoal)) matchScore += 20
    }
    
    // Setup effort match (weight: 15%)
    if (selectedSetupEffort) {
      maxScore += 15
      if (distro.features.setupEffort.includes(selectedSetupEffort)) matchScore += 15
    }
    
    // Experience match (weight: 15%)
    if (selectedExperience) {
      maxScore += 15
      if (distro.features.experience.includes(selectedExperience)) matchScore += 15
    }
    
    // Software compatibility (weight: 10%)
    if (selectedSoftware.length > 0) {
      maxScore += 10
      // Check if distro supports ANY of the user's required software
      // 'none' means user is open to alternatives
      const hasNone = selectedSoftware.includes('none')
      if (hasNone) {
        matchScore += 10
      } else {
        const softwareMatch = selectedSoftware.some(s => distro.features.software.includes(s))
        if (softwareMatch) matchScore += 10
      }
    }
    
    // Stability preference (weight: 10%)
    if (selectedStability) {
      maxScore += 10
      if (distro.features.stability.includes(selectedStability)) matchScore += 10
    }
    
    // Desktop preference (weight: 10%)
    if (selectedDesktop && selectedDesktop !== 'no_preference') {
      maxScore += 10
      if (distro.features.desktop.includes(selectedDesktop)) matchScore += 10
    } else if (selectedDesktop === 'no_preference') {
      matchScore += 10
      maxScore += 10
    }
    
    // FOSS philosophy (weight: 5%)
    if (selectedFoss) {
      maxScore += 5
      if (distro.features.foss.includes(selectedFoss)) matchScore += 5
    }
    
    const matchPercent = maxScore > 0 ? Math.round((matchScore / maxScore) * 100) : 0
    
    return {
      ...distro,
      matchPercent
    }
  })
  
  // Sort by match percentage (highest first) and filter out very low matches
  rankedResults.value = results
    .filter(r => r.matchPercent > 15)
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 8) // Show top 8
  
  showResults.value = true
}

function resetQuiz() {
  currentStep.value = 1
  answers.value = { 1: [] }
  showResults.value = false
  rankedResults.value = []
}

function exportResults() {
  const date = new Date().toLocaleDateString()
  let resultsText = `LINUX DISTRO QUIZ RESULTS - ${date}\n`
  resultsText += `========================================\n\n`
  
  resultsText += `Your Answers:\n`
  resultsText += `1. Platforms: ${(answers.value[1] || []).join(', ') || 'Not specified'}\n`
  resultsText += `2. Primary Goal: ${answers.value[2] || 'Not specified'}\n`
  resultsText += `3. Setup Effort: ${answers.value[3] || 'Not specified'}\n`
  resultsText += `4. Experience Level: ${answers.value[4] || 'Not specified'}\n`
  resultsText += `5. Required Software: ${(answers.value[5] || []).join(', ') || 'Not specified'}\n`
  resultsText += `6. Stability Preference: ${answers.value[6] || 'Not specified'}\n`
  resultsText += `7. Desktop Style: ${answers.value[7] || 'Not specified'}\n`
  resultsText += `8. Open Source Philosophy: ${answers.value[8] || 'Not specified'}\n\n`
  
  resultsText += `Recommendations (by match percentage):\n`
  resultsText += `========================================\n`
  rankedResults.value.forEach((rec, idx) => {
    resultsText += `${idx + 1}. ${rec.name} - ${rec.matchPercent}% Match\n`
    resultsText += `   ${rec.description}\n`
    resultsText += `   Learn more: ${rec.link}\n\n`
  })
  
  const blob = new Blob([resultsText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `linux-distro-quiz-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function copyResults() {
  const topPicks = rankedResults.value.slice(0, 3).map(rec => 
    `${rec.name} (${rec.matchPercent}% match): ${rec.description}`
  ).join('\n\n')
  navigator.clipboard.writeText(`Top Linux Distro Picks:\n\n${topPicks}`)
  alert('Top 3 recommendations copied to clipboard!')
}
</script>

<style scoped>
.linux-distro-quiz {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 24px;
  border: 1px solid var(--vp-c-divider);
}

/* Progress Bar */
.progress-container {
  margin-bottom: 2rem;
}

.progress-bar {
  height: 6px;
  background: var(--vp-c-brand-1);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: right;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-top: 0.5rem;
}

/* Question Area */
.question-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-group {
  padding: 0.75rem;
  background: var(--vp-c-bg);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.option-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.option-input {
  margin-top: 0.2rem;
}

.option-text {
  font-weight: 500;
}

.option-desc {
  margin: 0.5rem 0 0 1.6rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

/* Navigation Buttons */
.nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.nav-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.nav-btn.back {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.nav-btn.next, .nav-btn.submit {
  background: var(--vp-c-brand-1);
  color: white;
  margin-left: auto;
}

.nav-btn.next:hover, .nav-btn.submit:hover {
  transform: translateX(3px);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Results Area */
.results-area h2 {
  text-align: center;
  margin-bottom: 0.5rem;
}

.results-intro {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.recommendations {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.rec-card {
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
}

.rec-card.top-match {
  border: 2px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.rec-rank {
  font-size: 0.7rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.rec-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.rec-icon {
  font-size: 2rem;
}

.rec-title h3 {
  margin: 0;
  font-size: 1.1rem;
}

.rec-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
}

.rec-badge.best {
  background: #2ecc71;
  color: white;
}

.rec-content p {
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.rec-pros, .rec-cons {
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
}

.rec-pros ul, .rec-cons ul {
  margin: 0.25rem 0 0 1.2rem;
}

.rec-link {
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-size: 0.8rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.export-btn, .copy-btn, .reset-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.export-btn {
  background: #2ecc71;
  color: white;
}

.copy-btn {
  background: var(--vp-c-brand-1);
  color: white;
}

.reset-btn {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.disclaimer {
  text-align: center;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

/* Mobile */
@media (max-width: 640px) {
  .linux-distro-quiz {
    padding: 1rem;
    margin: 1rem;
  }
  
  .question-title {
    font-size: 1.2rem;
  }
  
  .rec-header {
    flex-direction: column;
    text-align: center;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>