---
title: Linux for Beginners
description: A beginner's guide to getting started with Linux - distros, installation, terminal commands, filesystem hierarchy, desktop environments, and essential tools.
head:
  - ['meta', { property: 'og:title', content: 'Linux for Beginners' }]
  - ['meta', { property: 'og:description', content: "A beginner's guide to getting started with Linux - distros, installation, terminal commands, filesystem hierarchy, desktop environments, and essential tools." }]
  - ['meta', { property: 'og:image', content: '/og-image.png' }]
---

# The Ultimate Linux for Beginners Guide

::: tip Before You Begin
Linux isn't harder than Windows or macOS - it's just **different**. Expect a learning curve in the first week, but within a month most beginners feel comfortable. The key: be patient, use the terminal, and know that every Linux user started exactly where you are now.
:::

::: warning One important thing
You don't need to know everything to start. Pick a beginner-friendly distro, install it, and learn as you go. Breaking things and fixing them is the best way to learn Linux.
:::

## Table of Contents

<details open>
<summary>Click to expand/collapse</summary>

- [Choosing a Distro](#choosing-a-distro)
- [Try Before Installing](#try-before-installing)
- [Installation Overview](#installation)
- [Essential Terminal Commands](#terminal-commands)
- [Shell Customization](#shell-customization)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [The Filesystem Hierarchy](#filesystem)
- [XDG Base Directory](#xdg-base-directory)
- [Desktop Environments](#desktop-environments)
- [Package Managers](#package-managers)
- [Text Editors](#text-editors)
- [Essential Apps to Install](#essential-apps)
- [Gaming on Linux](#gaming-on-linux)
- [Linux Security](#linux-security)
- [Common Mistakes Beginners Make](#common-mistakes)
- [Getting Help](#getting-help)
- [Credits & Resources](#credits)

</details>

<p class="legend"><span class="legend-dot green"></span> Beginner-friendly &nbsp;·&nbsp; <span class="legend-dot orange"></span> Intermediate &nbsp;·&nbsp; <span class="legend-dot red"></span> Advanced &nbsp;·&nbsp; <span class="legend-dot desktop"></span> Desktop &nbsp;·&nbsp; <span class="legend-dot server"></span> Server-friendly</p>

## Choosing a Distro {#choosing-a-distro}

A "distro" (distribution) is a flavor of Linux. They all share the same Linux kernel underneath but differ in package manager, default software, and philosophy. There's no "best" distro - only the one that fits what you want to do.

<div class="card-grid-3">
  <a href="https://ubuntu.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #e95420;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/ubuntu.com.ico" alt="" loading="lazy" /><h4>Ubuntu</h4></div>
    <p>Best for beginners. Huge community, tons of tutorials, and most software works out of the box. The default recommendation for new users.</p>
    <div class="platforms"><span class="green">Beginner</span><span>Desktop</span><span>Server</span><span>apt</span><span>Fixed</span></div>
  </a>
  <a href="https://linuxmint.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #87cf3e;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/linuxmint.com.ico" alt="" loading="lazy" /><h4>Linux Mint</h4></div>
    <p>Even more beginner-friendly than Ubuntu. Familiar Windows-like interface with the Cinnamon desktop. Great for people switching from Windows. Also uses apt.</p>
    <div class="platforms"><span class="green">Beginner</span><span>Desktop</span><span>apt</span><span>Fixed</span></div>
  </a>
  <a href="https://fedoraproject.org/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #51a2da;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/fedoraproject.org.ico" alt="" loading="lazy" /><h4>Fedora</h4></div>
    <p>Bleeding-edge packages with stable releases. Great for developers. Ships with GNOME by default.</p>
    <div class="platforms"><span class="orange">Intermediate</span><span>Desktop</span><span>Server</span><span>dnf</span><span>Fixed</span></div>
  </a>
  <a href="https://pop.system76.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #48a9c5;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/pop.system76.com.ico" alt="" loading="lazy" /><h4>Pop!_OS</h4></div>
    <p>Built on Ubuntu with better tiling and gaming support. Great for developers and gamers. Uses apt.</p>
    <div class="platforms"><span class="green">Beginner</span><span>Desktop</span><span>apt</span><span>Fixed</span></div>
  </a>
  <a href="https://archlinux.org/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #1793d1;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/archlinux.org.ico" alt="" loading="lazy" /><h4>Arch Linux</h4></div>
    <p>DIY distro&mdash;you build it from the ground up. Steep learning curve but total control. Has access to the AUR. Not for absolute beginners.</p>
    <div class="platforms"><span class="red">Advanced</span><span>Desktop</span><span>Server</span><span>pacman</span><span>Rolling</span></div>
  </a>
  <a href="https://manjaro.org/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #35bf5c;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/manjaro.org.ico" alt="" loading="lazy" /><h4>Manjaro</h4></div>
    <p>Arch-based but user-friendly. Rolling release with access to AUR. Good middle ground between ease and control.</p>
    <div class="platforms"><span class="orange">Intermediate</span><span>Desktop</span><span>pacman</span><span>Rolling</span></div>
  </a>
</div>

::: tip Not sure where to start?
Pick **Ubuntu** or **Linux Mint**. They have the largest communities, the most beginner-friendly installers, and the easiest troubleshooting when something goes wrong. You can always switch distros later without losing your files (your /home directory stays separate).
:::

## Try Before Installing {#try-before-installing}

Don't want to commit? You don't have to. Linux is designed to be test-driven. Here are four ways to try it with zero risk.

<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #3498db;">
    <h4>Live USB</h4>
    <p>The most common way to test Linux. Download an ISO, write it to a USB stick with <a href="https://www.balena.io/etcher/" target="_blank" rel="noopener noreferrer">Balena Etcher</a> or <code>dd</code>, boot from it, and you're running Linux without touching your hard drive. When you're done, reboot and remove the USB. Performance is slower than an installed system, but you can test hardware compatibility, desktop environments, and pre-installed software.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>Virtual Machine</h4>
    <p>Run Linux in a window on your current OS using <a href="https://www.virtualbox.org/" target="_blank" rel="noopener noreferrer">VirtualBox</a> (free) or VMware. Allocate RAM and disk, boot the ISO, and you have a fully functional Linux install. Snapshots let you save and restore states. Great for testing distros, learning the terminal, and experimenting without risk.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e67e22;">
    <h4>Dual-Boot</h4>
    <p>Install Linux alongside your existing OS. Each time you boot, you choose which to run. Both OSes have full hardware access for maximum performance. The Ubuntu installer detects Windows and offers to install alongside it automatically. Before committing, shrink your Windows partition in Disk Management to make room.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #9b59b6;">
    <h4>WSL (Windows)</h4>
    <p>If you're on Windows and just want Linux <strong>tools</strong> without the full OS, enable <a href="https://learn.microsoft.com/en-us/windows/wsl/" target="_blank" rel="noopener noreferrer">WSL2</a>. Run <code>wsl --install</code> in PowerShell (Admin) and get a real Linux kernel running inside Windows with seamless integration&mdash;access Windows files from Linux, run Linux commands in VS Code's terminal, and run GUI apps.</p>
  </div>
</div>

::: tip Try the live USB before installing
Boot a <strong>live USB</strong> first to check that Wi-Fi, sound, Bluetooth, and graphics work. If something doesn't work on the live session, it likely won't work after installation either. This is the #1 way to avoid post-install frustration.
:::

## Installation Overview {#installation}

Installing Linux is easier than most people expect. Here's the general flow that works for most distros:

<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #3498db;">
    <h4>1. Create a Bootable USB</h4>
    <p>Download your distro's ISO file, then flash it to a USB stick (at least 4 GB). Use <a href="https://rufus.ie/" target="_blank" rel="noopener noreferrer">Rufus</a> (Windows), <a href="https://www.balena.io/etcher/" target="_blank" rel="noopener noreferrer">Balena Etcher</a> (cross-platform), or <code>dd</code> on existing Linux systems.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #9b59b6;">
    <h4>2. Boot from USB & Try It</h4>
    <p>Restart your computer and boot from the USB drive (you may need to press F12/F2/Del to change the boot order). Most distros let you "Try" the live environment before installing - use this to check that Wi-Fi, sound, and graphics work.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>3. Install Alongside or Replace</h4>
    <p>The installer will offer options: "Install alongside" your existing OS (dual-boot) or "Erase disk and install" (standalone Linux). Dual-boot is great for beginners who still need Windows for specific tasks.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e67e22;">
    <h4>4. Partitions (Simplified)</h4>
    <p>For most beginners, let the installer handle partitioning automatically. If you want to learn: your main data goes in <code>/home</code> (keep this separate so reinstalling doesn't wipe your files), the system in <code>/</code> (root), and optionally <code>swap</code> for overflow RAM.</p>
  </div>
</div>

::: warning Back up first
Before installing any OS, **back up your important files.** While Linux installers are reliable, partition operations always carry some risk. A USB backup takes 15 minutes and saves days of regret.
:::

## Essential Terminal Commands {#terminal-commands}

The terminal is where Linux shines. Once you get comfortable with these commands, you'll be faster on Linux than you ever were clicking through menus.

<div class="resource-grid">
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>ls</code></h4>
      <p>List files and directories. <code>ls -la</code> shows detailed view including hidden files (those starting with a dot).</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>cd</code></h4>
      <p>Change directory. <code>cd ..</code> goes up one level, <code>cd ~</code> goes to your home directory, <code>cd -</code> goes to the previous directory.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>pwd</code></h4>
      <p>Print working directory - shows where you are in the filesystem. Use it whenever you feel lost.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>cp</code> / <code>mv</code></h4>
      <p>Copy and move/rename files. <code>cp file1 file2</code> copies, <code>mv file1 dir/</code> moves, <code>mv old new</code> renames.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>rm</code></h4>
      <p>Remove files. <code>rm -rf dir/</code> removes a directory and its contents. <strong>There is no trash bin in the terminal - deleted is gone.</strong></p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>grep</code></h4>
      <p>Search within files. <code>grep "text" file.txt</code>. Pipe with <code>|</code> for powerful filtering: <code>command | grep "error"</code>.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>chmod</code></h4>
      <p>Change file permissions. <code>chmod +x script.sh</code> makes a file executable. <code>chmod 644 file</code> sets read/write for owner, read-only for everyone else.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>sudo</code></h4>
      <p>Run commands as superuser (administrator). <code>sudo apt install package</code>. <strong>Only use sudo when a command actually requires it</strong> - running everything as root is a security risk and can break your system.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>man</code></h4>
      <p>View manual pages for any command. <code>man ls</code> shows all ls options. Press <code>q</code> to exit. Your offline reference for every command on the system.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>cat</code> / <code>less</code></h4>
      <p>View file contents. <code>cat file.txt</code> prints the whole file at once. <code>less file.txt</code> shows it page by page (press space to scroll, <code>q</code> to quit).</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>ps</code> / <code>top</code></h4>
      <p>View running processes. <code>ps aux</code> shows all processes. <code>top</code> (or <code>htop</code>) shows a live-updating view. Press <code>q</code> to exit.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>echo</code></h4>
      <p>Print text to the terminal. Used everywhere: <code>echo $SHELL</code> shows your current shell, <code>echo "text" > file</code> writes to a file.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>find</code></h4>
      <p>Search for files and directories. <code>find /home -name "*.txt"</code> finds all text files in your home folder. <code>locate file</code> is faster but requires a database update with <code>sudo updatedb</code>.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>df</code> / <code>du</code></h4>
      <p>Check disk space. <code>df -h</code> shows free space on all mounted drives. <code>du -sh dir/</code> shows the total size of a directory. <code>du -h --max-depth=1</code> breaks it down by subfolder.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>wget</code> / <code>curl</code></h4>
      <p>Download files from the internet. <code>wget https://example.com/file</code> downloads a file. <code>curl -O https://example.com/file</code> does the same. curl is more scriptable; wget can recursively download entire sites.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>head</code> / <code>tail</code></h4>
      <p>View parts of a file. <code>head -n 20 file</code> shows the first 20 lines. <code>tail -f log.txt</code> follows a log file in real time&mdash;essential for debugging and monitoring.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>history</code></h4>
      <p>View your command history. <code>history | grep apt</code> finds every apt command you&rsquo;ve run. <code>!123</code> repeats command number 123. <code>!!</code> repeats the last command.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>tar</code> / <code>zip</code></h4>
      <p>Archive and compress files. <code>tar -czf archive.tar.gz dir/</code> compresses a directory. <code>tar -xzf archive.tar.gz</code> extracts it. <code>zip -r archive.zip dir/</code> creates a zip; <code>unzip archive.zip</code> extracts one.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>kill</code> / <code>pkill</code></h4>
      <p>Stop running processes. <code>kill 1234</code> stops process with PID 1234. <code>kill -9 1234</code> force-kills it. <code>pkill firefox</code> kills all Firefox processes by name. Use <code>ps aux | grep name</code> to find the PID first.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>ssh</code></h4>
      <p>Securely connect to remote machines. <code>ssh user@192.168.1.100</code> logs into a remote server. <code>ssh-keygen</code> creates SSH keys for password-less authentication. <code>scp file user@host:/path/</code> copies files over SSH.</p>
    </div>
  </div>
</div>

::: tip Pipes and redirection are superpowers
The real power of the Linux terminal comes from combining commands. Use <code>|</code> to send one command's output into the next: <code>dmesg | grep error | less</code>. Use <code>&gt;</code> to save output to a file: <code>ls &gt; files.txt</code>.
:::

## Shell Customization {#shell-customization}

Your <strong>shell</strong> is the command interpreter that reads what you type in the terminal and executes it. While every distro comes with a default shell (usually Bash), learning to customize your shell environment is one of the first steps toward Linux proficiency.

<div class="resource-grid">
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4>Bash</h4>
      <p>The default on most Linux distros. Reliable, well-documented, universally available. Your personal configuration lives in <code>~/.bashrc</code>&mdash;edit this file to add aliases, change the prompt, or set environment variables.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4>Zsh</h4>
      <p>Feature-rich shell with better auto-completion, spelling correction, and theme support. Configured via <code>~/.zshrc</code>. Install with <code>sudo apt install zsh</code>, then switch with <code>chsh -s $(which zsh)</code>.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4>Fish</h4>
      <p>A user-friendly shell with syntax highlighting, auto-suggestions, and a web-based configuration interface (<code>fish_config</code>). Less compatible with standard Bash scripts, but great for beginners who want a polished experience out of the box.</p>
    </div>
  </div>
</div>

<h3>Aliases Save Time</h3>

<p>Aliases are custom shortcuts for commands you use often. Add them to your shell config file:</p>

```
alias ll='ls -la'
alias gs='git status'
alias ..='cd ..'
alias update='sudo apt update && sudo apt upgrade'
```

<p>After adding entries, run <code>source ~/.bashrc</code> (or restart your terminal) to apply changes.</p>

<h3>Customize Your Prompt</h3>

<p>Your prompt (the text before where you type&mdash;usually <code>user@host:~$</code>) can show useful information. Tools like <a href="https://starship.rs/" target="_blank" rel="noopener noreferrer">Starship</a> make this trivial with minimal configuration and work across Bash, Zsh, and Fish.</p>

<h3>Dotfiles</h3>

<p>Your shell config (<code>.bashrc</code>, <code>.zshrc</code>) together with other configuration files (<code>.gitconfig</code>, <code>.vimrc</code>), define your entire development environment. Many users keep their <strong>dotfiles in a Git repository</strong> so they can replicate their setup on any machine in minutes. It&rsquo;s one of the best habits you can develop early.</p>

::: tip Start with Bash, branch out later
Bash is installed on every Linux system. Start by adding a few aliases to <code>~/.bashrc</code>. When you feel limited by its auto-completion or scripting capabilities, explore Zsh or Fish. Your aliases and config ideas transfer over easily.
:::

## Keyboard Shortcuts {#keyboard-shortcuts}

Linux desktop environments offer extensive keyboard customization. Learning these essential shortcuts will save you hours of clicking.

<div class="resource-grid">
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>Super</code> (Windows key)</h4>
      <p>Open the activities overview or app launcher. Start typing to search for apps, files, or settings. This is your home base on most Linux desktops.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>Alt + Tab</code></h4>
      <p>Switch between open applications. <code>Alt + `</code> (backtick) switches between windows of the same application only.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>Ctrl + Alt + T</code></h4>
      <p>Open a terminal window from anywhere. The single most important shortcut to memorize on day one.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>Ctrl + Alt + Arrows</code></h4>
      <p>Switch between workspaces (virtual desktops). Some distros use <code>Super + PageUp/Down</code> instead. Makes multitasking much cleaner.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>Print Screen</code></h4>
      <p>Take screenshots. <code>Alt + Print Screen</code> captures the current window. <code>Shift + Print Screen</code> lets you select a region. Most distros include dedicated screenshot tools with even more options.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>Alt + F2</code></h4>
      <p>Run a command without opening a terminal. A small dialog appears&mdash;type the command and press Enter. Perfect for quick one-off commands.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>Super + D</code></h4>
      <p>Show the desktop (minimize all windows). Press again to restore them. Great for quickly accessing desktop icons or hiding clutter.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4><code>Ctrl + Shift + Esc</code></h4>
      <p>Open the system monitor (task manager equivalent). View CPU, memory, and process details. Kill unresponsive applications from here.</p>
    </div>
  </div>
</div>

::: tip Customize Everything
Open <strong>Settings &rarr; Keyboard</strong> (GNOME) or <strong>System Settings &rarr; Shortcuts</strong> (KDE) to view and customize every shortcut. You can add custom shortcuts to launch specific applications or run scripts.
:::

## The Filesystem Hierarchy {#filesystem}

Linux doesn't use drive letters like Windows (C:, D:). Everything starts at the root directory <code>/</code> and branches out. Here's what each directory is for:

<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #3498db;">
    <h4><code>/</code> (Root)</h4>
    <p>The top of the filesystem. Everything - every drive, every partition - lives somewhere under <code>/</code>. Not to be confused with the <code>/root</code> user's home directory.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4><code>/home</code></h4>
    <p>Your personal files - documents, downloads, configs. Each user gets a folder here (<code>/home/username</code>). If you reinstall Linux, keeping <code>/home</code> separate preserves your files.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #9b59b6;">
    <h4><code>/etc</code></h4>
    <p>System configuration files. Everything from network settings to software configs lives here. Most edits use <code>sudo</code>.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e67e22;">
    <h4><code>/var</code></h4>
    <p>Variable data - logs, databases, print spools. If something's wrong, check <code>/var/log/syslog</code> or <code>/var/log/journal</code> first.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4><code>/tmp</code></h4>
    <p>Temporary files. Cleared on every reboot. Good for one-off downloads or files you don't need to keep.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #2ecc71;">
    <h4><code>/usr</code></h4>
    <p>User system resources. Most installed software, libraries, and shared data live here. <code>/usr/bin</code> is where most executable programs live.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #f39c12;">
    <h4><code>/opt</code></h4>
    <p>Optional/third-party software. Some programs (like Google Chrome, Zoom) install here. Each gets its own folder.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #1abc9c;">
    <h4><code>/boot</code></h4>
    <p>Boot loader files and the Linux kernel. Usually keep this small and don't touch it unless you know what you're doing.</p>
  </div>
</div>

::: tip Quick navigation trick
In most file managers and terminals, you can jump to <code>/home/you/Documents</code> with <code>~/Documents</code>. The <code>~</code> tilde is shorthand for your home directory.
:::

## XDG Base Directory {#xdg-base-directory}

As you use Linux, more and more applications create configuration files, cache data, and user-specific files. Without organization, your home directory quickly becomes a cluttered mess of dotfiles. The XDG Base Directory specification fixes this by defining standard locations.

<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #3498db;">
    <h4><code>~/.config</code></h4>
    <p><strong>XDG_CONFIG_HOME</strong>. User-specific configuration files. Most modern applications store their configs here. Back this up to preserve your customized settings across reinstalls.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4><code>~/.local/share</code></h4>
    <p><strong>XDG_DATA_HOME</strong>. User-specific application data like Flatpak apps, database files, and application state. This is often the largest directory and a good candidate for a separate partition.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e67e22;">
    <h4><code>~/.cache</code></h4>
    <p><strong>XDG_CACHE_HOME</strong>. Non-essential cached data&mdash;thumbnails, downloaded package lists, browser cache. Safe to delete periodically to free up space. The system regenerates what it needs.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #9b59b6;">
    <h4><code>~/.local/bin</code></h4>
    <p><strong>XDG_BIN_HOME</strong>. User-specific executables. Add to your PATH by putting <code>export PATH="$HOME/.local/bin:$PATH"</code> in your shell config. Great for Python tools installed with <code>pip install --user</code>.</p>
  </div>
</div>

::: tip Not all apps follow XDG yet
Some applications still write config files directly to <code>~/</code>. You can often force compliance by setting <code>export XDG_CONFIG_HOME="$HOME/.config"</code> in your shell config. The Arch Wiki maintains per-application workarounds for the worst offenders.
:::

## Desktop Environments {#desktop-environments}

Unlike Windows and macOS, Linux lets you choose your entire desktop interface. The "Desktop Environment" controls how windows, menus, and workspaces behave.

<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>GNOME</h4>
    <p>Modern, clean, minimalist. Uses a top bar and activities overview. Great for trackpad gestures. Default on Ubuntu, Fedora. <strong>Best for:</strong> users who like macOS-like simplicity.</p>
    <div class="platforms"><span class="green">Beginner</span><span>Polished</span></div>
  </div>
  <div class="shared-card" style="border-left: 3px solid #3498db;">
    <h4>KDE Plasma</h4>
    <p>Highly customizable, Windows-like interface. You can tweak almost everything. More features out of the box than GNOME. Default on Kubuntu, Fedora KDE Spin.</p>
    <div class="platforms"><span class="green">Beginner</span><span>Customizable</span></div>
  </div>
  <div class="shared-card" style="border-left: 3px solid #87cf3e;">
    <h4>Cinnamon</h4>
    <p>Traditional desktop layout - start menu, panel, system tray. Built by the Linux Mint team. The most familiar feel for Windows switchers.</p>
    <div class="platforms"><span class="green">Beginner</span><span>Windows-like</span></div>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e67e22;">
    <h4>XFCE</h4>
    <p>Lightweight and fast. Great for older hardware or anyone who wants a snappy, no-frills desktop. Looks traditional but uses very little RAM.</p>
    <div class="platforms"><span class="orange">Lightweight</span><span>Old HW</span></div>
  </div>
</div>

::: tip You can switch later
Your desktop environment is just software - you can install multiple and pick which one to use at the login screen. Try GNOME for a week, then KDE. Stick with what feels natural.
:::

## Package Managers {#package-managers}

Linux doesn't download installers from websites (mostly). Instead, you use a **package manager** that handles installing, updating, and removing software from centralized repositories. This is cleaner and more secure than the Windows way.

<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #e95420;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/ubuntu.com.ico" alt="" loading="lazy" /><h4>apt (Debian/Ubuntu/Mint/Pop)</h4></div>
    <p><code>sudo apt update && sudo apt install package</code>. Most common package manager. Repositories are huge and well-maintained. Also supports .deb packages.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #51a2da;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/fedoraproject.org.ico" alt="" loading="lazy" /><h4>dnf (Fedora)</h4></div>
    <p><code>sudo dnf install package</code>. Modern, fast, and well-integrated with Fedora. Uses .rpm packages.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #1793d1;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/archlinux.org.ico" alt="" loading="lazy" /><h4>pacman (Arch/Manjaro)</h4></div>
    <p><code>sudo pacman -S package</code>. Rolling release. Manjaro adds <code>pamac</code> for AUR access. Fast but requires more care when updating.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/flatpak.org.ico" alt="" loading="lazy" /><h4>Flatpak / Snap</h4></div>
    <p>Universal package formats that work across all distros. Flatpak: <code>flatpak install app</code>. Snap: <code>sudo snap install app</code>. Sandboxed for security, slightly larger download size.</p>
  </div>
</div>

::: tip The update habit
Run <code>sudo apt update && sudo apt upgrade</code> (or your distro's equivalent) regularly. Keeping your system updated fixes security holes and bugs. Most distros also have a GUI software center that handles this automatically.
:::

## Text Editors {#text-editors}

You'll spend a lot of time editing config files and code. Here are the main options on Linux:

<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/nano-editor.org.ico" alt="" loading="lazy" /><h4>nano</h4></div>
    <p>The beginner-friendly terminal editor. Shows commands at the bottom (<code>^X</code> exit, <code>^O</code> save). Install with <code>sudo apt install nano</code> if not included. <strong>If you only learn one terminal editor, make it nano.</strong></p>
    <div class="platforms"><span>Terminal</span><span class="green">Beginner</span></div>
  </div>
  <div class="shared-card" style="border-left: 3px solid #3498db;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/vim.org.ico" alt="" loading="lazy" /><h4>vim</h4></div>
    <p>Legendary modal editor. Steep learning curve (there's even <code>vimtutor</code> to learn it) but incredibly fast once mastered. Pre-installed on most distros. Worth learning eventually, but don't start here.</p>
    <div class="platforms"><span>Terminal</span><span class="red">Advanced</span></div>
  </div>
  <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/code.visualstudio.com.ico" alt="" loading="lazy" /><h4>VS Code</h4></div>
    <p>Full graphical code editor with built-in terminal, extensions, and Git integration. Install via <code>sudo snap install code --classic</code> or download from the website. The most popular editor on Linux.</p>
    <div class="platforms"><span>Desktop</span><span class="green">Beginner</span></div>
  </a>
  <a href="https://www.sublimetext.com/" target="_blank" rel="noopener noreferrer" class="shared-card" style="border-left: 3px solid #f39c12;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/sublimetext.com.ico" alt="" loading="lazy" /><h4>Sublime Text</h4></div>
    <p>Fast, lightweight graphical editor. Blazing performance even with huge files. Paid license (unlimited trial). Good alternative to VS Code if you want something lighter.</p>
    <div class="platforms"><span>Desktop</span><span class="orange">Freemium</span></div>
  </a>
</div>

## Essential Apps to Install {#essential-apps}

Here are the apps most Linux users install within the first week. Almost everything is available from your distro's package manager or software center.

<div class="resource-grid">
  <a href="https://www.mozilla.org/firefox/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <div class="resource-body">
      <h4>Firefox / Chromium</h4>
      <p>Web browsers. Firefox is the default on most distros. Chromium is the open-source base of Chrome. Both have excellent Linux support.</p>
    </div>
  </a>
  <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <div class="resource-body">
      <h4>VS Code</h4>
      <p>The most popular code editor on Linux. Built-in terminal, Git integration, and thousands of extensions.</p>
    </div>
  </a>
  <a href="https://www.videolan.org/vlc/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <div class="resource-body">
      <h4>VLC Media Player</h4>
      <p>Plays anything you throw at it. Video, audio, streaming, network streams - VLC handles it all without extra codecs.</p>
    </div>
  </a>
  <a href="https://www.gimp.org/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <div class="resource-body">
      <h4>GIMP / Krita</h4>
      <p>Image editing (GIMP) and digital painting (Krita). Both are free, open-source alternatives to Photoshop.</p>
    </div>
  </a>
  <a href="https://store.steampowered.com/" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <div class="resource-body">
      <h4>Steam / Lutris</h4>
      <p>Gaming on Linux. Steam has Proton for Windows games. Lutris manages game libraries and custom runners. Gaming is better than ever on Linux.</p>
    </div>
  </a>
  <a href="https://github.com/linuxmint/timeshift" target="_blank" rel="noopener noreferrer" class="resource-card reveal">
    <div class="resource-body">
      <h4>Timeshift</h4>
      <p>System snapshots. Take a snapshot before making big changes - if something breaks, you can roll back instantly. The Linux equivalent of System Restore.</p>
    </div>
  </a>
</div>

## Gaming on Linux {#gaming-on-linux}

A decade ago, gaming was Linux's weak spot. Today, it's one of the best reasons to switch. Thanks to Valve's Steam Deck (which runs Linux), Proton, and a thriving open-source ecosystem, most Windows games run on Linux with comparable or better performance.

### Steam and Proton

Valve's **Proton** is a compatibility layer that lets Windows games run on Linux. It's built into the Linux version of Steam&mdash;you don't need to configure anything. Just install Steam, search for a game, and click Install. If a game works, it works seamlessly.

<div class="resource-grid">
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4>Steam</h4>
      <p>Install with <code>sudo apt install steam</code> or grab it from your software center. Log in, install games, and Proton runs in the background. Check <a href="https://protondb.com/" target="_blank" rel="noopener noreferrer">ProtonDB</a> to see how any game runs before buying.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4>ProtonDB</h4>
      <p>The community compatibility database. Search any game and see real user reports: <strong>Native</strong> (built-in), <strong>Platinum</strong> (perfect), <strong>Gold</strong> (minor tweaks), <strong>Silver</strong> (playable with issues), <strong>Borked</strong> (broken).</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4>Proton GE</h4>
      <p>A community fork of Proton with additional patches and fixes not yet merged upstream. Install via <a href="https://github.com/GloriousEggroll/proton-ge-custom" target="_blank" rel="noopener noreferrer">ProtonUp-Qt</a>, a GUI manager that lets you install and switch between Proton versions with one click.</p>
    </div>
  </div>
  <div class="resource-card reveal">
    <div class="resource-body">
      <h4>Steam Deck</h4>
      <p>Valve's handheld runs SteamOS, an Arch-based Linux distribution. If a game is "Steam Deck Verified," it works great on desktop Linux too. The Deck single-handedly drove massive Proton improvements.</p>
    </div>
  </div>
</div>

### Wine, Lutris, and Other Game Launchers

Not every game is on Steam. For everything else, there's a tool.

<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/winehq.org.ico" alt="" loading="lazy" /><h4>Wine</h4></div>
    <p>The original Windows compatibility layer that Proton is built on. Can run almost any Windows application. Configured per-app with <code>winecfg</code>. Use <a href="https://wiki.winehq.org/" target="_blank" rel="noopener noreferrer">WineHQ</a> to check app compatibility. Install with <code>sudo apt install wine</code>.</p>
    <div class="platforms"><span>CLI</span><span class="orange">Advanced</span></div>
  </div>
  <div class="shared-card" style="border-left: 3px solid #3498db;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/lutris.net.ico" alt="" loading="lazy" /><h4>Lutris</h4></div>
    <p>Game manager that handles Wine/Proton versions per-game. One-click install scripts for thousands of games from Steam, Epic, GOG, Battle.net, and more. The easiest way to run non-Steam games. Install via <code>sudo apt install lutris</code>.</p>
    <div class="platforms"><span class="green">Beginner</span><span>GUI</span></div>
  </div>
  <div class="shared-card" style="border-left: 3px solid #9b59b6;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/heroicgameslauncher.com.ico" alt="" loading="lazy" /><h4>Heroic Games Launcher</h4></div>
    <p>A native Linux launcher for the Epic Games Store, GOG, and Amazon Games. No Wine configuration needed&mdash;Heroic handles it. Supports cloud saves and custom Proton versions. A must-have if you claim Epic's free games.</p>
    <div class="platforms"><span class="green">Beginner</span><span>GUI</span></div>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e67e22;">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/flathub.org.ico" alt="" loading="lazy" /><h4>Native Linux Games</h4></div>
    <p>More and more games ship native Linux builds, especially indie titles. Check <a href="https://store.steampowered.com/linux" target="_blank" rel="noopener noreferrer">Steam&#39;s Linux category</a> and <a href="https://www.gog.com/" target="_blank" rel="noopener noreferrer">GOG</a> for DRM-free native games. Native versions often perform better and use fewer resources.</p>
    <div class="platforms"><span class="green">Native</span></div>
  </div>
</div>

### GPU Drivers for Gaming

Your graphics card choice determines your gaming driver experience.

<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #e95420;">
    <h4>NVIDIA</h4>
    <p>Install the proprietary driver: <code>sudo apt install nvidia-driver-550</code> (Ubuntu) or use the "Additional Drivers" tool in your software center. Works well now but was historically slower than AMD for open-source support. Wayland support has improved significantly in recent drivers.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>AMD</h4>
    <p>The open-source <strong>Mesa</strong> drivers are included in the kernel and work out of the box. No installation needed. AMD GPUs offer better performance on Linux than Windows in many titles, and the open-source driver stack receives constant improvements.</p>
  </div>
</div>

::: tip Performance tip: GameMode
Install <strong>Feral's GameMode</strong>: <code>sudo apt install gamemode</code>. It optimizes CPU governor, I/O priority, and other settings while a game is running to maximize performance. Steam launches it automatically when supported. <strong>MangoHud</strong> (<code>sudo apt install mangohud</code>) adds an in-game performance overlay (FPS, temperatures, usage)&mdash;like MSI Afterburner for Linux.
:::

### Game Recording and Streaming

**OBS Studio** is the gold standard for recording and streaming on Linux. Install with <code>sudo apt install obs-studio</code>. For lightweight game recording with minimal performance impact, try <strong>GPU Screen Recorder</strong> (available as a Flatpak) or Steam's built-in recording feature.

### Tips for New Linux Gamers

- **Check ProtonDB before buying** a game on Steam. A "Platinum" or "Gold" rating means it runs well.
- **Use ProtonUp-Qt** to install Proton GE, which often fixes games that don't work with official Proton.
- **Add non-Steam games** to Steam to use its controller configuration and in-game overlay.
- **Join <a href="https://www.reddit.com/r/linux_gaming/" target="_blank" rel="noopener noreferrer">r/linux_gaming</a>** for help, game recommendations, and performance tweaks.
- **Don't dual-boot for gaming anymore**&mdash;99% of the Steam library runs on Linux now. Check your specific games on ProtonDB first.

## Linux Security {#linux-security}

Linux is more secure than Windows out of the box, but security still requires awareness. Here are the fundamentals every beginner should know.

<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Firewall with UFW</h4>
    <p>Linux doesn't enable a firewall by default. Install <strong>ufw</strong>: <code>sudo apt install ufw && sudo ufw enable</code>. It blocks incoming traffic while allowing outgoing. Add exceptions: <code>sudo ufw allow ssh</code>. Check status: <code>sudo ufw status</code>.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e67e22;">
    <h4>SSH Security</h4>
    <p>If you enable SSH, edit <code>/etc/ssh/sshd_config</code>: set <code>PermitRootLogin no</code> (never allow root login) and <code>PasswordAuthentication no</code> (keys only). Restart with <code>sudo systemctl restart sshd</code>. Generate keys with <code>ssh-keygen</code>.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #3498db;">
    <h4>File Permissions</h4>
    <p>Every file has an owner, group, and permissions (rwx). <code>ls -la</code> shows them. <code>chmod 755 file</code> sets rwx owner, rx others. <code>chown user:group file</code> changes ownership. Never <code>chmod 777</code> unless you fully understand the risk.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>Safe Software Sources</h4>
    <p>Ranked by safety: official repos &rarr; Flatpak/Snap &rarr; official PPAs &rarr; direct downloads &rarr; source builds &rarr; <code>curl | bash</code> (avoid). Package managers verify signatures and hashes. Random .deb files from the internet bypass all of this.</p>
  </div>
</div>

::: tip Updates are your best defense
Run <code>sudo apt update && sudo apt upgrade</code> weekly. Security patches are released frequently&mdash;updating is the single most effective security measure. Enable automatic security updates in your software center if available.
:::

<h3>Basic Security Habits</h3>

<ul>
  <li><strong>Don't run as root</strong> &mdash; Use a standard account and <code>sudo</code> only when needed. Running everything as root is like having admin permanently enabled on Windows.</li>
  <li><strong>Lock your screen</strong> &mdash; Set <code>Super + L</code> (on most desktops) and use it every time you step away.</li>
  <li><strong>Be careful with scripts</strong> &mdash; Always read a script before piping it to bash: <code>curl https://example.com/script.sh | less</code> to review it first.</li>
  <li><strong>Enable disk encryption</strong> &mdash; Most installers offer LUKS encryption. Enable it: without it, anyone who steals your laptop can pull the drive and read all your files.</li>
</ul>

## Common Mistakes Beginners Make {#common-mistakes}

Most "Linux disasters" come from a handful of avoidable mistakes. Learn these early and save yourself the pain.

<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Using sudo unnecessarily</h4>
    <p>Running everything as root can overwrite system files and break your install. If a command works without <code>sudo</code>, don't add it. Only use sudo when you get a "permission denied" error.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Forgetting <code>sudo apt update</code> before install</h4>
    <p>If <code>sudo apt install package</code> says "package not found," run <code>sudo apt update</code> first. Your local package list is probably outdated. This is the #1 "Linux doesn't have that app" complaint - and it's an easy fix.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Running random commands from the internet</h4>
    <p><code>curl https://some-random-site.sh | bash</code> is dangerous. Only run scripts from trusted sources (official repos, verified GitHub repos). Always read the script first if you can.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Not backing up before experimenting</h4>
    <p>Linux lets you change anything. That's the beauty and the danger. Use Timeshift (see Essential Apps) to snapshot your system before major changes. A 2-minute snapshot saves hours of reinstalling.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Installing from random .deb/.rpm files</h4>
    <p>Downloading random .deb files from the internet bypasses your package manager's security and update system. Prefer the official repos, then Flatpak/Snap, then official PPAs, then direct downloads as last resort.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #e74c3c;">
    <h4>Giving up too soon</h4>
    <p>The first week on Linux is the hardest. Things work differently. Keyboard shortcuts are different. But push through - after a month, the terminal will feel natural and Windows will feel limiting.</p>
  </div>
</div>

## Getting Help {#getting-help}

::: tip Before asking, search
Chances are someone has already asked and answered your question. These are the best places to look:
- **[The Arch Wiki](https://wiki.archlinux.org/)** - The most comprehensive Linux documentation on the web, useful even if you're not using Arch
- **[r/linuxquestions](https://www.reddit.com/r/linuxquestions/)** and **[r/linux4noobs](https://www.reddit.com/r/linux4noobs/)** - Friendly communities for beginners
- **[Ask Ubuntu](https://askubuntu.com/)** - Ubuntu-specific Q&A with high-quality answers
- **[Unix & Linux Stack Exchange](https://unix.stackexchange.com/)** - Broader Linux/Unix questions
:::

::: warning How to ask a good question
Include your **distro and version**, what you **expected to happen**, what **actually happened**, and any **error messages** (copy-paste the exact text). "It doesn't work" helps nobody. Show what commands you already tried.
:::

## Credits & Resources {#credits}

The projects and communities that make Linux the incredible ecosystem it is.

<div class="sources-grid">
  <div class="source-card">
    <div class="source-header">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
      <strong>Arch Wiki</strong>
    </div>
    <p class="source-citation">The definitive Linux documentation resource. Covers almost every distro, package, and configuration.</p>
    <a href="https://wiki.archlinux.org/" target="_blank" rel="noopener noreferrer" class="source-link">Visit &rarr;</a>
  </div>
  <div class="source-card">
    <div class="source-header">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      <strong>Ubuntu Documentation</strong>
    </div>
    <p class="source-citation">Official Ubuntu help center with beginner-friendly guides and tutorials.</p>
    <a href="https://help.ubuntu.com/" target="_blank" rel="noopener noreferrer" class="source-link">Visit &rarr;</a>
  </div>
  <div class="source-card">
    <div class="source-header">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <strong>Linux Journey</strong>
    </div>
    <p class="source-citation">Gamified, interactive Linux learning platform. Excellent for hands-on beginners.</p>
    <a href="https://linuxjourney.com/" target="_blank" rel="noopener noreferrer" class="source-link">Visit &rarr;</a>
  </div>
  <div class="source-card">
    <div class="source-header">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
      <strong>Linux.org</strong>
    </div>
    <p class="source-citation">Tutorials, forums, and articles covering every aspect of Linux for all skill levels.</p>
    <a href="https://www.linux.org/" target="_blank" rel="noopener noreferrer" class="source-link">Visit &rarr;</a>
  </div>
  <div class="source-card">
    <div class="source-header">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
      <strong>Ask Ubuntu</strong>
    </div>
    <p class="source-citation">Stack Exchange Q&A for Ubuntu. Searchable archive of real problems solved.</p>
    <a href="https://askubuntu.com/" target="_blank" rel="noopener noreferrer" class="source-link">Visit &rarr;</a>
  </div>
  <div class="source-card">
    <div class="source-header">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <strong>ExplainShell</strong>
    </div>
    <p class="source-citation">Paste any shell command and get a plain-English explanation of every flag and argument.</p>
    <a href="https://explainshell.com/" target="_blank" rel="noopener noreferrer" class="source-link">Visit &rarr;</a>
  </div>
</div>

<div class="related-grid">
  <a href="/privacy" class="related-card"><GuideIcon name="shield" class="related-icon" /> Online Privacy Guide</a>
  <a href="/gaming" class="related-card"><GuideIcon name="game" class="related-icon" /> Gaming Guide</a>
  <a href="/darkweb" class="related-card"><GuideIcon name="compass" class="related-icon" /> Dark Web Guide</a>
  <a href="/passwords" class="related-card"><GuideIcon name="lock" class="related-icon" /> Password Guide</a>
  <a href="/unenrollment" class="related-card"><GuideIcon name="zap" class="related-icon" /> Unenrollment Guide</a>
  <a href="/writing-and-note-taking" class="related-card"><GuideIcon name="pencil" class="related-icon" /> Writing & Note-Taking Guide</a>
</div>

<BackLinks />

<style scoped>
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
.legend-dot.desktop { background: #3498db; }
.legend-dot.server { background: #9b59b6; }

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
.platforms span.green { color: #27ae60; border-color: #27ae60; }
.platforms span.orange { color: #f39c12; border-color: #f39c12; }
.platforms span.red { color: #e74c3c; border-color: #e74c3c; }

/* Resource grid */
.resource-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1.25rem 0;
}
.resource-card {
  display: block;
  padding: 0.9rem 1.1rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: inherit;
  text-decoration: none;
  transition: transform 0.18s ease, border-color 0.18s ease;
}
a.resource-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
}
.resource-body h4 {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
}
.resource-body p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
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
  .sources-grid,
  .resource-grid {
    grid-template-columns: 1fr;
  }
}
</style>
