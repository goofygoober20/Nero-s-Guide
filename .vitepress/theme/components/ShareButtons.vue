<template>
  <div class="share-container">
    <div class="share-buttons">
      <button class="share-btn twitter" @click="shareOnTwitter">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Twitter
      </button>
      
      <button class="share-btn reddit" @click="shareOnReddit">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.9 2.394c.799.303 1.523.812 2.125 1.462 2.217-.657 4.334.497 4.347.51.017.017.017.034 0 .051-.013.017-2.13 1.157-4.346.5.6.637 1.313 1.124 2.113 1.424-.216.741-.507 1.416-.886 2.041a6.284 6.284 0 0 1-1.035 1.276c-.879.758-1.914 1.197-3.002 1.276-1.094-.079-2.13-.518-3.009-1.277a6.26 6.26 0 0 1-1.034-1.275c-.38-.625-.671-1.3-.887-2.041.8-.3 1.514-.787 2.114-1.424-2.217.657-4.333-.483-4.346-.5-.017-.017-.017-.034 0-.051.013-.013 2.13-1.167 4.347-.51.603-.65 1.327-1.159 2.126-1.462l-.9-2.394-2.598.547c-.058.172-.17.327-.314.44a1.25 1.25 0 1 1 .936-2.103c.016-.017.033-.034.05-.051l2.597-.547.9-2.394c.184-.485.652-.815 1.18-.815.53 0 .998.33 1.18.815l.9 2.394 2.598.547c.015.017.033.034.05.051.144.113.256.268.313.44.056.172.056.357 0 .529-.057.172-.169.327-.313.44z"/>
        </svg>
        Reddit
      </button>
      
      <button class="share-btn linkedin" @click="shareOnLinkedIn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.222 0 22.225 0z"/>
        </svg>
        LinkedIn
      </button>
      
      <button class="share-btn copy" @click="copyLink">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        Copy Link
      </button>
    </div>
    
    <div v-if="copied" class="copy-toast">
      ✅ Link copied to clipboard!
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const copied = ref(false)

const getCurrentPageUrl = () => {
  return window.location.href
}

const getCurrentPageTitle = () => {
  // Get the page title from the document or fallback
  const title = document.querySelector('h1')?.innerText || document.title || 'Check out this guide'
  return encodeURIComponent(title)
}

const shareOnTwitter = () => {
  const url = getCurrentPageUrl()
  const title = getCurrentPageTitle()
  window.open(`https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
}

const shareOnReddit = () => {
  const url = getCurrentPageUrl()
  const title = getCurrentPageTitle()
  window.open(`https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${title}`, '_blank', 'width=700,height=500')
}

const shareOnLinkedIn = () => {
  const url = getCurrentPageUrl()
  window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
}

const copyLink = async () => {
  const url = getCurrentPageUrl()
  try {
    await navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = url
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>

<style scoped>
.share-container {
  position: relative;
  margin: 2rem 0 1rem;
}

.share-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.share-btn svg {
  flex-shrink: 0;
}

.share-btn:hover {
  transform: translateY(-2px);
}

.share-btn.twitter:hover {
  background: #1DA1F2;
  border-color: #1DA1F2;
  color: white;
}

.share-btn.reddit:hover {
  background: #FF4500;
  border-color: #FF4500;
  color: white;
}

.share-btn.linkedin:hover {
  background: #0077B5;
  border-color: #0077B5;
  color: white;
}

.share-btn.copy:hover {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.copy-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-1);
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  z-index: 1000;
  animation: fadeInOut 2s ease;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
  15% { opacity: 1; transform: translateX(-50%) translateY(0); }
  85% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
}

@media (max-width: 640px) {
  .share-btn {
    padding: 6px 12px;
    font-size: 0.75rem;
  }
  
  .copy-toast {
    white-space: normal;
    text-align: center;
  }
}
</style>