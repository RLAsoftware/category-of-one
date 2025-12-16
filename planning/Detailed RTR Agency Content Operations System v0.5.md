# **RTR Agency Content Operations System**

## **Claude Code Multi-Client Writing System for Social Media Distribution**

---

# **🚨 EXECUTIVE SUMMARY: YOUR CURRENT SITUATION**

## **The Crisis (What's Happening Right Now)**

**Week 4-5 Reality Check:**

* 4 clients, 50% unhappy with voice/tone fidelity. 5 more clients onboarding soon.  
* 45 bots to manage (5 per client × 9\)  
* One person (Charl) manually QA'ing everything  
* 3-5 day turnaround when clients expect excellence  
* 3,600 lines in a single MD file that's inefficient  
* Onboarding captures business basics only \- missing the critical information you need  
* Clients can't articulate their Category of One after a month  
* Newsletter → Carousel/Story/Reel adaptations are consistently difficult  
* Team can't work interchangeably on clients  
* **You cannot scale to 50 clients with this system**

## **The Math That Should Terrify You**

**Current trajectory:**

* 9 clients \= 45 bots  
* 20 clients \= 100 bots  
* 50 clients \= 250 bots  
* **At 15-20 clients, your current system collapses completely**

**But here's what's actually killing you:** Not having client context means:

* Every piece requires multiple revisions  
* Each revision \= 48 hours of client time  
* 50% unhappy \= 50% churn risk  
* Can't delegate because only Charl knows the quirks  
* Production bottleneck prevents new client acquisition

## **The Opportunity (Why You're Actually in a Good Position)**

**You're only 4-5 weeks in.** This is PERFECT timing to:

* Rebuild the foundation before it's catastrophic  
* Retrofit current clients while implementing proper onboarding for new ones  
* Fix the 50% unhappy clients by showing them you're taking action  
* Build a system that scales to 100+ clients, not just 50  
* Transform from "we're struggling" to "we're the most sophisticated content multiplication agency in the market"

---

# **THE ROOT CAUSE ANALYSIS**

## **Why Your Current System Fails**

### **❌ Problem 1: Onboarding Captures Zero Strategic Information**

**What you ask:**

* Business basics  
* Social media links  
* Website

**What you actually need:**

* Their unique market positioning (Category of One)  
* Their voice DNA (tonality, sentence structure, vocabulary)  
* Their audience's psychographics and pain points  
* Their content boundaries (what they NEVER say)  
* Their expertise frameworks and methodologies  
* Examples of their best work  
* Their communication pet peeves

**The gap:** You're trying to replicate their voice without knowing what their voice is.

### **❌ Problem 2: Relying on Newsletter Alone for Voice**

**Why this fails:**

* Newsletter is ONE format in ONE mood on ONE topic  
* Doesn't show range across emotional tones  
* Doesn't reveal their casual vs. professional voice  
* Missing their controversial takes, humor style, storytelling patterns  
* Can't extract positioning from a single weekly piece

**Reality:** You need 5-10 diverse writing samples \+ explicit voice documentation

### **❌ Problem 3: Bot Chaos**

**Current:** 5 bots × 9 clients \= 45 separate systems

* Each bot is a single point of failure  
* Updates require touching 45 different places  
* No consistency across bots  
* One person understands the system  
* Knowledge locked in one 3,600 line file

**What happens at scale:** Unsustainable, un-delegatable, unmaintainable

### **❌ Problem 4: Long-form → Short-form Is Hardest**

**Why:**

* Newsletter \= 1,500 words of nuanced thought  
* Carousel \= 10 slides of distilled insight  
* Story \= 15 seconds of punchy value  
* Reel script \= 30 seconds of engaging narrative

**Without the right framework:** You're guessing at what to keep and losing the client's voice in compression

---

# **THE SOLUTION: RTR AGENCY CLAUDE CODE SYSTEM**

## **System Architecture Overview**

Instead of 45 bots, you build **ONE master system** with:

```
rtr-writing-system/
├── claude.md (Master system instructions for ALL RTR operations)
├── skills/ (UNIVERSAL - used across ALL clients)
│   ├── platforms/
│   │   ├── substack-skill.md
│   │   ├── medium-skill.md
│   │   ├── blog-post-skill.md
│   │   ├── linkedin-post-skill.md
│   │   ├── linkedin-carousel-skill.md
│   │   ├── instagram-post-skill.md
│   │   ├── instagram-carousel-skill.md
│   │   ├── instagram-story-skill.md
│   │   ├── facebook-post-skill.md
│   │   ├── youtube-script-skill.md
│   │   ├── shorts-reel-script-skill.md
│   │   ├── podcast-description-skill.md
│   │   └── [one skill per content type × platform = ~25 skills total]
│   └── operations/
│       ├── newsletter-intake-skill.md
│       ├── voice-analysis-skill.md
│       ├── quality-checklist-skill.md
│       └── client-onboarding-skill.md
├── clients/
│   ├── [client-1-name]/
│   │   ├── context/
│   │   │   ├── business-profile.md
│   │   │   ├── category-of-one.md
│   │   │   ├── voice-dna.md
│   │   │   ├── audience-profile.md
│   │   │   ├── content-guidelines.md
│   │   │   └── service-tier.md (Tier 3, platforms included)
│   │   ├── source-newsletters/
│   │   │   ├── 2024-12-07-newsletter.md
│   │   │   ├── 2024-11-30-newsletter.md
│   │   │   └── [historical newsletters]
│   │   └── outputs/
│   │       └── batch-2024-12-14/
│   │           ├── substack.md
│   │           ├── medium.md
│   │           ├── blog-post.md
│   │           ├── linkedin-post.md
│   │           ├── linkedin-carousel.md
│   │           ├── instagram-post.md
│   │           ├── instagram-carousel.md
│   │           ├── instagram-story.md
│   │           └── [etc - all 37 platform outputs]
│   ├── [client-2-name]/
│   └── [etc - one folder per client]
└── templates/
    ├── onboarding-questionnaire.md
    ├── new-client-checklist.md
    └── weekly-production-workflow.md
```

## **How This Transforms Your Operation**

### **✅ Before: 45 bots, each unique**

### **✅ After: 1 system, infinite clients**

**Adding Client \#10:**

1. Create `/clients/client-10-name/` folder  
2. Fill context profiles from onboarding  
3. Add their newsletters to `source-newsletters/`  
4. Run production → all 37 outputs in client's voice  
5. **Time: 15 minutes setup, then production as usual**

**Adding Client \#50:** Exactly the same process. The system doesn't care if you have 5 or 500 clients.

### **Team Transformation**

**Before:**

* Only Charl can QA  
* Knowledge trapped in one person's head  
* Can't redistribute work when someone's out

**After:**

* Any team member opens `/clients/acme-corp/` folder  
* Claude loads their context automatically  
* Produces content in ACME's voice  
* QA against checklist in `/skills/operations/quality-checklist-skill.md`  
* Charl reviews final output, not line-editing everything

### **Quality Transformation**

**Before:**

* Guessing at voice from limited info  
* 50% unhappy clients  
* Multiple revision rounds

**After:**

* Complete context captured in onboarding  
* Voice DNA documented with examples  
* First-draft accuracy dramatically improved  
* **Goal: 90%+ clients approve without revisions**

---

# **PART 1: THE ONBOARDING REVOLUTION**

## **The Strategic Onboarding Questionnaire**

**Purpose:** Extract everything you need without the client realizing they're doing the heavy lifting.

**Delivery:** Google Form or Typeform that feeds directly into their context profiles

**Time for client:** 45-60 minutes one time **Value to you:** Permanent foundation for perfect content

### **Section 1: Business & Positioning (15 min)**

**The "Sneaky" Questions That Extract Category of One:**

1. **"Complete this sentence: I help \[WHO\] achieve \[WHAT\] by \[HOW\]"**

   * Example: "I help burned-out tech executives build 7-figure consulting businesses by teaching them my Leverage Framework"  
   * *What this captures: Audience \+ Outcome \+ Unique Methodology*  
2. **"What's the \#1 thing people say about you that makes you different from everyone else in your space?"**

   * *Captures: Unique differentiation*  
3. **"If someone Googled '\[your topic\]' and found 100 experts, why should they choose YOU specifically?"**

   * *Captures: Competitive positioning*  
4. **"What do you teach/believe that others in your industry would disagree with?"**

   * *Captures: Contrarian positioning, edge*  
5. **"Finish this: My clients come to me when they're frustrated with \_\_\_\_\_\_\_\_ and want \_\_\_\_\_\_\_\_ instead."**

   * *Captures: Pain point \+ desired outcome*  
6. **"What's your 'secret sauce' \- the framework, process, or method you're known for?"**

   * *Captures: Unique methodology*  
7. **"What's the transformation your clients experience? Before working with you they're \_\_\_\_\_\_\_\_, after they're \_\_\_\_\_\_\_\_."**

   * *Captures: Transformation arc, Category of One impact*  
8. **Business Basics:**

   * Industry/niche  
   * Main product/service  
   * Website/social links  
   * Years in business  
   * Key achievements/credentials

### **Section 2: Audience Deep Dive (10 min)**

**Beyond Demographics:**

9. **"Describe your ideal client like you're describing a specific person you know. Name them, give them a backstory."**

   * *Captures: Real psychographic understanding*  
10. **"What keeps your audience up at 3am? What are they worried about?"**

    * *Captures: Deep pain points*  
11. **"What do they complain about in Facebook groups, on Twitter, to their friends?"**

    * *Captures: Language they actually use*  
12. **"What have they already tried that hasn't worked?"**

    * *Captures: Context for positioning*  
13. **"When they achieve their goal with you, how does their life actually change? Be specific."**

    * *Captures: Outcome-focused messaging*  
14. **"What do they value most: Speed? Quality? Simplicity? Status? Security?"**

    * *Captures: Motivational drivers*

### **Section 3: Voice & Style DNA (15 min)**

**The Questions That Capture Voice:**

15. **"Rate yourself on these scales (1-5):**

    * Formal ←→ Casual  
    * Professional ←→ Personal  
    * Serious ←→ Humorous  
    * Data-driven ←→ Story-driven  
    * Teacher ←→ Peer  
    * Polished ←→ Raw/Real"  
16. **"Which 3-5 writers, creators, or brands do you want to sound LIKE?"**

    * *Provides reference points*  
17. **"Which 3-5 writers, creators, or brands do you NEVER want to sound like?"**

    * *Identifies boundaries*  
18. **"Do you swear in your content? If yes, how much and in what contexts?"**

19. **"Do you use emojis? If yes, which ones and how often?"**

20. **"How do you address your audience?"**

    * "You/your" (direct)  
    * "We/us" (inclusive)  
    * "They/them" (observational)  
    * Mix?  
21. **"Sentence length preference:"**

    * Short and punchy  
    * Varied and dynamic  
    * Long and exploratory  
22. **"Do you use:"**

    * Metaphors/analogies? (Examples?)  
    * Pop culture references? (Examples?)  
    * Industry jargon? (Examples?)  
    * Specific catchphrases? (List them)  
23. **"What words/phrases do you use a LOT?"**

    * *Client lists their signature vocabulary*  
24. **"What words/phrases do you NEVER use? (even if common in your industry)"**

    * *Critical boundaries*

### **Section 4: Content Samples (10 min)**

**File Uploads Required:**

25. **"Upload your 5 best pieces of content (articles, posts, emails, videos scripts)"**

    * Must be diverse (not all the same format/topic)  
    * Should show range (serious, humorous, technical, personal, etc.)  
26. **"Upload your worst piece \- something that got good results but doesn't sound like you"**

    * *Shows what NOT to do*  
27. **"Upload a piece of content you WISH you wrote (can be from someone else)"**

    * *Aspiration benchmark*

### **Section 5: Content Guidelines & Boundaries (5 min)**

28. **"Topics you ALWAYS talk about:"**

29. **"Topics you NEVER talk about:"**

30. **"Political/controversial stance (if any):"**

    * Stay neutral  
    * Lean into it  
    * Specific issues you address  
31. **"Calls to action you use:"**

    * Subscribe  
    * Book a call  
    * Buy product  
    * Join community  
    * Other?  
32. **"Any other guidelines we should know?"**

    * Religious considerations  
    * Brand partnerships to mention/avoid  
    * Specific formatting preferences

### **Section 6: Newsletter Context (5 min)**

33. **"How long have you been writing this newsletter?"**

34. **"What's the typical structure/format?"**

35. **"What day/time do you send your newsletter?"**

36. **"What's your open rate/engagement been like?"**

37. **"What topics get the best response from your audience?"**

38. **"Any topics that have flopped?"**

---

## **Converting Questionnaire to Context Profiles**

**After client completes questionnaire, RTR team does this ONCE:**

### **Step 1: Create Client Folder**

```
/clients/[client-name]/context/
```

### **Step 2: Generate Context Profiles**

Use the onboarding skill to transform questionnaire answers into structured profiles:

#### **A. business-profile.md**

```
# Business Profile: [Client Name]

## Core Business
- Industry: [from Q8]
- Main Offering: [from Q1, Q8]
- Website: [from Q8]
- Years in Business: [from Q8]
- Key Credentials: [from Q8]

## Market Position
[Synthesize from Q1-Q8]

## Products/Services
[List with brief descriptions]

## Social Presence
- LinkedIn: [link]
- Instagram: [link]
- Twitter/X: [link]
- YouTube: [link]
- [etc]
```

#### **B. category-of-one.md**

```
# Category of One: [Client Name]

## Primary Positioning Statement
[From Q1 - exact quote]

## Unique Differentiation
[From Q2, Q3, Q6]

## Contrarian Position
[From Q4]
What [Client] believes: [their stance]
What most in industry believe: [mainstream stance]

## The Gap They Fill
Clients come to [Name] when they're frustrated with: [from Q5]
They want: [from Q5]

## Unique Methodology/Framework
[From Q6 - their "secret sauce"]

## Transformation Delivered
Before: [from Q7]
After: [from Q7]

## Competitive Landscape
When someone Googles [topic], why choose [Client]?
[From Q3]
```

#### **C. audience-profile.md**

```
# Audience Profile: [Client Name]

## The Avatar
[From Q9 - the specific person description]

## Demographics
- [Standard info]

## Psychographics
What keeps them up at 3am: [from Q10]
What they complain about: [from Q11]
What they've already tried: [from Q12]

## Desired Transformation
[From Q13 - specific life change]

## Core Values
Primary motivator: [from Q14]
- Speed/Quality/Simplicity/Status/Security

## Language They Use
[Pull actual phrases from Q10, Q11]

## Pain Points (Prioritized)
1. [Most urgent from Q10-Q12]
2.
3.

## Desired Outcomes
[From Q5, Q13]
```

#### **D. voice-dna.md**

```
# Voice DNA: [Client Name]

## Tone Profile (1-5 scale)
- Formal ←→ Casual: [rating from Q15]
- Professional ←→ Personal: [rating]
- Serious ←→ Humorous: [rating]
- Data-driven ←→ Story-driven: [rating]
- Teacher ←→ Peer: [rating]
- Polished ←→ Raw/Real: [rating]

## Voice Influences
**Sound LIKE these:**
[From Q16 - list with brief why]

**NEVER sound like these:**
[From Q17 - list with brief why]

## Language Patterns

### Profanity
[From Q18]

### Emojis
[From Q19 - usage patterns]

### Audience Address
[From Q20 - you/we/they preference]

### Sentence Structure
[From Q21 - length preference]

### Style Elements
Uses metaphors/analogies: [Y/N + examples from Q22]
Pop culture references: [Y/N + examples from Q22]
Industry jargon: [Y/N + examples from Q22]

## Signature Vocabulary
**Words/phrases used frequently:**
[From Q23 - exact list]

**Words/phrases NEVER used:**
[From Q24 - exact list with reasons if given]

## Content Reference Samples
### Best Examples (Sound Like This)
[Link to files from Q25]

### Anti-Examples (Don't Sound Like This)
[Link to file from Q26]

### Aspiration Benchmark
[Link to file from Q27]
```

#### **E. content-guidelines.md**

```
# Content Guidelines: [Client Name]

## Topics

### Always Include
[From Q28]

### Never Include
[From Q29]

## Stance on Controversy
[From Q30]

## Calls to Action
Primary CTA: [from Q31]
Secondary CTA: [from Q31]
Context for CTAs: [when to use which]

## Brand Partnerships
Mention: [if any]
Avoid: [if any]

## Other Guidelines
[From Q32 - any special considerations]

## Newsletter Context
- Publishing since: [from Q33]
- Typical structure: [from Q34]
- Send day/time: [from Q35]
- Engagement level: [from Q36]
- Best-performing topics: [from Q37]
- Topics to avoid: [from Q38]
```

#### **F. service-tier.md**

```
# Service Tier: [Client Name]

## Current Tier
Tier [1/2/3]

## Included Platforms
[List based on tier from your service mix]

### Tier 3 (Standard):
- Substack
- Medium
- Blog
- LinkedIn Post
- LinkedIn Carousel
- Instagram Post
- Instagram Carousel
- Instagram Story
- Facebook Post
- Facebook IG
- Manychat
- YouTube Video Script
- Shorts/Reels Script
- Podcast Description
- Blog (PC - Post to Blog)

## Cadence
Weekly (every [day])
[or Bi-weekly/Monthly if applicable]

## Special Requests
[Any custom needs]
```

---

# **PART 2: BUILDING THE UNIVERSAL SKILLS LIBRARY**

## **Philosophy: Write Once, Use for All Clients**

Each skill is a TEMPLATE that works for ANY client. The client's specific voice comes from their context profiles, not from the skill itself.

**Skills are modular, reusable, and client-agnostic.**

---

## **Core Platform Skills Structure**

### **Example: Instagram Carousel Skill**

**File: `/skills/platforms/instagram-carousel-skill.md`**

```
# Instagram Carousel Skill

## Purpose
Transform long-form newsletter content into engaging Instagram carousel posts while maintaining the client's voice, tone, and message fidelity.

## Context Requirements
Before invoking this skill, ensure you have loaded:
- Client's voice-dna.md
- Client's audience-profile.md
- Client's category-of-one.md
- Client's content-guidelines.md
- Source newsletter content

## Carousel Structure

### Slide Count
7-10 slides optimal (including cover and CTA)

### Cover Slide (Slide 1)
**Purpose:** Stop the scroll, promise value

**Elements:**
- Hook headline (5-8 words max)
- Subheadline expanding on the promise (8-12 words)
- Minimal design, maximum readability
- Client's brand colors/style (reference service-tier.md for design notes)

**Hook Formula Options:**
1. Bold Statement: "Everything you know about [topic] is wrong"
2. Promise: "7 ways to [achieve desired outcome]"
3. Question: "Why do 90% of [audience] fail at [goal]?"
4. Story: "How I [transformation] in [timeframe]"

Choose based on newsletter's primary angle.

### Content Slides (Slides 2-8)

**Each slide:**
- One core idea only
- 15-25 words maximum
- Headline + 1-2 supporting sentences
- Use client's signature vocabulary (from voice-dna.md)
- Match client's tone profile

**Content Extraction from Newsletter:**
1. Identify the 5-7 key insights from newsletter
2. For each insight:
   - Extract the core claim
   - Find the supporting evidence/example
   - Rewrite in client's voice at 20 words or less

**Formatting:**
- Break long sentences into short punchy ones
- Use client's preferred style (from voice-dna.md):
  - Bullet points? (only if client uses them)
  - Numbered lists? (if appropriate)
  - Em-dashes? (if that's their style)

### Final Slide (CTA)

**Purpose:** Drive action

**Elements:**
- Recap the value delivered
- Clear call to action (from content-guidelines.md)
- "Follow for more [category]" 
- Tag client's other platforms if appropriate

**CTA Options (use client's preferred from content-guidelines.md):**
- "Read the full newsletter [link]"
- "Subscribe for deep dives like this"
- "Book a call if you're ready to [outcome]"
- "Join [number] others in [community]"

## Voice Fidelity Checklist

Before finalizing, verify:
- [ ] Tone matches client's scale ratings (formal/casual, etc.)
- [ ] Uses client's signature words/phrases
- [ ] Avoids client's never-use words
- [ ] Matches client's sentence length preference
- [ ] Includes client's style elements (metaphors, analogies, etc.)
- [ ] Addresses audience in client's preferred way (you/we/they)
- [ ] Reflects client's teaching style (teacher vs peer)
- [ ] Maintains client's profanity/emoji guidelines
- [ ] Stays within client's topic boundaries
- [ ] Incorporates client's Category of One positioning naturally

## Caption Writing

**Length:** 150-300 characters (Instagram's optimal engagement range)

**Structure:**
1. Hook (first line - must work as standalone since it's above "...more")
2. Context (2-3 sentences expanding on carousel value)
3. CTA (from content-guidelines.md)
4. Hashtags (5-10 relevant, mix of broad + niche)

**Hook Formula:**
- Start with newsletter's core insight compressed to one sentence
- Use client's voice (reference voice-dna.md)
- Make them want to swipe

**Example Caption Template:**
```

\[Hook \- the core insight in client's voice, \<15 words\]

\[Context \- why this matters to the audience, 2-3 sentences\]

\[Transition \- "Swipe to learn:" or client's preferred phrase\]

\[CTA \- from content-guidelines.md\]

\[Hashtags \- 5-10\]

```

## Hashtag Strategy

**Mix:**
- 2-3 broad industry tags (500k+ posts)
- 3-4 medium tags (50k-500k posts)
- 2-3 niche tags (<50k posts)

**Source hashtags from:**
- Client's category-of-one.md
- Newsletter topic keywords
- Audience pain points

## Design Notes for Team

*To be handed off to Lisa Marie Design:*

**Slide Layout:**
- Brand colors: [from client context if available, or RTR standard]
- Font hierarchy: Large headline, smaller body
- Whitespace: Critical for readability
- Consistency: All slides match visual style

**Cover Slide:**
- Eye-catching, bold headline
- Client's logo/branding (if applicable)
- High contrast for feed visibility

**Content Slides:**
- Clean, minimal
- One idea per slide (no clutter)
- Highlight key words/phrases

**CTA Slide:**
- Warm, inviting design
- CTA stands out
- Easy to read at glance

## Common Pitfalls to Avoid

❌ **Don't:**
- Cram multiple ideas onto one slide
- Use generic "social media speak" that doesn't match client voice
- Forget to reference Category of One in the content
- Make slides text-heavy (>30 words)
- Use hashtags client wouldn't use
- Sound like a different person than the newsletter

✅ **Do:**
- Extract only the BEST insights from newsletter (quality over quantity)
- Maintain the newsletter's core message and meaning
- Use client's exact phrasing when it's powerful
- Make each slide valuable on its own
- Keep the audience's transformation in mind
- Sound like the client wrote it themselves

## Output Format

Deliver as:
```

## **Instagram Carousel: \[Newsletter Title Adapted\]**

### **Slide 1 (Cover)**

\[Headline\] \[Subheadline\]

### **Slide 2**

\[Content\]

### **Slide 3**

\[Content\]

\[etc.\]

### **Slide \[Final\]**

\[CTA content\]

---

### **Caption**

\[Full caption with hashtags\]

---

### **Design Notes**

\[Any specific guidance for Lisa Marie based on this carousel\]

```

## Quality Check Before Delivery

- [ ] Carousel tells a complete story
- [ ] Each slide builds on the last
- [ ] Cover slide stops the scroll
- [ ] Voice sounds authentically like client
- [ ] Core message from newsletter preserved
- [ ] CTA is clear and matches client's goals
- [ ] Caption hook works above fold
- [ ] Hashtags are strategic, not generic
- [ ] Design notes provided for team
- [ ] No more than 10 slides total
```

---

## **Additional Platform Skills (Template Structure)**

Create similar comprehensive skills for each platform. Key examples:

### **1\. substack-skill.md**

* Reformatting newsletter for Substack native posting  
* Headline optimization  
* Intro hook  
* Formatting for Substack's reader experience

### **2\. linkedin-post-skill.md**

* 1,300 character limit  
* Professional but personal tone  
* Hook for algorithm  
* Engagement-driving questions

### **3\. linkedin-carousel-skill.md**

* PDF format specific requirements  
* Professional design standards  
* B2B voice considerations

### **4\. instagram-story-skill.md**

* 15-second segments  
* Text overlay requirements  
* Swipe-up (or link sticker) strategy  
* Story sequence planning (3-7 slides)

### **5\. shorts-reel-script-skill.md**

* 30-60 second scripts  
* Hook in first 3 seconds  
* Visual direction notes  
* On-screen text suggestions  
* CTA integration

### **6\. youtube-script-skill.md**

* Long-form video structure  
* Intro/body/outro framework  
* Retention tactics  
* Thumbnail/title recommendations

### **7\. blog-post-skill.md**

* SEO optimization  
* Formatting for web reading  
* Internal linking strategy  
* Meta description

### **8\. newsletter-to-email-sequence-skill.md (for Manychat)**

* Breaking newsletter into 3-5 email sequence  
* Subject line variations  
* Preview text optimization

---

# **PART 3: OPERATIONS SKILLS**

## **Critical Skills for Team Workflow**

### **1\. newsletter-intake-skill.md**

**Purpose:** Standardize how team processes incoming newsletters

```
# Newsletter Intake Skill

## When Client Sends Newsletter

### Step 1: Receive & Document
- Client emails newsletter
- Save email to `/clients/[client-name]/source-newsletters/`
- Name file: `YYYY-MM-DD-newsletter.md`

### Step 2: Convert to Markdown
Since clients send as Google Doc with images:

1. Copy full text from Google Doc
2. Paste into markdown file
3. Note image placements: `[IMAGE: Description/context]`
4. Preserve formatting (headers, lists, emphasis)

**Template:**
```

# **\[Newsletter Title\]**

**Date:** \[YYYY-MM-DD\] **Client:** \[Name\]

\[IMAGE: Hero image \- description\]

\[Newsletter content...\]

---

**Original source:** \[Link to Google Doc\]

```

### Step 3: Initial Analysis
Before creating content, identify:
- **Primary topic:** [What's this about?]
- **Core insight:** [Main takeaway in one sentence]
- **Key supporting points:** [3-5 bullets]
- **Tone:** [Serious? Humorous? Motivational? Educational?]
- **CTA:** [What action does newsletter drive?]

### Step 4: Create Production Batch
- Make folder: `/clients/[client-name]/outputs/batch-YYYY-MM-DD/`
- This is where all 37 platform pieces will be saved

### Step 5: Load Client Context
Confirm you have access to:
- [ ] business-profile.md
- [ ] category-of-one.md
- [ ] voice-dna.md
- [ ] audience-profile.md
- [ ] content-guidelines.md
- [ ] service-tier.md (to know which platforms to create)

### Step 6: Begin Production
- Start with easiest adaptations (Substack, Medium, Blog)
- Move to social (LinkedIn, Instagram, Facebook)
- Finish with complex (Carousels, Stories, Reels)

## Checklist
- [ ] Newsletter saved in proper location
- [ ] Markdown conversion complete
- [ ] Images noted
- [ ] Initial analysis done
- [ ] Production batch folder created
- [ ] Client context loaded
- [ ] Ready for platform creation
```

### **2\. voice-analysis-skill.md**

**Purpose:** For new clients or voice-drift issues

```
# Voice Analysis Skill

## When to Use
- New client onboarding (analyzing their sample content)
- Quarterly voice check (are we drifting?)
- Client flags voice concerns

## Analysis Process

### Step 1: Gather Samples
Collect 5-10 pieces of client's writing:
- Mix of formats (newsletter, social, long-form, short-form)
- Range of topics
- Different emotional tones

### Step 2: Analyze Patterns

**Tone Mapping:**
Rate each piece (1-5):
- Formal ←→ Casual
- Professional ←→ Personal
- Serious ←→ Humorous
- Data-driven ←→ Story-driven
- Teacher ←→ Peer
- Polished ←→ Raw

Find averages and range.

**Language Patterns:**
- Sentence length (count words in 10 random sentences, average)
- Paragraph length (count sentences in 10 paragraphs, average)
- Vocabulary level (complex vs simple words ratio)

**Signature Elements:**
- Words/phrases used repeatedly (flag 10+)
- Metaphors/analogies (list types)
- Story patterns (personal? hypothetical? case study?)
- Humor style (sarcasm? wit? wordplay? situational?)
- Opening hooks (question? story? bold claim? data?)
- Closing CTAs (direct? soft? question-based?)

**Structure Preferences:**
- Headers/subheaders usage
- Lists (bulleted vs numbered vs none)
- Emphasis (bold, italics, CAPS, "quotes")

### Step 3: Document in voice-dna.md

Create or update the profile with findings.

### Step 4: Test Output

Generate one piece of content using the profile.

**Compare to original:**
- Would client's audience know the difference?
- Does it "feel" like the client?
- Any mismatches?

### Step 5: Refine

Adjust profile based on test results.
```

### **3\. quality-checklist-skill.md**

**Purpose:** Ensure every piece meets RTR standards before client sees it

```
# Quality Checklist Skill

## Pre-Delivery QA Process

### Voice Fidelity Check
- [ ] Tone matches client's profile ratings
- [ ] Uses client's signature words/phrases
- [ ] Avoids client's banned words
- [ ] Sentence length matches client preference
- [ ] Paragraph structure aligns with client style
- [ ] Story/metaphor/analogy usage consistent
- [ ] Humor level appropriate (if client uses humor)
- [ ] Profanity/emoji usage correct
- [ ] Audience addressed in client's way (you/we/they)

### Content Accuracy
- [ ] Core message from newsletter preserved
- [ ] Facts/data accurate (no hallucinations)
- [ ] Examples make sense for client's audience
- [ ] Category of One positioning woven in
- [ ] No contradictions with client's known beliefs
- [ ] Topic within client's guidelines (not in "never discuss" list)

### Platform Compliance
- [ ] Length appropriate for platform (character limits, etc.)
- [ ] Format follows platform best practices
- [ ] Hashtags strategic (not generic)
- [ ] CTA matches client's goals
- [ ] Image notes provided (if applicable)
- [ ] Timing/posting guidance included

### RTR Standards
- [ ] No typos or grammatical errors
- [ ] Formatting clean and consistent
- [ ] Links included where needed
- [ ] On-brand for client
- [ ] Delivers value to audience
- [ ] Would we be proud to show this to prospect clients?

### Final Question
**"If this was posted without the client's name attached, would their audience know it was them?"**

If NO → revise
If YES → approve

## Red Flags That Mean "DO NOT SEND"

🚨 Content sounds generic (could be anyone in the industry)
🚨 Voice doesn't match client samples
🚨 Contains client's "never use" words/phrases
🚨 Misses the core point of the newsletter
🚨 Category of One not reflected
🚨 Audience would be confused
🚨 CTA doesn't align with client's business goals
🚨 Platform requirements not met
🚨 Typos or errors present
🚨 You wouldn't publish this under RTR's name

If ANY red flags → back to production

## Sign-Off
QA performed by: [Name]
Date: [YYYY-MM-DD]
Client: [Name]
Batch: [YYYY-MM-DD]
Status: ✅ Approved for delivery / ❌ Needs revision
```

---

# **PART 4: THE WEEKLY PRODUCTION WORKFLOW**

## **Standard Operating Procedure**

### **Monday (or Newsletter Receipt Day)**

**When client sends newsletter:**

1. **Charl** receives newsletter via email

2. Uses **newsletter-intake-skill.md** to process:

   * Save to `/clients/[client-name]/source-newsletters/YYYY-MM-DD-newsletter.md`  
   * Convert Google Doc to markdown  
   * Note images  
   * Initial analysis (topic, core insight, tone)  
   * Create output batch folder  
3. **Assign production** to available team member

   * Derek? Lisa Marie? Heba? Depending on workload  
   * Any team member can do this now (not just Charl)

### **Tuesday-Wednesday: Production**

**Team member opens:**

* Cursor → `/rtr-writing-system/clients/[client-name]/` folder  
* Claude auto-loads all client context

**Production sequence:**

#### **Phase 1: Long-Form Platforms (30-45 min)**

Use skills:

* `substack-skill.md`  
* `medium-skill.md`  
* `blog-post-skill.md`

**Process:**

```
Prompt: "Using the newsletter from 2024-12-14, create a Substack post"

Claude:
- Reads newsletter
- Loads client's voice-dna.md, audience-profile.md, etc.
- Invokes substack-skill.md
- Generates post
- Saves to /outputs/batch-2024-12-14/substack.md
```

Repeat for Medium, Blog.

#### **Phase 2: Social Posts (45-60 min)**

Use skills:

* `linkedin-post-skill.md`  
* `instagram-post-skill.md`  
* `facebook-post-skill.md`

Generate all standard posts.

#### **Phase 3: Carousels (60 min)**

Use skills:

* `linkedin-carousel-skill.md`  
* `instagram-carousel-skill.md`

**This is where magic happens:**

* Claude compresses 1,500-word newsletter into 7-10 slides  
* Maintains voice fidelity  
* Preserves core message  
* Provides design notes for Lisa Marie

#### **Phase 4: Stories & Reels (45 min)**

Use skills:

* `instagram-story-skill.md`  
* `shorts-reel-script-skill.md`

**Complex compression:**

* Newsletter → 15-second story sequence  
* Newsletter → 30-60 second reel script  
* Includes visual direction, on-screen text notes

#### **Phase 5: Video & Audio (30 min)**

Use skills:

* `youtube-script-skill.md`  
* `podcast-description-skill.md`

**Total production time:** 4-5 hours (down from current 2-3 days)

### **Wednesday-Thursday: QA**

**Charl reviews all outputs** using `quality-checklist-skill.md`

* Spot-checks voice fidelity  
* Verifies core message preserved  
* Confirms platform compliance  
* Ensures RTR quality standards met

**If issues found:**

* Note specific problems  
* Send back to producer  
* Quick revision (10-15 min)

**If approved:**

* Package for client delivery

### **Thursday: Client Delivery**

**Send to client for approval:**

* Organized batch folder  
* All 37 pieces  
* Clear labeling (platform, format)  
* Design notes for Lisa Marie if applicable

**Client has 48 hours to review.**

### **Friday-Saturday: Client Review Window**

**Two outcomes:**

1. **Client approves** → proceed to posting  
2. **Client requests revisions** → note feedback, revise (should be minimal with new system)

### **Weekend/Monday: Posting**

**Heba** posts approved content:

* Substack, Medium, Blog  
* Schedules social posts  
* Coordinates with Derek for technical  
* Coordinates with AN Other for video

---

# **PART 5: EMERGENCY RETROFIT PLAN**

## **Fixing Your Current 9 Clients in 2 Weeks**

You can't leave 50% of clients unhappy. Here's how to fix it fast:

### **Week 1: Client 1-4 (Highest Priority)**

**Goal:** Get the 2 unhappy clients plus 2 others properly profiled

#### **Day 1-2 (Per Client):**

**Step 1: Send Questionnaire** Email template:

```
Subject: Helping Us Nail Your Voice - 45 Min Investment

Hi [Client],

We're committed to making RTR's content sound EXACTLY like you. 

To do that, I need 45 minutes of your time to complete a strategic questionnaire that will transform our output quality.

This is a one-time thing that will make every future piece we create more aligned with your voice and goals.

[Link to questionnaire]

Thanks,
Richard / Charl
```

**Step 2: Process Responses**

* Convert questionnaire → context profiles  
* Add to `/clients/[client-name]/context/` folder  
* Gather their existing newsletters → add to `source-newsletters/`

**Step 3: Test New System**

* Take their MOST RECENT newsletter  
* Run it through new system  
* Generate 5 pieces (LinkedIn post, Instagram carousel, Substack, Story, Reel)

**Step 4: Show Them Results**

```
Subject: Before vs. After - See the Difference

Hi [Client],

Quick update: We've rebuilt our production system around YOUR specific voice.

Here's your most recent newsletter transformed with the new system:
[Attach 5 samples]

We think you'll notice the difference immediately. 

Let us know what you think - this is what every future batch will look like.

Thanks,
Richard
```

**This accomplishes:**

* Shows unhappy clients you're taking action  
* Proves the new system works  
* Buys goodwill while you retrofit others

### **Week 2: Clients 5-9**

**Same process, but now you have momentum:**

* Refined questionnaire (based on first 4 clients' feedback)  
* Faster profile creation (you've done it 4 times)  
* Proven results to share

**By end of Week 2:**

* All 9 clients properly profiled  
* Unhappy clients seeing improvement  
* New system validated with real production

---

# **PART 6: ONBOARDING NEW CLIENTS (Client \#10+)**

## **The Perfect Onboarding Flow**

**Now that system is built, every new client:**

### **Pre-Sale**

* During sales call, mention: "Part of our process includes a strategic onboarding to capture your unique voice"  
* Set expectation: 45-60 min time investment from them

### **Post-Sale (Week 1\)**

**Day 1: Welcome & Questionnaire**

```
Subject: Welcome to RTR! Here's Your Onboarding Questionnaire

Hi [Client],

Welcome to RTR Agency! We're excited to multiply your content across 37 platforms while keeping your authentic voice.

To ensure we nail your voice from day 1, please complete this strategic questionnaire:
[Link]

Time required: 45-60 minutes
Best approach: Block time, pour coffee, and be thorough

The more detail you provide, the better we'll sound like you.

Due: [3 days from now]

Thanks,
Richard
```

**Day 2-3: Client completes questionnaire**

**Day 4: RTR processes responses**

* Tylene or Charl converts → context profiles  
* Creates `/clients/[client-name]/` folder structure  
* Adds profiles to system  
* **Total time: 1-2 hours**

**Day 5-7: First newsletter arrives**

* Run through new system  
* Generate all pieces  
* QA via quality-checklist-skill.md  
* Deliver to client

**Client's first batch:**

* Perfect voice fidelity from day 1  
* Zero "this doesn't sound like me" revisions  
* Client becomes advocate, not skeptic

---

# **PART 7: SCALING TO 50+ CLIENTS**

## **Why This System Scales Infinitely**

**The Math:**

**Current system:**

* 9 clients \= 45 bots \= barely manageable  
* 20 clients \= 100 bots \= catastrophic failure point

**New system:**

* 9 clients \= 1 system \+ 9 folders \= easy  
* 20 clients \= 1 system \+ 20 folders \= still easy  
* 50 clients \= 1 system \+ 50 folders \= no problem  
* 100 clients \= 1 system \+ 100 folders \= automated excellence

**Why:**

* Adding client \= creating one folder (15 min)  
* All skills are universal  
* All workflows are identical  
* Every team member can work on any client  
* Quality is consistent across all clients

## **Team Scaling Plan**

**At 10 clients:**

* Current team handles it easily  
* Charl still QA's but faster  
* Production time per client drops to 3-4 hours

**At 20 clients:**

* Hire 1 more production person  
* Train them in 2 days (vs. 2 weeks with old system)  
* They can immediately work on any client

**At 50 clients:**

* Team of 8-10  
  * 4-5 production  
  * 2 QA  
  * 1 design (Lisa Marie \+ help)  
  * 1 tech (Derek \+ help)  
  * 1 video (AN Other \+ help)  
* Charl manages workflow, spot-checks quality  
* Richard focuses on sales, strategy

**Why this works:**

* Any team member can be productive on day 1  
* No "learning curve" per client  
* Knowledge isn't trapped in individual people  
* System maintains quality automatically

---

# **PART 8: ADVANCED FEATURES**

## **As You Mature the System**

### **1\. Client-Specific Agents**

For high-volume clients, create autonomous agents:

**Example: Newsletter Processing Agent**

```
/clients/acme-corp/agents/newsletter-agent.md

Purpose: Automatically generate all 37 platform pieces when new newsletter arrives

Process:
1. Detect new newsletter in source-newsletters/
2. Run intake analysis
3. Create batch folder
4. Generate all pieces using skills
5. Run QA checklist
6. Flag for Charl review
7. Package for client delivery

Automation level: 90% (human review for final 10%)
```

### **2\. Voice Drift Monitoring**

Quarterly (every 3 months):

**Run voice-analysis-skill.md on:**

* Client's own recent content (their newer newsletters)  
* RTR's output for that client

**Compare:**

* Are we still matching their voice?  
* Has their voice evolved?  
* Do we need to update their profile?

**Update profiles** to reflect any evolution.

### **3\. Platform Expansion**

As new platforms emerge:

**Add new skill:**

* Create `/skills/platforms/new-platform-skill.md`  
* Document platform requirements  
* Immediately available for ALL clients

**No per-client work required.**

### **4\. Industry-Specific Skill Libraries**

As you acquire multiple clients in same industry:

**Create industry add-ons:**

* `/skills/industries/real-estate-skill.md`  
* `/skills/industries/coaching-skill.md`  
* `/skills/industries/saas-skill.md`

**Contains:**

* Industry-specific vocabulary  
* Common frameworks in that niche  
* Audience considerations  
* Compliance/regulatory notes

**Reusable across all clients in that industry.**

### **5\. Performance Tracking**

Add to each client's folder:

**`/clients/[name]/analytics/performance-log.md`**

Track:

* Which content types get best engagement  
* Which topics resonate most  
* Client satisfaction scores  
* Revision requests (goal: trend toward zero)

**Use data to refine:**

* Skills (if certain formats consistently underperform)  
* Client profiles (if certain approaches work better)  
* Questionnaire (add questions that would have prevented issues)

---

# **PART 9: MEASURING SUCCESS**

## **KPIs to Track**

### **Client Satisfaction**

* **Target:** 95%+ happy (up from current 50%)  
* **Measure:** Post-batch feedback score (1-5)  
* **Timeline:** Achieve by end of Month 2 with new system

### **Revision Rate**

* **Target:** \<10% of batches require revisions (down from current 50%+)  
* **Measure:** Track revision requests per batch  
* **Timeline:** Achieve by end of Month 3

### **Production Time**

* **Target:** 3-4 hours per client per week (down from distributed 3-5 days)  
* **Measure:** Time from newsletter receipt to client delivery  
* **Timeline:** Achieve immediately with new system

### **Team Efficiency**

* **Target:** Any team member can work on any client  
* **Measure:** How many people can QA a client's work (currently 1, target 3+)  
* **Timeline:** Achieve by Month 2

### **Scale Readiness**

* **Target:** System handles 50 clients without quality degradation  
* **Measure:** Quality scores remain 4.5+ as clients increase  
* **Timeline:** Proven by Month 6

### **Onboarding Quality**

* **Target:** 90%+ of new clients approve first batch without revisions  
* **Measure:** First batch approval rate  
* **Timeline:** Achieve from Client \#10 onward

---

# **PART 10: IMPLEMENTATION TIMELINE**

## **2-Week Sprint to Launch**

### **Week 1: Build Foundation**

**Monday:**

* Install Cursor  
* Install Claude Code extension  
* Create `/rtr-writing-system/` folder structure  
* Create `claude.md` master file

**Tuesday:**

* Build first 5 platform skills (start with most-used):  
  * LinkedIn Post  
  * Instagram Carousel  
  * Substack  
  * Stories  
  * Reels

**Wednesday:**

* Build operations skills:  
  * Newsletter intake  
  * Quality checklist  
  * Voice analysis

**Thursday:**

* Finalize onboarding questionnaire  
* Create Typeform/Google Form  
* Test questionnaire with one current client

**Friday:**

* Create first client folder (test client)  
* Generate context profiles from their responses  
* Run test production batch  
* QA and refine

### **Week 2: Retrofit & Launch**

**Monday-Tuesday:**

* Send questionnaire to 4 priority clients (including 2 unhappy)  
* Begin processing responses as they come in  
* Create their client folders

**Wednesday-Thursday:**

* Complete context profiles for all 4  
* Run test batches  
* Show results to clients  
* Gather feedback

**Friday:**

* Send questionnaire to remaining 5 clients  
* Refine questionnaire based on first 4  
* Begin processing responses

### **Week 3: Full Rollout**

**Monday-Friday:**

* Complete all 9 client folders  
* Run production through new system  
* Train full team on new workflow  
* Document lessons learned  
* Create training materials

### **Week 4+: Business as Usual**

**New workflow:**

* All clients in new system  
* Team trained and confident  
* Quality improved dramatically  
* Ready to onboard Client \#10

---

# **PART 11: TRAINING YOUR TEAM**

## **Team Training Guide**

### **Session 1: System Overview (1 hour)**

**Attendees:** All team members

**Cover:**

* Why we're changing systems  
* The old vs. new architecture  
* How client folders work  
* How universal skills work  
* Q\&A

### **Session 2: Onboarding Process (30 min)**

**Attendees:** Tylene, Charl (client-facing)

**Cover:**

* Sending questionnaire  
* Processing responses  
* Creating context profiles  
* Quality checking profiles

### **Session 3: Production Workflow (1.5 hours)**

**Attendees:** Charl, Derek, Heba, AN Other, Lisa Marie

**Cover:**

* Opening client folder in Cursor  
* Using newsletter-intake-skill  
* Invoking platform skills  
* Saving outputs properly  
* **Hands-on practice:** Each person produces 2-3 pieces for test client

### **Session 4: QA Process (45 min)**

**Attendees:** Charl \+ backup QA person

**Cover:**

* Quality checklist walkthrough  
* Voice fidelity verification  
* Red flags to watch for  
* When to send back for revision  
* **Practice:** QA 5 pieces together, discuss

### **Session 5: Platform-Specific Deep Dives (2 hours, optional)**

**For specialists:**

* Lisa Marie: Carousel/Story design integration  
* Derek: Technical platform posting  
* Heba: Substack/Medium/Blog nuances  
* AN Other: Video script → production workflow

### **Training Materials to Create**

1. **System Quickstart Guide** (1-page)

   * How to open client folder  
   * How to invoke a skill  
   * Where to save outputs  
   * Who to ask for help  
2. **Skill Library Reference** (1-page)

   * List of all skills  
   * When to use each  
   * Examples  
3. **Client Folder Structure Guide** (1-page)

   * What each file contains  
   * Where to find what you need  
   * How to update profiles  
4. **Troubleshooting Guide** (1-page)

   * Common issues  
   * How to fix them  
   * Who to escalate to

---

# **PART 12: THE FINANCIAL IMPACT**

## **Cost-Benefit Analysis**

### **Current System Costs**

**Time waste:**

* 50% revision rate \= 50% of work done twice  
* 3-5 days per client \= delayed revenue recognition  
* Charl as single point of failure \= bottleneck limiting growth  
* 45 bots \= unmaintainable complexity

**Client churn risk:**

* 50% unhappy \= potential 50% churn  
* 9 clients × $X/month × 50% \= significant revenue at risk

**Scaling impossibility:**

* Cannot take on new clients until current ones are happy  
* Cannot delegate production effectively  
* Cannot grow team without exponential training time

### **New System Benefits**

**Time savings:**

* 50% → 10% revision rate \= 40% time recovered  
* 3-5 days → same day turnaround \= 400% speed improvement  
* Charl freed from being bottleneck \= can manage 3x more clients

**Quality improvement:**

* 50% unhappy → 95% happy \= retention secured  
* First-batch approval rate increases \= faster cash flow  
* Client referrals increase (happy clients refer)

**Scaling enabled:**

* Can onboard Client \#10-50 without system breaking  
* Team can grow without knowledge silos  
* Production time per client remains constant

**Revenue impact:**

* Current capacity: \~12-15 clients max  
* New capacity: 50+ clients with same team  
* Revenue potential: 3-4x current with marginal cost increase

### **Investment Required**

**Time:**

* Week 1: 20 hours (Richard \+ Charl) building system  
* Week 2: 15 hours retrofitting current clients  
* Week 3: 10 hours training team  
* **Total: 45 hours one-time**

**Ongoing:**

* New client onboarding: 1-2 hours vs. current 0 (but fixing massive downstream issues)  
* Maintenance: Minimal (skills refined as needed)

**ROI Timeline:**

* Month 1: System built, current clients stabilized  
* Month 2: First new clients onboard seamlessly  
* Month 3: Proof of scale (15-20 clients)  
* Month 6: Target of 30-40 clients achievable  
* Month 12: 50+ client capacity proven

---

# **APPENDIX A: COMPLETE FILE TEMPLATES**

## **Template 1: claude.md (Master System Instructions)**

```
# RTR Agency Content Operations System

## System Purpose
You are the AI co-writing engine for RTR Agency, a social media distribution company that takes clients' newsletters and creates content for 37 different platforms while maintaining perfect voice fidelity.

## Core Mission
Transform long-form newsletter content into platform-specific pieces that:
1. Sound authentically like the client (not generic AI)
2. Preserve the core message and meaning
3. Target the client's specific audience
4. Reflect the client's Category of One positioning
5. Meet each platform's best practices

## Operational Rules

### Voice Fidelity is Sacred
- Every piece must pass the "would their audience know it's them?" test
- Client's voice profile is law - never deviate
- When in doubt, reference client's sample content
- Err on the side of sounding TOO much like them vs. too generic

### Context Loading
When working with a client:
1. Load their `/context/` folder completely:
   - business-profile.md
   - category-of-one.md
   - voice-dna.md
   - audience-profile.md
   - content-guidelines.md
   - service-tier.md
2. Reference their source newsletters
3. Check for any client-specific notes

### Skill Invocation
- Skills are in `/skills/` folder
- Platform skills in `/skills/platforms/`
- Operations skills in `/skills/operations/`
- Invoke appropriate skill for each content type
- Follow skill instructions precisely

### Quality Standards
Before delivering any content:
- Run through quality-checklist-skill.md
- Verify voice matches client's profile
- Confirm message preserved from newsletter
- Check platform compliance
- Ensure RTR quality standards met

### File Organization
- Source newsletters: `/clients/[name]/source-newsletters/`
- Outputs: `/clients/[name]/outputs/batch-YYYY-MM-DD/`
- Always use proper naming conventions
- Keep folders organized

## RTR Brand Voice (when speaking AS RTR)
- Professional but approachable
- Confident in our expertise
- Focused on client success
- No jargon or buzzwords
- Clear and direct communication

## Red Lines (Never Cross)
- Never publish content that doesn't match client voice
- Never ignore client's "never use" words/topics
- Never miss core message from newsletter
- Never sacrifice quality for speed
- Never guess at client context - ask if unsure

## Continuous Improvement
- Note patterns in client feedback
- Suggest profile updates when voice evolves
- Flag skills that need refinement
- Help RTR team optimize processes

## Remember
You're not just creating content - you're protecting and amplifying each client's unique voice across the internet. That's sacred work.
```

## **Template 2: Sample Client Context Profile Bundle**

**business-profile.md:**

```
# Business Profile: [Client Name]

## Core Business
- Name: [Full business name]
- Industry: [Specific niche]
- Main Offering: [Product/service in one sentence]
- Website: [URL]
- Founded: [Year]
- Team Size: [If relevant]

## Market Position
[Their unique position in the market - from Category of One]

## Products/Services
1. [Primary offering] - [Brief description]
2. [Secondary offering] - [Brief description]
3. [Additional] - [Brief description]

## Target Market
[Who they serve - high level]

## Key Achievements
- [Credential/achievement 1]
- [Credential/achievement 2]
- [Credential/achievement 3]

## Social Presence
- LinkedIn: [URL]
- Instagram: [URL]
- Twitter/X: [URL]
- YouTube: [URL]
- Substack: [URL]
- [Others as applicable]

## Contact
- Email: [For reference]
- Assistant: [If applicable]

## RTR Notes
- Client since: [Date]
- Service tier: [1/2/3]
- Newsletter day: [Day of week]
- Special requests: [Any custom needs]
```

**category-of-one.md:**

```
# Category of One: [Client Name]

## Primary Positioning Statement
"I help [WHO] achieve [WHAT] by [HOW]"

## The Unique Angle
[What makes them different from everyone else in their space]

## Contrarian Position
**What [Client] believes:**
[Their stance]

**What most in industry believe:**
[Mainstream stance]

**Why this matters:**
[Their reasoning]

## The Gap They Fill
**Clients come to [Name] when they're frustrated with:**
[Pain point they uniquely address]

**They want:**
[Outcome they uniquely deliver]

## Unique Methodology/Framework
**Name:** [Their framework name, if applicable]
**Description:** [How it works]
**Key components:**
1. [Step/component 1]
2. [Step/component 2]
3. [Step/component 3]

## Transformation Delivered
**Before:** [Client's starting state]
**After:** [Client's end state]

## Competitive Landscape
When someone searches for [topic/solution], why choose [Client]?
[Their unique value proposition]

## Positioning in Content
How Category of One should appear in content:
- [Explicit mentions vs. implicit weaving]
- [Key phrases to include]
- [How to reference their framework]

## Evolution Notes
[Track how their positioning evolves over time]
```

**voice-dna.md:**

```
# Voice DNA: [Client Name]

## Tone Profile (1-5 scale, where 1 is left, 5 is right)

- Formal ←→ Casual: [X/5]
- Professional ←→ Personal: [X/5]
- Serious ←→ Humorous: [X/5]
- Data-driven ←→ Story-driven: [X/5]
- Teacher ←→ Peer: [X/5]
- Polished ←→ Raw/Real: [X/5]

## Voice Influences

**Sound LIKE these creators/brands:**
1. [Name] - [Why: what quality to emulate]
2. [Name] - [Why]
3. [Name] - [Why]

**NEVER sound like these:**
1. [Name] - [Why: what to avoid]
2. [Name] - [Why]
3. [Name] - [Why]

## Language Patterns

### Profanity
[Never / Rarely / Occasionally / Frequently]
[Context: when appropriate, which words, etc.]

### Emojis
[Never / Sparingly / Moderately / Frequently]
[Which ones: list most-used]
[Context: when to use]

### Audience Address
[How they refer to audience]
- "You/your" (direct): [Y/N - when?]
- "We/us" (inclusive): [Y/N - when?]
- "They/them" (observational): [Y/N - when?]

### Sentence Structure
**Average length:** [X words]
**Range:** [Short sentences for emphasis, long for complexity, etc.]
**Preference:** [Short and punchy / Varied / Long and exploratory]

**Examples from their writing:**
- Short: "[Quote]"
- Medium: "[Quote]"
- Long: "[Quote]"

### Paragraph Structure
**Average length:** [X sentences]
**Pattern:** [Single sentence paragraphs for impact? Dense paragraphs? Varies?]

## Style Elements

### Metaphors & Analogies
**Usage:** [Frequent / Occasional / Rare]
**Types they use:**
- [Example: "business is like gardening"]
- [Example: sports metaphors]
- [Example: tech analogies]

### Pop Culture References
**Usage:** [Y/N]
**Eras/types:** [80s movies, current memes, classic literature, etc.]
**Examples:** [List specific references they've made]

### Industry Jargon
**Usage:** [Heavy / Moderate / Light / None]
**Terms they use:** [List]
**Terms they avoid:** [List]

### Storytelling Patterns
**Primary style:** [Personal anecdotes / Client case studies / Hypothetical scenarios / Research-based]
**Story structure:** [How they typically frame stories]
**Examples:** [Link to 2-3 strong story examples from their work]

## Signature Vocabulary

### Words/Phrases Used Frequently
[List 15-20 that are very characteristic]
- "[Word/phrase]"
- "[Word/phrase]"
- [etc.]

### Words/Phrases NEVER Used
[Critical - things they actively avoid]
- "[Word/phrase]" - [Why avoided]
- "[Word/phrase]" - [Why avoided]
- [etc.]

### Catchphrases
[Any signature sayings]
- "[Catchphrase]"
- "[Catchphrase]"

## Opening & Closing Patterns

### How They Start Content
**Newsletter:** [Typical opening - question? story? bold claim?]
**Social:** [Different opening style?]
**Long-form:** [Different again?]

**Examples:**
- "[Quote of typical opening]"
- "[Another example]"

### How They Close Content
**CTAs:** [Style of call-to-action]
**Sign-offs:** [How they typically end]

**Examples:**
- "[Quote of typical closing]"
- "[Another example]"

## Formatting Preferences

### Headers/Subheaders
**Usage:** [Frequent / Moderate / Rare]
**Style:** [Title case / Sentence case / All caps / etc.]
**Example:** [Their typical header style]

### Lists
**Preference:** [Bulleted / Numbered / Prose (no lists) / Mix]
**When used:** [For what types of content]

### Emphasis
**Bold:** [Usage pattern]
**Italics:** [Usage pattern]
**CAPS:** [Usage pattern]
**"Quotes":** [Usage pattern]
**Other:** [Any unique emphasis techniques]

## Voice Evolution Notes
[Track changes over time]
- [Date]: [Shift noticed, profile updated accordingly]

## Content Reference Samples

### Best Examples (Nail This Voice)
1. [Link to sample 1] - [Why this is perfect]
2. [Link to sample 2] - [Why this is perfect]
3. [Link to sample 3] - [Why this is perfect]

### Anti-Examples (Never This)
1. [Link to sample that doesn't sound like them] - [Why to avoid]

### Aspiration Benchmark
[Link to content they wish they'd written] - [What to learn from this]

## QA Checkpoint
When reviewing content for [Client], ask:
- [ ] Does this sound like [their influences]?
- [ ] Does this avoid [their anti-influences]?
- [ ] Would their audience recognize this as them?
- [ ] Are signature words/phrases present naturally?
- [ ] Are banned words/phrases absent?
- [ ] Does tone match their profile ratings?
```

---

# **APPENDIX B: QUESTIONNAIRE TEMPLATES**

## **Typeform/Google Form Setup**

**Section breaks:**

1. Business & Positioning (Q1-8)  
2. Audience Deep Dive (Q9-14)  
3. Voice & Style DNA (Q15-24)  
4. Content Samples (Q25-27) \[file uploads\]  
5. Content Guidelines (Q28-32)  
6. Newsletter Context (Q33-38)

**Question types:**

* Short answer (text box)  
* Long answer (paragraph)  
* Multiple choice  
* Linear scale (1-5)  
* File upload

**Branding:**

* RTR Agency logo  
* Professional but warm design  
* Progress bar  
* Save and continue later option  
* Estimated time: 45-60 minutes

---

# **FINAL THOUGHTS FOR RTR AGENCY**

## **You're at a Crossroads**

**Path 1: Keep current system**

* Result: Collapse at 15-20 clients  
* Timeline: 3-6 months before crisis  
* Team morale: Deteriorating  
* Client satisfaction: 50% and declining

**Path 2: Implement this system**

* Result: Scale to 50-100+ clients  
* Timeline: Operational in 2 weeks, proven in 3 months  
* Team morale: Empowered, efficient  
* Client satisfaction: 95%+, growing

## **The Hard Truth**

You have 4-5 weeks of history. You're early enough to fix this without catastrophic damage. Six months from now, you won't be.

**The work required:**

* 2 weeks of focused implementation  
* Some temporary discomfort retrofitting current clients  
* Upfront time investment in onboarding

**The payoff:**

* Business that scales infinitely  
* Team that functions without bottlenecks  
* Clients who are delighted, not just satisfied  
* Revenue growth limited only by sales, not operations

## **Next Actions**

1. **This weekend:** Richard \+ Charl review this document, make go/no-go decision  
2. **Monday:** If go, install Cursor and Claude, start building  
3. **Week 1:** Build foundation (skills, templates, first client test)  
4. **Week 2:** Retrofit 4 priority clients, validate system  
5. **Week 3:** Complete remaining 5 clients, train team  
6. **Week 4+:** Onboard Client \#10 with perfect process

## **Questions to Consider**

* What's the cost of NOT doing this? (Lost clients, revenue ceiling, team burnout)  
* What's the upside? (10x capacity, happy clients, sellable business)  
* What's the risk? (2 weeks of focused work \- minimal)

## **The Reality**

You built RTR to scale, not to manually manage 45 bots forever. This system makes RTR the business you envisioned.

**The choice is clear. The time is now.**

---

*RTR Agency Content Operations System v1.0* *Built for scale. Designed for excellence.*

