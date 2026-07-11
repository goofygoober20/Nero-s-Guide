#!/usr/bin/env python3
import io

BASE = "/Users/cameroncenteno/my-docs"

def faq(items):
    out = ["", "## Frequently Asked Questions", ""]
    for q, a in items:
        out.append('<details class="faq-item">')
        out.append(f"<summary>{q}</summary>")
        out.append("")
        for line in a.strip("\n").split("\n"):
            out.append(line)
        out.append("")
        out.append("</details>")
        out.append("")
    return "\n".join(out)

FAQS = {}

FAQS["privacy"] = faq([
    ("Is a VPN enough for privacy?",
     "No. A VPN hides your traffic from your ISP and the local network, but it does not stop websites, advertisers, or the VPN provider itself from tracking you. Pair it with a hardened browser, private search engine, and email aliases for real coverage."),
    ("Can my school see my browsing?",
     "If you are on the school Wi-Fi or a school-issued device, yes — they can see and log activity, and often use content filters. A VPN hides the content from the network but may violate school acceptable-use rules, and the school can still see that you connected to a VPN. On your own phone using cellular data, they generally cannot see what you browse."),
    ("Doesn't privacy only matter if you have something to hide?",
     "Privacy is about control, not secrecy. Your data is used to set prices, target ads, shape what you see, and make decisions about you (loans, jobs, insurance). 'Nothing to hide' still means you deserve a say in who builds a profile of your life."),
    ("What's the single most important privacy change I can make?",
     "Use a password manager plus unique emails/aliases so a breach at one site can't cascade into the rest of your accounts. It's the highest-leverage step for most people."),
    ("Is incognito/private mode actually private?",
     "No. It only stops your local browser from saving history and cookies. Your ISP, employer, school, and the websites you visit can still see everything. It is not a privacy tool."),
    ("Are privacy browsers like Brave or Firefox enough on their own?",
     "They help a lot by blocking trackers by default, but they are not complete. Combine them with private search (like DuckDuckGo or Startpage), encrypted DNS, and good account hygiene to cover the gaps."),
])

FAQS["passwords"] = faq([
    ("How many passwords do I actually need to remember?",
     "Ideally just one: the master password for your password manager. Everything else should be a long, random, unique password generated and stored for you."),
    ("Is it safe to use a password manager?",
     "Yes. A reputable, open-source or well-audited password manager is far safer than reusing passwords across sites. Your vault is encrypted with your master password, which the service never sees."),
    ("What if my password manager gets hacked?",
     "Because the vault is encrypted locally with your master password, a breach of the provider mostly exposes useless ciphertext. Use a strong master password and enable 2FA on the manager itself for extra safety."),
    ("How long should my passwords be?",
     "At least 12 characters, but length beats complexity. A 16+ character random passphrase (four unrelated words) is both strong and easier to remember than a short symbol soup."),
    ("Should I change my passwords regularly?",
     "Not on a fixed schedule — that's outdated advice. Change a password only when there's a reason (a breach, a shared account, or suspicion). Focus energy on uniqueness instead of rotation."),
    ("Are passkeys better than passwords?",
     "For sites that support them, yes. Passkeys use your device's biometrics/ PIN and can't be phished or reused, and there's no password to steal. Turn them on wherever offered."),
])

FAQS["finance"] = faq([
    ("How much should I save?",
     "Start with an emergency fund of 3-6 months of expenses before investing. After that, a good student baseline is saving at least 10-20% of any income. If that's not possible yet, save what you can and automate it so it happens before you spend."),
    ("Is crypto worth it?",
     "For most students, treat crypto as high-risk money you can afford to lose entirely — not a savings account. The volatility is enormous and scams are common. Build your emergency fund and basics first; only dabble with money you won't need."),
    ("Should I invest while I still have student loans?",
     "It depends on the loan interest rate. If your loans are low-interest (subsidized/federal ~4-5%), modest investing can make sense alongside minimum payments. If rates are high, paying extra toward debt is often the better return. Never skip your emergency fund to invest."),
    ("What's the difference between a checking and savings account?",
     "Checking is for spending (debit card, bills); savings is for storing money and earning a little interest. Keep them at the same bank so transfers are instant, and park your emergency fund in a high-yield savings account."),
    ("How do I start building credit without debt?",
     "Get a student or secured credit card, use it for small regular purchases, and pay the full balance every month. This builds a positive history without paying interest. Always pay on time — payment history is the biggest factor."),
    ("Do I need a budget app?",
     "Not necessarily. A simple spreadsheet or the envelope method works. Apps help if you tend to overspend mindlessly. The best budget is the one you'll actually check — start with tracking every dollar for one month."),
])

FAQS["fitness"] = faq([
    ("How often should I work out?",
     "For general health, aim for 3-5 sessions a week of 30-60 minutes. Total beginners do fine with 3 full-body sessions and rest days between. Consistency beats intensity — a sustainable routine you keep beats a brutal one you quit."),
    ("Do I need supplements?",
     "Almost never. A balanced diet covers the needs of nearly everyone, especially students. Protein powder is just a convenience, not a requirement. The only widely recommended supplement is vitamin D in winter if you get little sun. Spend on food before powders."),
    ("Do I need a gym membership?",
     "No. Bodyweight training, running, and home workouts build a strong foundation for free. A gym helps once you want heavier progressive overload, but you can get remarkably fit with zero equipment."),
    ("How long until I see results?",
     "Strength and energy improvements show in 2-4 weeks. Visible physique changes usually take 8-12 weeks of consistent training and decent nutrition. Progress is non-linear — trust the trend, not the day-to-day."),
    ("Is cardio or lifting better for losing weight?",
     "Diet drives weight loss; both cardio and lifting help. Lifting preserves muscle (so you lose fat, not lean mass) and raises resting metabolism slightly. A mix of both with a calorie deficit works best."),
    ("Should I work out if I'm sore?",
     "Light movement (walking, easy mobility) helps soreness fade. But skip heavy training on a muscle that's still acutely sore — that's a sign it needs recovery. Sleep and protein do more for growth than an extra session."),
])

FAQS["cooking"] = faq([
    ("Do I need expensive equipment to cook well?",
     "No. A good chef's knife, a cutting board, one pan, and one pot get you surprisingly far. Skill and timing matter far more than gadgets. Buy quality where it counts and ignore the rest."),
    ("What should a beginner always keep in the pantry?",
     "Salt, pepper, cooking oil, rice or pasta, canned beans/tomatoes, eggs, onions, garlic, and a couple of spices. With those you can make dozens of cheap, filling meals."),
    ("How do I know when meat is cooked safely?",
     "Use a cheap instant-read thermometer — chicken to 165°F (74°C), pork/beef steaks 145°F (63°C), ground meat 160°F (71°C). Color is not a reliable indicator. It's the one gadget worth buying for safety."),
    ("What's the easiest way to make food taste better?",
     "Salt properly and taste as you go. A squeeze of acid (lemon, vinegar) and fresh herbs at the end brighten almost any dish. Most home cooking is under-seasoned, not under-skilled."),
    ("Can I meal prep on a budget?",
     "Yes. Cook a big batch of a base (rice, beans, roasted veg) and vary the sauce/seasoning through the week. Buying dry goods in bulk and frozen veg keeps costs low and waste near zero."),
    ("How do I stop burning things?",
     "Lower the heat than you think, don't crowd the pan, and stay in the kitchen. Most burning is distraction, not bad technique. Set a timer for everything."),
])

FAQS["drawing"] = faq([
    ("Do I need expensive art supplies to start?",
     "No. A pencil and printer paper are enough to build fundamentals. Upgrade to nicer paper and a few pens once you're drawing regularly — the tool won't fix the skill."),
    ("I can't even draw a straight line, am I hopeless?",
     "Everyone starts there. Lines get steadier with reps, and most art doesn't need straight lines anyway. Draw daily, badly, and the control comes."),
    ("Should I learn realism or just my own style?",
     "Spend time on fundamentals (shape, proportion, light) early — they make any style work better. Your style emerges naturally; forcing one before you have basics leads to frustration."),
    ("How much should I practice to improve?",
     "A little every day beats a long session once a week. Even 15 minutes of deliberate practice compounds fast. Focus on one weak area at a time (hands, perspective, shading)."),
    ("What's the best thing to draw when starting out?",
     "Draw from life: your room, a mug, your own hand. Photos are fine, but real objects teach you to see. Copy artists you admire to learn, then move to original work."),
    ("Is digital or traditional better for beginners?",
     "Traditional is cheaper to start and teaches fundamentals without software getting in the way. Digital is forgiving (undo, layers) and great later. Try traditional first; switch when you hit its limits."),
])

FAQS["gaming"] = faq([
    ("How do I deal with toxic players?",
     "Mute, block, and move on. Most games have quick-mute (often a key like Tab or a scoreboard option). Don't feed the argument — it only escalates and ruins your session. Report repeat offenders."),
    ("Is gaming a waste of time?",
     "Not by itself. Like any hobby it's fine in moderation and can build problem-solving, coordination, and friendships. It becomes a problem only when it crowds out sleep, school, health, or relationships."),
    ("How do I avoid spending too much money?",
     "Turn off one-click buying, set a monthly entertainment budget, and wait 48 hours before any in-game purchase. Most 'limited' offers aren't actually going anywhere. Free-to-play is designed to wear down your resistance."),
    ("How do I find people to play with?",
     "Discord communities, subreddits for your game, and friend-of-friend invites are the easiest routes. Playing co-op or joining a clan naturally builds a regular group."),
    ("Is it bad to use a guide or walkthrough?",
     "Not at all. Guides are a normal part of gaming and great for stuck spots or optimization. Use them as much as you enjoy — it's your time."),
    ("How do I stop rage quitting?",
     "Take a break the moment you feel tilted — a few minutes away resets your temper. Mute voice chat, lower your stakes, and remember it's a game. Chasing a loss almost always makes it worse."),
])

FAQS["gardening"] = faq([
    ("How much space do I need to start gardening?",
     "Very little. A windowsill, balcony, or a few pots is enough for herbs and salad greens. You don't need a yard to grow food."),
    ("What's the easiest plant to grow for beginners?",
     "Herbs like mint, basil, or chives, and hardy greens like lettuce or spinach. They forgive mistakes and give quick, rewarding results."),
    ("How often should I water?",
     "When the top inch of soil is dry — not on a fixed schedule. Overwatering kills more plants than drought. Stick a finger in the soil; if it's damp, wait."),
    ("Do I need special soil?",
     "For pots, yes — use potting mix, not garden dirt (it compacts and suffocates roots). In the ground, most plants are fine with native soil amended with compost."),
    ("Why are my plants dying?",
     "Usually water (too much or too little), light (wrong amount), or pests. Check soil moisture and where the plant sits before blaming fertilizer. Match the plant to its light conditions first."),
    ("Can I garden if I live in an apartment?",
     "Absolutely. Container gardening, vertical planters, and even a small hydroponic kit work indoors. Many vegetables and herbs thrive on a sunny balcony or bright window."),
])

FAQS["linux"] = faq([
    ("Do I need to know how to code to use Linux?",
     "No. Modern distros like Ubuntu or Linux Mint are usable for browsing, writing, and studying without touching the terminal. You'll learn commands gradually, not upfront."),
    ("Which distro should a beginner pick?",
     "Start with Linux Mint, Ubuntu, or Fedora. They're well-documented, stable, and have large communities — meaning any problem you hit is already answered online."),
    ("Will Linux run the software I already use?",
     "Most web apps work in any browser. Microsoft Office and some commercial apps don't run natively — use web versions or free alternatives (LibreOffice, etc.). Check your must-have apps before switching."),
    ("Is Linux safe from viruses?",
     "Safer by design (permissions, smaller desktop target), but not invincible. Keep it updated, don't run unknown scripts as root, and you'll be fine without third-party antivirus for most use."),
    ("What if I break something?",
     "It's recoverable. Most breakage is fixable from a live USB or by reversing a recent change. Take system snapshots (Timeshift) so you can roll back. Breaking things is also how you learn."),
    ("Can I still game on Linux?",
     "Increasingly yes. Steam's Proton runs a large library of Windows games on Linux. Newer AAA titles with aggressive anti-cheat may not work, so check compatibility for your favorites first."),
])

FAQS["minimalism"] = faq([
    ("Doesn't minimalism mean throwing everything away?",
     "No. It's about keeping what adds value and letting go of what doesn't — not living in an empty room. Your version can include things you genuinely love."),
    ("Isn't minimalism expensive if you have to buy nice things?",
     "The opposite. It usually saves money by curbing impulse buys and buying less, better. You don't need to replace anything; start with what you have."),
    ("How do I start without feeling overwhelmed?",
     "One category at a time — start with a drawer or your inbox. Set a timer for 15 minutes. Progress beats a perfect purge you never finish."),
    ("What if my family or roommates aren't minimalist?",
     "Focus on your own space and belongings; don't police others. Lead by example and keep shared areas negotiated, not controlled."),
    ("Does minimalism mean I can't collect things I love?",
     "You can. Minimalism is about intention, not a specific number of possessions. A curated collection you treasure is the opposite of clutter you ignore."),
    ("How do I deal with sentimental items?",
     "Keep a few that truly matter; photograph the rest. Memories live in you, not the object. A small 'memory box' contains more than a storage unit."),
])

FAQS["productivity"] = faq([
    ("What's the best productivity system?",
     "The one you'll actually use. Start simple: a short to-do list plus a calendar. Add structure (time-blocking, GTD, Pomodoro) only when a specific problem appears."),
    ("How do I stop procrastinating?",
     "Shrink the task until it's too small to fear — open the doc, write one sentence. Action creates momentum; motivation usually follows, not leads."),
    ("Should I use a to-do list or a calendar?",
     "Both, for different things. Calendars hold time-bound commitments; to-do lists hold tasks. Put only the day's top 3 on the list so it stays actionable."),
    ("How do I focus with so many distractions?",
     "Remove them physically: phone in another room, one tab open, notifications off. Attention is a muscle — protect it like you would a deadline."),
    ("Is multitasking real?",
     "Not for thinking work. The brain switches between tasks and loses time each switch. Batch similar work and do one thing at a time for deep tasks."),
    ("What do I do when I'm burned out?",
     "Rest without guilt — burnout isn't fixed by pushing harder. Sleep, move, and cut optional commitments for a few days. Recovery is productive, not lazy."),
])

FAQS["shopping"] = faq([
    ("How do I know if I'm getting a good deal?",
     "Compare the unit price (per liter/gram) across sizes and stores, and check the item's typical price over time with a price-tracker. A 'sale' is only a deal if it's lower than the normal price you'd pay."),
    ("Is it better to buy new or used?",
     "Used wins for depreciating things (phones, textbooks, furniture, cars) where condition is checkable. Buy new for items where hygiene, warranty, or safety matter (mattresses, some electronics)."),
    ("How do I avoid impulse buys?",
     "Add it to a cart and wait 24-48 hours. Most urges pass. Unsubscribe from store emails and mute ads; the temptation you don't see, you won't buy."),
    ("When is the best time to buy [electronics/clothes]?",
     "Electronics: Black Friday/Cyber Monday and back-to-school season. Clothes: end-of-season clearances. Student laptop deals peak in late summer. Buy off-season for the biggest discounts."),
    ("Are extended warranties worth it?",
     "Usually no — they're high-margin for the store and often overlap manufacturer coverage. Put the warranty money into savings instead; self-insure the few things that matter."),
    ("How do I find coupon codes that actually work?",
     "Use a reputable browser extension (or student discount portals) rather than sketchy 'coupon' sites full of expired codes. Your school email often unlocks better discounts than any code."),
])

FAQS["shopping-resources"] = faq([
    ("Are price comparison sites accurate?",
     "Mostly, but they can be biased toward sites that pay for placement. Cross-check two comparison tools and the retailer directly before assuming a 'best price' is real."),
    ("Are coupon aggregator sites safe?",
     "The big, established ones are generally safe to browse, but avoid ones that push aggressive pop-ups or ask for account sign-ups. Never enter payment info on a coupon site itself."),
    ("How do I find student discounts?",
     "Use your .edu email on UNiDAYS, Student Beans, and retailer student portals. Many services (Spotify, Notion, GitHub, Amazon Prime) have steep student rates most students miss."),
    ("Is cashback real or a scam?",
     "Real, but modest. Cashback portals pay a commission share for sending them shoppers. Use well-known ones, clear cookies between searches, and treat it as a small bonus, not a strategy."),
    ("Where do I find free stuff as a student?",
     "Campus free shelves, Buy Nothing groups, library lendable gear, and free software via your school. Textbook exchanges and course reserves save hundreds per term."),
    ("How do I avoid fake review sites?",
     "Stick to established retailers and known aggregators. Be wary of sites with only glowing 5-star reviews, no dates, or that pressure you to buy immediately."),
])

FAQS["travel"] = faq([
    ("How do I travel cheaply as a student?",
     "Use student fares, travel in the off-season, stay in hostels or with locals, and book transport early. A student ID (ISIC) unlocks discounts on trains, museums, and sights worldwide."),
    ("Is travel insurance worth it?",
     "Usually yes for international trips — a single medical or cancellation event costs far more than the premium. Check if your card or school already covers you before buying."),
    ("How do I stay safe abroad?",
     "Register with your country's travel advisory service, keep digital copies of documents, share your itinerary with someone, and learn a few local phrases. Blend in and trust your instincts."),
    ("Do I need a passport years in advance?",
     "Get it at least 6 months before any trip — processing can be slow and some countries require 6 months' validity beyond your stay. Renew early; don't cut it close."),
    ("How do I avoid getting sick while traveling?",
     "Drink bottled or filtered water where unsafe, wash hands often, get recommended vaccines, and ease into new foods. Travel insurance that covers illness is your backup."),
    ("What's the best way to find cheap flights?",
     "Search in private/incognito mode, compare across a few aggregators, and be flexible on dates and nearby airports. Set price alerts and book 1-3 months out for the best balance."),
])

FAQS["writing-and-note-taking"] = faq([
    ("What's the best note-taking method?",
     "There's no single best — Cornell, outline, and mind-maps each fit different subjects. Try one for two weeks, then switch if it's not clicking. The method you use beats the 'perfect' one you abandon."),
    ("Should I take notes by hand or on a laptop?",
     "Handwriting aids memory for lectures; laptops are faster for capturing detail and searching later. Use handwriting for understanding, typing for volume — or a tablet that does both."),
    ("How do I take notes without writing everything down?",
     "Capture concepts and your own questions, not transcripts. Use abbreviations, skip what's already on the slides, and rephrase in your words — that's what makes it stick."),
    ("What app should I use?",
     "Start with whatever syncs across your devices (Notion, Obsidian, Apple Notes, OneNote). Features matter less than that you'll open it daily. Don't over-build the system."),
    ("How do I organize my notes?",
     "One note per topic, tagged by course and term. Review weekly so notes stay connected. A simple folder-per-class structure beats an elaborate taxonomy you forget."),
    ("How do I actually use my notes to study?",
     "Rewrite or summarize them from memory, then test yourself with flashcards or practice questions. Active recall from your own notes beats re-reading by a wide margin."),
])

FAQS["all-nighter"] = faq([
    ("Is pulling an all-nighter ever a good idea?",
     "Rarely. Sleep debt wrecks memory consolidation, so you'll likely perform worse the next day. It's a last resort, not a study strategy. Plan ahead to avoid needing one."),
    ("How do I survive an all-nighter if I have to?",
     "Front-load the hardest work early in the night when you're sharpest, take short breaks, use bright light, and nap 20 minutes if you crash. Hydrate and keep snacks light."),
    ("What should I eat and drink to stay awake?",
     "Water, light protein, and small snacks — not a sugar binge that crashes you. Caffeine is fine in moderation but avoid it in the last 4-6 hours or the next sleep is ruined."),
    ("How do I recover the next day?",
     "Sleep as soon as you can — even a 90-minute cycle helps. Hydrate, eat normally, and don't pile on more caffeine. Get a full night the following night to reset."),
    ("Is caffeine safe to keep me up?",
     "In moderation, yes, but it's not free. Too much causes jitters and a hard crash, and late caffeine sabotages recovery sleep. Treat it as a carefully rationed tool."),
    ("How do I avoid needing all-nighters in the first place?",
     "Break work into daily chunks starting earlier, use a calendar with real deadlines, and start assignments the day they're given. Future-you will be far more capable after sleep."),
])

FAQS["chess"] = faq([
    ("How do I get better at chess fast?",
     "Solve tactical puzzles daily and review your lost games to find the move you missed. Tactics and pattern recognition beat memorizing theory for rapid improvement."),
    ("What openings should a beginner learn?",
     "Just one or two solid, principled openings (like the Italian or a simple e4/d4 system). Learn ideas, not long memorized lines — understanding beats rote at this stage."),
    ("How important is memorizing endgames?",
     "Basic endgames (king+pawn, rook vs pawn) are worth learning because they win games. You don't need deep theory — a handful of fundamentals carries most games."),
    ("Should I play blitz or longer games?",
     "Longer games (10+ minutes) teach real calculation; blitz is for practice and fun. If you want to improve, favor slower games and analyze them afterward."),
    ("How do I stop blundering pieces?",
     "Before every move, look for what your opponent could capture. A 2-second 'blunder check' eliminates most hangs. Puzzles train exactly this habit."),
    ("Is Chess.com or Lichess better?",
     "Both are excellent and free to start. Lichess is fully free with no ads; Chess.com has polished lessons behind a subscription. Try both — the playing strength gain comes from you, not the site."),
])

FAQS["darkweb"] = faq([
    ("Is it illegal to access the dark web?",
     "Accessing it (e.g., via Tor) is legal in most countries. What's illegal is the activity — buying drugs, weapons, or stolen data. Simply browsing is not a crime."),
    ("Do I need Tor to access it?",
     "The dark web's hidden services (.onion) require Tor or a similar onion-capable browser. Standard browsers can't reach them, and you shouldn't try to force them to."),
    ("Is the dark web dangerous?",
     "It can be — scams, malware, and illegal marketplaces are common, and law enforcement monitors some spaces. Stick to legitimate uses (privacy, whistleblowing, onion versions of normal sites) and never transact."),
    ("Can I get viruses from the dark web?",
     "Risk is higher than the normal web. Don't download files, keep Tor updated, and avoid suspicious links. Treat every download as potentially hostile."),
    ("Why would a normal person use it?",
     "For privacy and censorship resistance: journalists, activists, and people in restrictive regimes use it to communicate safely. Many mainstream sites (e.g., the New York Times, BBC) offer onion versions."),
    ("How do I stay safe if I browse it?",
     "Use the official Tor Browser with default settings, never enable scripts on untrusted sites, don't reveal personal info, and keep it isolated from your real identity. When in doubt, don't click."),
])

def insert(path, block):
    with io.open(path, encoding="utf-8") as f:
        lines = f.read().split("\n")
    # find earliest existing marker
    cand = []
    for i, ln in enumerate(lines):
        s = ln.strip()
        if s == "<BackLinks />" or s == "<style scoped>":
            cand.append(i)
    idx = min(cand) if cand else len(lines)
    # ensure blank line before block
    if idx > 0 and lines[idx-1].strip() != "":
        lines.insert(idx, "")
        idx += 1
    block_lines = block.split("\n")
    # remove trailing newline duplication
    if block_lines and block_lines[-1] == "":
        block_lines = block_lines[:-1]
    for j, bl in enumerate(block_lines):
        lines.insert(idx + j, bl)
    # ensure a blank line after the inserted block (before the marker) handled by block ending
    with io.open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

for name, block in FAQS.items():
    p = f"{BASE}/{name}.md"
    insert(p, block)
    print(f"inserted FAQ into {name}.md ({block.count(chr(10))} lines)")
