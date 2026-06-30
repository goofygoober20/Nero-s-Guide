<template>
  <div class="uf-wrap">
    <h2 class="uf-title">Chromebook unenrollment finder</h2>
    <p class="uf-sub">Enter your device info to find the right method.
      <a href="https://docs.titaniumnetwork.org/kajigs/versions" target="_blank" rel="noopener noreferrer">
        Don't know your version? Check here ↗
      </a>
    </p>

    <div class="uf-step">
      <div class="uf-label">Step 1 — Enter your ChromeOS version</div>
      <div class="uf-row">
        <input class="uf-input" type="number" v-model="version" placeholder="e.g. 131" />
        <span class="uf-hint">go to <code>chrome://version</code> to find this</span>
      </div>
    </div>

    <div class="uf-step">
      <div class="uf-label">Step 2 — Can your device boot a shim / SH1MMER?</div>
      <div class="uf-row">
        <button :class="['uf-btn', shimState === true && 'active']" @click="shimState = true">Yes (unkeyrolled)</button>
        <button :class="['uf-btn', shimState === false && 'active']" @click="shimState = false">No (keyrolled)</button>
        <button :class="['uf-btn', shimState === null && 'active']" @click="shimState = null">Not sure</button>
      </div>
      <div class="uf-hint-block">
        <p><strong>How to check if your device is keyrolled:</strong></p>
        <ol>
          <li>Enter recovery mode by holding <code>Esc + Refresh + Power</code>, then release Power</li>
          <li>At the recovery screen, press <code>Ctrl + D</code></li>
          <li>If prompted to turn off OS verification, press <code>Space</code> then <code>Enter</code></li>
          <li>If the device boots into Chrome OS normally → <strong>it is NOT keyrolled</strong></li>
          <li>If the device shows an error or loops back to recovery → <strong>it IS keyrolled</strong></li>
        </ol>
        <p>You can also check by looking at the write-protect status: open a terminal in developer mode and run <code>crosssystem --help</code>. If it returns an error about hardware, the device is likely keyrolled.</p>
      </div>
    </div>

    <button class="uf-btn find-btn" @click="findMethod">Find my method</button>

    <hr class="uf-divider" />

    <div v-if="results.length" class="uf-results">
      <div v-for="(result, i) in results" :key="i" class="uf-result">
        <div class="uf-tags">
          <span v-for="tag in result.tags" :key="tag.text" :class="['uf-tag', tag.color]">{{ tag.text }}</span>
        </div>
        <h3>{{ result.title }}</h3>
        <p>{{ result.description }}</p>
        <ol class="uf-steps">
          <li v-for="step in result.steps" :key="step" v-html="step"></li>
        </ol>
        <p v-if="result.note" class="uf-note" v-html="result.note"></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const version = ref('')
const shimState = ref(undefined)
const results = ref([])

function findMethod() {
  const ver = parseInt(version.value)
  results.value = []

  if (!ver || isNaN(ver)) {
    results.value = [{
      tags: [],
      title: 'Enter your ChromeOS version',
      description: 'Please enter your ChromeOS version number above to continue.',
      steps: []
    }]
    return
  }

  if (shimState.value === undefined) {
    results.value = [{
      tags: [],
      title: 'Select shim boot option',
      description: 'Please select whether your device can boot SH1MMER above.',
      steps: []
    }]
    return
  }

  const methods = []

  // Pencil Method — works on ALL versions
  methods.push({
    tags: [
      { text: 'All versions', color: 'tag-info' },
      { text: 'Pencil Method', color: 'tag-yellow' },
      { text: 'Hardware required', color: 'tag-red' }
    ],
    title: 'Pencil Method (all versions)',
    description: 'Works on any ChromeOS version but requires opening your Chromebook and bridging pins on the motherboard. Not recommended unless other methods fail.',
    steps: [
      'Open your Chromebook with a Phillips screwdriver and disconnect the battery',
      'Find the 8-pin SPI flash chip on the motherboard — look for WINBOND or GIGADEVICE branding (25Q64 or 25Q128)',
      'Bridge pin 3 (WP) and pin 8 (VCC) using a conductive material — make sure it doesn\'t touch other pins',
      'Reconnect power and boot into <a href="https://docs.titaniumnetwork.org/kajigs/sh1mmer" target="_blank" rel="noopener noreferrer">SH1MMER ↗</a>',
      'In SH1MMER utilities, run "Un-Enroll Device"',
      'Open the bash shell and run: <code>flashrom --wp-disable</code>',
      'Then run: <code>/usr/share/vboot/bin/set_gbb_flags.sh 0x8090</code>',
      'Power off, remove the bridge, then powerwash'
    ],
    note: 'If on v124+, you\'ll need to downgrade to v123 first. See <a href="https://docs.titaniumnetwork.org/kajigs/versions" target="_blank" rel="noopener noreferrer">Versions ↗</a> for downgrade instructions.'
  })

  // Old unenrollment — below v112 (kv1)
  if (ver < 112) {
    methods.push({
      tags: [
        { text: `v${ver} — kv1`, color: 'tag-green' },
        { text: 'Old unenrollment', color: 'tag-info' }
      ],
      title: 'Unenrollment for old versions (below v112)',
      description: 'Your device is on a very old version. See the Titanium Network guide for old unenrollment methods.',
      steps: [
        'Visit the <a href="https://docs.titaniumnetwork.org/kajigs/old-unenroll" target="_blank" rel="noopener noreferrer">old unenrollment guide ↗</a> for specific steps for your version'
      ]
    })
  }

  // Cryptosmite — v112-v119 (kv2)
  if (ver >= 112 && ver <= 119) {
    methods.push({
      tags: [
        { text: `v${ver} — kv2`, color: 'tag-green' },
        { text: 'Cryptosmite', color: 'tag-info' }
      ],
      title: 'Cryptosmite (v112–v119)',
      description: 'Your device is on Kernver 2 and is compatible with Cryptosmite.',
      steps: [
        'Visit the <a href="https://docs.titaniumnetwork.org/kajigs/cryptosmite" target="_blank" rel="noopener noreferrer">Cryptosmite guide ↗</a> for full instructions'
      ]
    })
  }

  // BadRecovery — v120-v123 (kv3)
  if (ver >= 120 && ver <= 123) {
    methods.push({
      tags: [
        { text: `v${ver} — kv3`, color: 'tag-green' },
        { text: 'BadRecovery', color: 'tag-info' }
      ],
      title: 'BadRecovery (v120–v123)',
      description: 'Your device is on Kernver 3 and is compatible with BadRecovery.',
      steps: [
        'Visit the <a href="https://docs.titaniumnetwork.org/kajigs/badrecovery" target="_blank" rel="noopener noreferrer">BadRecovery guide ↗</a> for full instructions'
      ]
    })
  }

  // Icarus + OOBESCAPE — v124-v132 (kv4)
  if (ver >= 124 && ver <= 132) {
    methods.push({
      tags: [
        { text: `v${ver} — kv4`, color: 'tag-green' },
        { text: 'Icarus', color: 'tag-info' }
      ],
      title: 'Icarus (v124–v132)',
      description: 'Your device is on Kernver 4 and is compatible with Icarus.',
      steps: [
        'Visit the <a href="https://docs.titaniumnetwork.org/kajigs/icarus" target="_blank" rel="noopener noreferrer">Icarus guide ↗</a> for full instructions'
      ]
    })
    methods.push({
      tags: [
        { text: `v${ver} — kv4`, color: 'tag-green' },
        { text: 'OOBESCAPE', color: 'tag-info' }
      ],
      title: 'OOBESCAPE (v124–v132)',
      description: 'Your device is on Kernver 4 and is also compatible with OOBESCAPE.',
      steps: [
        'Visit the <a href="https://docs.titaniumnetwork.org/kajigs/oobescape" target="_blank" rel="noopener noreferrer">OOBESCAPE guide ↗</a> for full instructions'
      ]
    })
  }

  // Br0ker + Sh1ttyOOBE — v132-v137 (kv5)
  if (ver >= 132 && ver <= 137) {
    methods.push({
      tags: [
        { text: `v${ver} — kv5`, color: 'tag-green' },
        { text: 'Br0ker', color: 'tag-info' }
      ],
      title: 'Br0ker (v132–v137)',
      description: 'Your device is on Kernver 5 and is compatible with Br0ker. Note: you cannot downgrade to v132 in kv5, but Br0ker handles this differently.',
      steps: [
        'Visit the <a href="https://docs.titaniumnetwork.org/kajigs/br0ker" target="_blank" rel="noopener noreferrer">Br0ker guide ↗</a> for full instructions'
      ]
    })
    methods.push({
      tags: [
        { text: `v${ver} — kv5`, color: 'tag-green' },
        { text: 'Sh1ttyOOBE', color: 'tag-info' }
      ],
      title: 'Sh1ttyOOBE (v132–v137)',
      description: 'Your device is on Kernver 5 and is also compatible with Sh1ttyOOBE.',
      steps: [
        'Visit the <a href="https://docs.titaniumnetwork.org/kajigs/sh1ttyoobe" target="_blank" rel="noopener noreferrer">Sh1ttyOOBE guide ↗</a> for full instructions'
      ]
    })
  }

  // Quicksilver — v125-v142 (kv6)
  if (ver >= 125 && ver <= 142) {
    if (shimState.value === true) {
      methods.push({
        tags: [
          { text: `v${ver} — kv6`, color: 'tag-green' },
          { text: 'Quicksilver — Method A', color: 'tag-info' }
        ],
        title: 'Quicksilver via SH1MMER (unkeyrolled)',
        description: 'Your device supports Quicksilver and can boot SH1MMER. This is the easiest method.',
        steps: [
          'Boot <strong>SH1MMER</strong> — make sure it\'s from at least <strong>December 15th 2025</strong>',
          'Open the <strong>Payloads</strong> menu',
          'Run the <strong>Quicksilver</strong> payload',
          'Go through setup — you should now be unenrolled!'
        ],
        note: 'If your SH1MMER is older than Dec 15 2025, run this in bash first: <code>vpd -i RW_VPD -s re_enrollment_key="$(openssl rand -hex 32)"</code>'
      })
    } else if (shimState.value === false) {
      methods.push({
        tags: [
          { text: `v${ver} — kv6`, color: 'tag-green' },
          { text: 'GoodSilver — Method B', color: 'tag-info' }
        ],
        title: 'GoodSilver (keyrolled device)',
        description: 'Your device cannot boot shims so use GoodSilver instead.',
        steps: [
          'Enable developer mode: hold <code>Esc + Refresh + Power</code>, then press <code>Ctrl + D</code>',
          'Enter recovery mode again',
          'Boot a <a href="https://unenrollment.com/GoodSilver" target="_blank" rel="noopener noreferrer">GoodSilver image ↗</a>',
          'Choose <strong>Deprovision</strong>',
          'After reboot, go through setup — you will be unenrolled!'
        ]
      })
    } else {
      methods.push({
        tags: [{ text: `v${ver} — compatible with Quicksilver`, color: 'tag-green' }],
        title: 'Check if your device is keyrolled',
        description: 'Your version supports Quicksilver but we need to know if your device is keyrolled.',
        steps: [
          'Try booting a SH1MMER shim',
          '<strong>If it boots:</strong> use Quicksilver via the Payloads menu',
          '<strong>If it doesn\'t boot:</strong> use <a href="https://unenrollment.com/GoodSilver" target="_blank" rel="noopener noreferrer">GoodSilver ↗</a> and choose Deprovision'
        ]
      })
    }
  }

  // Patched — above v142
  if (ver > 142) {
    methods.push({
      tags: [{ text: `v${ver} — Quicksilver patched`, color: 'tag-red' }],
      title: 'Version patched — limited options',
      description: 'Your ChromeOS version is above v142. Quicksilver is patched. Your best options are the Pencil Method above or downgrading.',
      steps: [
        'Consider downgrading to v142 or below — see <a href="https://docs.titaniumnetwork.org/kajigs/versions" target="_blank" rel="noopener noreferrer">Versions ↗</a>',
        'Or use the Pencil Method listed above (works on all versions)'
      ]
    })
  }

  results.value = methods
}
</script>

<style scoped>
.uf-wrap { padding: 1rem 0; }
.uf-title { font-size: 18px; font-weight: 500; margin: 0 0 4px; }
.uf-sub { font-size: 14px; color: var(--vp-c-text-2); margin: 0 0 1.5rem; }
.uf-step { margin-bottom: 1.5rem; }
.uf-label { font-size: 13px; color: var(--vp-c-text-2); margin-bottom: 6px; }
.uf-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.uf-input { width: 120px; padding: 6px 10px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 14px; }
.uf-hint { font-size: 13px; color: var(--vp-c-text-2); }
.uf-btn { cursor: pointer; padding: 6px 14px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 14px; }
.uf-btn:hover { background: var(--vp-c-bg-soft); }
.uf-btn.active { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); }
.find-btn { padding: 8px 20px; font-size: 15px; }
.uf-divider { border: none; border-top: 1px solid var(--vp-c-divider); margin: 1.5rem 0; }
.uf-results { display: flex; flex-direction: column; gap: 1rem; }
.uf-result { border-radius: 12px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); padding: 1rem 1.25rem; }
.uf-result h3 { font-size: 16px; font-weight: 500; margin: 0 0 8px; }
.uf-result p { font-size: 14px; color: var(--vp-c-text-2); margin: 0 0 8px; }
.uf-tags { margin-bottom: 8px; }
.uf-tag { display: inline-block; font-size: 12px; padding: 2px 10px; border-radius: 8px; margin-right: 6px; margin-bottom: 4px; }
.tag-green { background: #1a2e22; color: #3ccd93; }
.tag-red { background: #2e1010; color: #f7768e; }
.tag-info { background: #1a2340; color: #7aa2f7; }
.tag-yellow { background: #2e2510; color: #e0a832; }
.uf-steps { margin: 8px 0 0; padding-left: 1.2rem; }
.uf-steps li { font-size: 14px; margin-bottom: 6px; line-height: 1.5; }
.uf-note { font-size: 13px; color: var(--vp-c-text-2); margin-top: 10px; }
.uf-hint-block { margin-top: 10px; padding: 12px 14px; border-radius: 10px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); font-size: 13px; color: var(--vp-c-text-2); line-height: 1.6; }
.uf-hint-block p { margin: 0 0 6px; }
.uf-hint-block ol { margin: 0; padding-left: 1.2rem; }
.uf-hint-block li { margin-bottom: 4px; }
.uf-hint-block code { font-size: 12px; background: var(--vp-c-bg-soft); padding: 1px 5px; border-radius: 4px; }
</style>