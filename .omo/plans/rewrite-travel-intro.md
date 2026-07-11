# Plan: Rewrite Travel Guide Introduction

## Summary

Replace the `.guide-intro` paragraph in `travel.md` to reframe the guide as a reference document of curated tools that direct users to professional trip-planning services, rather than a comprehensive resource to study.

## Step 1: Edit the intro paragraph in travel.md

**File:** `/Users/cameroncenteno/my-docs/travel.md`  
**Target:** Line 9 — the `<p class="guide-intro">` text inside the `<div class="guide-hero">` section.

**Current text:**
```html
<p class="guide-intro">Whether you're planning a weekend getaway or a year-long trip around the world, good tools make all the difference. This guide covers flight and train booking, maps, navigation, destination research, weather, and the best resources for every type of traveler.</p>
```

**Replacement text:**
```html
<p class="guide-intro">This is a reference document of curated trip-planning tools — not a guide to study from cover to cover. Its purpose is to direct you to professional services for booking flights and trains, finding accommodation, navigating cities, and researching destinations. Use it to find the right service for your trip, then plan from there.</p>
```

## Verification

- Read the file and confirm the `.guide-hero` section has the updated text
- Confirm no other parts of the file were accidentally modified
