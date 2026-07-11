---
title: Personal Finance Guide
description: A practical guide to budgeting, saving, getting out of debt, investing, and taxes - using free, private, open-source tools.
---

<script setup>
import { ref, computed } from 'vue'

const loanAmount = ref(250000)
const interestRate = ref(6.5)
const loanTerm = ref(30)

const monthlyPayment = computed(() => {
  const principal = Number(loanAmount.value) || 0
  const months = (Number(loanTerm.value) || 0) * 12
  const monthlyRate = (Number(interestRate.value) || 0) / 100 / 12
  if (principal <= 0 || months <= 0) return 0
  if (monthlyRate === 0) return principal / months
  const factor = Math.pow(1 + monthlyRate, months)
  return (principal * monthlyRate * factor) / (factor - 1)
})

const totalPaid = computed(() => monthlyPayment.value * (Number(loanTerm.value) || 0) * 12)
const totalInterest = computed(() => Math.max(totalPaid.value - (Number(loanAmount.value) || 0), 0))

const usd = (value) => {
  if (!isFinite(value)) return '$0'
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}
</script>

# The Ultimate Personal Finance Guide

<div class="guide-hero">
  <p class="guide-meta"><GuideIcon name="pencil" :size="14" /> Written by <strong>Nero</strong></p>
  <p class="guide-intro">Managing your money doesn't have to be complicated. Learn a clear order of operations, how to budget, save, escape debt, invest, and handle taxes - using free and open-source tools that keep your financial data private and in your control.</p>
</div>

::: warning ⚠️ NOT FINANCIAL ADVICE
This guide is for **educational purposes only**. It is not personalized financial advice. Rules, rates, and account types (401k, IRA, HSA, HYSA APYs, the 50/30/20 split) are **US-centric and change often** - verify current numbers and check your own country's equivalents before acting. **You are responsible for your own financial decisions.**
:::

## Start Here: Order of Operations {#order-of-operations}

Before picking an app, know the *sequence*. Doing things in the right order saves you the most money. The r/personalfinance "Prime Directive" flowchart is the single best free roadmap for what to do with each dollar.

### Step 1: Cover the Essentials

Make rent, food, utilities, and minimum debt payments first. Survival before optimization - never skip a minimum payment to invest.

### Step 2: Build a Starter Emergency Fund

Stash about $1,000 (or one month of expenses) so a flat tire or medical bill doesn't become credit card debt.

### Step 3: Grab the Free Employer Match

If your job matches 401(k) contributions, contribute enough to get the **full match**. It's an instant, guaranteed return - free money you should never leave on the table.

### Step 4: Kill High-Interest Debt

Pay off anything above ~7-8% interest (most credit cards) before investing more. No investment reliably beats the ~20%+ interest a credit card charges you.

### Step 5: Finish the Emergency Fund

Build your safety net up to 3-6 months of expenses, held in a high-yield savings account.

### Step 6: Invest for the Long Term

Max out tax-advantaged accounts (IRA / 401k / HSA), then a taxable brokerage with low-cost index funds.

::: tip Follow the full flowchart
The interactive [r/personalfinance Prime Directive](https://www.reddit.com/r/personalfinance/wiki/commontopics/) wiki walks through this exact sequence and answers almost every "what should I do with this money?" question.
:::

<blockquote class="quiz-callout">
  <strong>Want a personalized financial roadmap?</strong>
  <a href="/financial-health-quiz">Take the Financial Health Quiz &rarr;</a>
</blockquote>

## Budgeting Apps {#budgeting-apps}

Pick one and actually use it - the best app is the one you'll stick with. We lead with **free and open-source** options that keep your data on your device, then list the popular paid apps.

<p class="legend"><span class="legend-dot" style="background:#27ae60;"></span> Free / open-source &nbsp;&nbsp; <span class="legend-dot" style="background:#f39c12;"></span> Paid</p>

<SmartResourceGuide category="finance" />


## Saving Strategies {#saving-strategies}

<div class="card-grid-2">
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>1. Build an Emergency Fund</h4>
    <p>Save 3-6 months of expenses in a high-yield savings account. This is your safety net for job loss or unexpected expenses.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>2. Automate Your Savings</h4>
    <p>Set up automatic transfers on payday. You can't spend what you don't see. Start with 10-20% of your income.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>3. Use the 50/30/20 Rule</h4>
    <p>50% needs, 30% wants, 20% savings/debt. Adjust to your situation, but it's a solid starting framework.</p>
  </div>
  <div class="shared-card" style="border-left: 3px solid #27ae60;">
    <h4>4. Use a High-Yield Savings Account</h4>
    <p>A HYSA (often 3-5% APY) beats a regular bank account (~0.01%). Ally, SoFi, and Marcus are popular options.</p>
  </div>
</div>

::: tip Saving toward a goal?
[GreenStash](https://github.com/Pool-Of-Tears/GreenStash) is a free, open-source Android app that turns each goal into a visual savings jar and tells you how much to set aside to hit your deadline.
:::

## Debt & Credit {#debt-credit}

Debt and a good credit score are the foundation everything else sits on. Tackle this before investing aggressively.

<div class="card-grid-2">
  <div class="shared-card">
    <h4>Avalanche vs. Snowball</h4>
    <p><strong>Avalanche:</strong> pay the highest-interest debt first (saves the most money). <strong>Snowball:</strong> pay the smallest balance first (best for motivation). Both work - pick the one you'll stick with.</p>
  </div>
  <div class="shared-card">
    <h4>Understand Your Credit Score</h4>
    <p>Payment history (35%) and credit utilization (30%) matter most. Pay on time, keep utilization under ~30%, and don't close your oldest card. Check it free via your bank or Credit Karma.</p>
  </div>
  <div class="shared-card">
    <h4>Good Debt vs. Bad Debt</h4>
    <p>Low-interest debt that builds wealth (mortgage, sometimes student loans) is manageable. High-interest consumer debt (credit cards, payday loans, "buy now pay later") should be eliminated fast.</p>
  </div>
  <div class="shared-card">
    <h4>Build Credit Early</h4>
    <p>A secured card or becoming an authorized user builds history with low risk. A longer, clean history means better rates on every future loan.</p>
  </div>
</div>

::: danger Avoid the Minimum-Payment Trap
Paying only the minimum on a credit card can take **decades** and cost more in interest than the original purchase. Always pay the full statement balance if you possibly can.
:::

## Loan & Mortgage Calculator {#loan-calculator}

Thinking about a mortgage, car loan, or student loan? Punch in the numbers to see your monthly payment and how much interest you'll pay over the life of the loan. Everything runs in your browser - nothing is sent anywhere.

<div class="calc">
  <div class="calc-inputs">
    <label class="calc-field">
      <span>Loan amount</span>
      <div class="calc-input"><span class="calc-prefix">$</span><input type="number" v-model.number="loanAmount" min="0" step="1000" /></div>
    </label>
    <label class="calc-field">
      <span>Interest rate (% APR)</span>
      <div class="calc-input"><input type="number" v-model.number="interestRate" min="0" step="0.1" /><span class="calc-suffix">%</span></div>
    </label>
    <label class="calc-field">
      <span>Term (years)</span>
      <div class="calc-input"><input type="number" v-model.number="loanTerm" min="1" step="1" /><span class="calc-suffix">yr</span></div>
    </label>
  </div>
  <div class="calc-results">
    <div class="calc-result calc-result-main">
      <span>Monthly payment</span>
      <strong>{{ usd(monthlyPayment) }}</strong>
    </div>
    <div class="calc-result">
      <span>Total interest</span>
      <strong>{{ usd(totalInterest) }}</strong>
    </div>
    <div class="calc-result">
      <span>Total paid</span>
      <strong>{{ usd(totalPaid) }}</strong>
    </div>
  </div>
</div>

::: tip Pay less interest
Even a small extra payment each month, or a shorter term, can save you tens of thousands in interest. Try lowering the term from 30 to 15 years above and watch the total interest drop.
:::

## Investing Basics {#investing-basics}

<div class="card-grid-2">
  <div class="shared-card">
    <h4>Index Funds / ETFs</h4>
    <p>The simplest and most effective investment. Buy the whole market (VTI, VOO, VT) instead of individual stocks. Low fees, diversified, and historically strong long-term returns.</p>
  </div>
  <div class="shared-card">
    <h4>Retirement Accounts</h4>
    <p>Max out tax-advantaged accounts first: 401(k) (especially with an employer match), IRA (Roth or Traditional), and HSA (triple tax-advantaged if eligible).</p>
  </div>
  <div class="shared-card">
    <h4>Compound Interest</h4>
    <p>Your money grows exponentially over time. Investing consistently for decades - even modest amounts - beats large amounts started late. Start early and stay consistent.</p>
  </div>
  <div class="shared-card">
    <h4>Dollar Cost Averaging</h4>
    <p>Invest a fixed amount regularly regardless of market conditions. Avoids the stress of timing the market. Set and forget.</p>
  </div>
</div>

::: tip See it for yourself
Try the [Investment Calculator](/tools/investment-calculator) to watch how your savings can grow over time with compound interest.
:::

## Tracking Your Portfolio {#tracking-portfolio}

Once you're invested, you'll want one place to see your whole net worth. These keep your holdings off third-party servers.

<div class="card-grid-2">
  <a href="https://ghostfol.io/" target="_blank" rel="noopener noreferrer" class="shared-card">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/ghostfol.io.ico" alt="" loading="lazy" /><h4>Ghostfolio</h4></div>
    <p>Open-source wealth dashboard. Track stocks, ETFs, crypto, and cash in one place. Self-host for free, or use the hosted version. Privacy-friendly and ad-free.</p>
    <div class="platforms"><span>Web</span><span>Self-host</span></div>
  </a>
  <a href="https://www.portfolio-performance.info/en/" target="_blank" rel="noopener noreferrer" class="shared-card">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/portfolio-performance.info.ico" alt="" loading="lazy" /><h4>Portfolio Performance</h4></div>
    <p>Free, open-source desktop app for serious investors. Calculates true performance (TTWROR / IRR), asset allocation, and rebalancing. Powerful and offline.</p>
    <div class="platforms"><span>Win</span><span>Mac</span><span>Linux</span></div>
  </a>
  <a href="https://www.empower.com/" target="_blank" rel="noopener noreferrer" class="shared-card">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/empower.com.ico" alt="" loading="lazy" /><h4>Empower (was Personal Capital)</h4></div>
    <p>Free net-worth tracker and retirement planner that links all your accounts. Cloud-based, so weigh the convenience against sharing data (expect sales calls).</p>
    <div class="platforms"><span>Web</span><span>iOS</span><span>Android</span></div>
  </a>
  <a href="https://github.com/tarkah/tickrs" target="_blank" rel="noopener noreferrer" class="shared-card">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/github.com.ico" alt="" loading="lazy" /><h4>tickrs</h4></div>
    <p>For terminal fans: a real-time stock ticker dashboard that runs in your command line. Free and open-source - a fun, nerdy way to watch the market.</p>
    <div class="platforms"><span>Win</span><span>Mac</span><span>Linux</span><span>CLI</span></div>
  </a>
</div>

::: info Switching brokers into Ghostfolio?
[Export-To-Ghostfolio](https://github.com/dickwolff/Export-To-Ghostfolio) converts transaction exports from Trading 212, DEGIRO, Schwab, IBKR, and many more into an importable format.
:::

## Taxes {#taxes}

Taxes are unavoidable, but you rarely need to pay for software. *(US-focused; check your local tax authority for equivalents.)*

<div class="card-grid-2">
  <a href="https://opentaxsolver.sourceforge.net/" target="_blank" rel="noopener noreferrer" class="shared-card">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/sourceforge.net.ico" alt="" loading="lazy" /><h4>OpenTaxSolver</h4></div>
    <p>Free, open-source program that calculates and auto-fills US federal and state income-tax forms for mailing. No upsells, no data harvesting.</p>
    <div class="platforms"><span>Win</span><span>Mac</span><span>Linux</span></div>
  </a>
  <a href="https://www.irs.gov/filing/irs-free-file-do-your-taxes-for-free" target="_blank" rel="noopener noreferrer" class="shared-card">
    <div class="card-head"><img class="card-fav" src="https://icons.duckduckgo.com/ip3/irs.gov.ico" alt="" loading="lazy" /><h4>IRS Free File & Direct File</h4></div>
    <p>The IRS offers free guided filing (income limits apply) and the newer Direct File program in many states. Check these before paying for TurboTax.</p>
    <div class="platforms"><span>Web</span></div>
  </a>
</div>

::: tip Prevent tax-refund identity theft
Request an [IRS Identity Protection PIN (IP PIN)](https://www.irs.gov/identity-theft-fraud-scams/get-an-identity-protection-pin) - a 6-digit code required on your return so nobody can file with your SSN. There's a quick [2-minute explainer here](https://www.youtube.com/watch?v=iPw8I-cZ1eY).
:::

## Why We Favor Local-First Tools {#local-first}

Most "free" finance apps pay for themselves by selling or mining your transaction data. The open-source tools above (Actual, GnuCash, HomeBank, Paisa, Ghostfolio, Portfolio Performance) keep your data **on your own device or server** - no uploads, no ads, and no surprise data breaches exposing your entire financial life.

::: info Same philosophy as the rest of this site
When you can choose between a slick cloud app and a private local one, the private one is almost always worth the small extra effort. See the [Online Privacy Guide](/privacy) for hardening the rest of your digital life.
:::

## Credits & Resources {#credits}

<div class="sources-grid">

<div class="source-card">
  <div class="source-header">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" class="source-icon"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    <strong>r/personalfinance Wiki</strong>
  </div>
  <p class="source-citation">The Prime Directive flowchart and wiki are the best free financial advice you'll ever get. Start here and follow the steps.</p>
  <a href="https://www.reddit.com/r/personalfinance/wiki/index/" target="_blank" rel="noopener noreferrer" class="source-link">Read the Wiki &rarr;</a>
</div>

<div class="source-card">
  <div class="source-header">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" class="source-icon"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>
    <strong>Bogleheads</strong>
  </div>
  <p class="source-citation">Investment philosophy based on John Bogle's teachings: simple, low-cost, buy-and-hold index fund investing.</p>
  <a href="https://www.bogleheads.org/" target="_blank" rel="noopener noreferrer" class="source-link">Visit Bogleheads &rarr;</a>
</div>

<div class="source-card">
  <div class="source-header">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" class="source-icon"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    <strong>Investopedia</strong>
  </div>
  <p class="source-citation">A free encyclopedia of financial terms and concepts. Look up anything you don't understand, from "APY" to "Roth IRA".</p>
  <a href="https://www.investopedia.com/" target="_blank" rel="noopener noreferrer" class="source-link">Look It Up &rarr;</a>
</div>

<div class="source-card">
  <div class="source-header">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" class="source-icon"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>
    <strong>NerdWallet</strong>
  </div>
  <p class="source-citation">Compare credit cards, bank accounts, loans, and insurance. Good for finding rates (note: they earn affiliate commissions).</p>
  <a href="https://www.nerdwallet.com/" target="_blank" rel="noopener noreferrer" class="source-link">Compare Rates &rarr;</a>
</div>

<div class="source-card">
  <div class="source-header">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" class="source-icon"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/><path d="M9 12l2 2 4-4"/></svg>
    <strong>Quiver Quant</strong>
  </div>
  <p class="source-citation">Curiosity tool: tracks how members of Congress trade stocks and government contracts. Interesting research - don't blindly copy trades.</p>
  <a href="https://www.quiverquant.com/" target="_blank" rel="noopener noreferrer" class="source-link">Explore Data &rarr;</a>
</div>

<div class="source-card">
  <div class="source-header">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" class="source-icon"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/><line x1="14" y1="18" x2="16" y2="18"/></svg>
    <strong>OpenTaxSolver</strong>
  </div>
  <p class="source-citation">Free, open-source software that calculates and auto-fills US federal and state income-tax forms - no upsells or data harvesting.</p>
  <a href="https://opentaxsolver.sourceforge.net/" target="_blank" rel="noopener noreferrer" class="source-link">Download OTS &rarr;</a>
</div>

</div>


## Frequently Asked Questions

<details class="faq-item">
<summary>How much should I save?</summary>

Start with an emergency fund of 3-6 months of expenses before investing. After that, a good student baseline is saving at least 10-20% of any income. If that's not possible yet, save what you can and automate it so it happens before you spend.

</details>

<details class="faq-item">
<summary>Is crypto worth it?</summary>

For most students, treat crypto as high-risk money you can afford to lose entirely — not a savings account. The volatility is enormous and scams are common. Build your emergency fund and basics first; only dabble with money you won't need.

</details>

<details class="faq-item">
<summary>Should I invest while I still have student loans?</summary>

It depends on the loan interest rate. If your loans are low-interest (subsidized/federal ~4-5%), modest investing can make sense alongside minimum payments. If rates are high, paying extra toward debt is often the better return. Never skip your emergency fund to invest.

</details>

<details class="faq-item">
<summary>What's the difference between a checking and savings account?</summary>

Checking is for spending (debit card, bills); savings is for storing money and earning a little interest. Keep them at the same bank so transfers are instant, and park your emergency fund in a high-yield savings account.

</details>

<details class="faq-item">
<summary>How do I start building credit without debt?</summary>

Get a student or secured credit card, use it for small regular purchases, and pay the full balance every month. This builds a positive history without paying interest. Always pay on time — payment history is the biggest factor.

</details>

<details class="faq-item">
<summary>Do I need a budget app?</summary>

Not necessarily. A simple spreadsheet or the envelope method works. Apps help if you tend to overspend mindlessly. The best budget is the one you'll actually check — start with tracking every dollar for one month.

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
  display: block;
  padding: 1.25rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
  transition: transform 0.25s ease, border-color 0.25s ease;
}
.shared-card:hover {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand-1);
}
.shared-card h4 {
  margin: 0;
  font-size: 1rem;
}

/* Card favicon header */
.card-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
}
.card-fav {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  flex-shrink: 0;
  background: var(--vp-c-bg);
  object-fit: contain;
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

/* Loan & mortgage calculator */
.calc {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.5rem 0;
}
.calc-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.calc-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.calc-field > span {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.calc-input {
  display: flex;
  align-items: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  overflow: hidden;
  transition: border-color 0.2s ease;
}
.calc-input:focus-within {
  border-color: var(--vp-c-brand-1);
}
.calc-input input {
  flex: 1;
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  padding: 0.55rem 0.6rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}
.calc-prefix, .calc-suffix {
  padding: 0 0.55rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}
.calc-results {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.calc-result {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.6rem 0.85rem;
  border-radius: 10px;
  background: var(--vp-c-bg);
}
.calc-result span {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--vp-c-text-3);
}
.calc-result strong {
  font-size: 1.05rem;
  color: var(--vp-c-text-1);
}
.calc-result-main {
  background: var(--vp-c-brand-soft);
}
.calc-result-main strong {
  font-size: 1.6rem;
  color: var(--vp-c-brand-1);
}

/* Free vs paid legend */
.legend {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin: 0.25rem 0 0;
}
.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.35rem;
  vertical-align: middle;
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

/* Responsive */
@media (max-width: 768px) {
  .card-grid-3, .sources-grid, .calc {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 640px) {
  .card-grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>

<BackLinks />
