---
name: custom-frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Extends Claude's base frontend-design skill with hard project constraints (no neon, no glow, no transparent-border buttons, no generic CSS colors, mandatory generative/specified imagery, fixed typeface pairing, no generic widgets/layouts) that must be enforced on every build.
---

# Custom Frontend Design Rules

These are non-negotiable constraints for this project. They sit on top of (not instead of) the general design judgment described in the "Base Frontend Design Skill" section below. If anything in the base skill's calibration notes conflicts with a rule here, the rule here wins.

## Hard constraints

1. **No neon aesthetics.** Do not use saturated neon color palettes (acid green, electric magenta, neon cyan, etc.) anywhere — backgrounds, accents, text, borders, or illustrations.

2. **No glow effects.** No `box-shadow`/`filter`/`text-shadow` used to simulate glow, bloom, halo, or luminous edges on text, buttons, cards, or icons. Shadows are allowed only when used for realistic, restrained elevation (soft, low-opacity, purposeful depth) — never as a decorative light effect.

3. **No transparent-border buttons.** Buttons must not use `border: 1px solid transparent` or any variant where the border is invisible/transparent as a spacing trick or as a fake "ghost button" style. If a button has a border, it must be a visible, intentional, on-brand color. If a button shouldn't have a visible border, don't declare one at all — style it with fill, weight, or underline instead.

4. **No generic CSS colors.** Never use raw CSS color keywords (`red`, `blue`, `gray`, `white`, `black`, etc.) or arbitrary unconsidered hex values. Every color must come from a deliberately chosen, named token palette (see base skill's "4–6 named hex values" process). For imagery: prefer generative/AI-created background images or illustrations suited to the subject over flat color fields or stock gradients. If an image can't be generated in the current environment, explicitly and precisely describe the image needed (subject, style, palette, mood, composition, aspect ratio) so it can be sourced or generated later — never silently fall back to a plain color block.

5. **Typography is fixed for this project:**
   - Headings: **Outfit** (https://fonts.google.com/specimen/Outfit) — use its variable weight axis deliberately (don't just default to one weight; set a real type scale with intentional weight shifts between heading levels).
   - Body/content copy: **Hedvig Letters Sans** (https://fonts.google.com/specimen/Hedvig+Letters+Sans).
   - Load both via Google Fonts (`<link>` or `@import`) and set them as CSS custom properties (e.g. `--font-heading`, `--font-body`) so usage stays consistent across every component.
   - Do not substitute, add, or mix in additional display/body typefaces beyond a monospace/utility face if data or captions genuinely need one.

6. **Design consistency is mandatory.** Once color tokens, type scale, spacing scale, radius, and component patterns are defined for a build, reuse them exactly across every screen/section/component. No one-off font sizes, one-off colors, or one-off spacing values invented mid-build. Keep a running token list (in the code as CSS variables, or noted in comments) and check new components against it before adding anything new.

7. **No generic widgets or layouts.** Avoid template defaults: no generic hero-with-centered-headline-and-two-buttons, no generic 3-card feature grid with icon-on-top, no generic navbar-logo-left-links-right-CTA-button-right pattern, unless the brief's content genuinely calls for that exact shape and it's been deliberately chosen (not defaulted to). Every layout decision should be traceable to something specific about the subject/content, per the base skill's "ground it in the subject" process.

## Don'ts — AI Slop Anti-Patterns

These are known tells of generic AI-generated UI. Do not produce any of these, regardless of what else the brief asks for.

**Design system discipline**
- No fonts outside the defined type scale (Outfit + Hedvig Letters Sans only)
- No raw hex/RGB — every color from the named token list
- No off-scale border radius or font sizes — stick to the defined scale

**Visual details**
- No decorative grid-line / dot backgrounds
- No thick accent border on a rounded card ("side-tab" look)
- No glassmorphism, blur, or glow-as-decoration
- No hairline border + big soft shadow combo
- No barber-pole gradient stripes
- No blob-radius cards (24px+)
- No amateur hand-drawn SVG mascots

**Typography**
- No uppercase "eyebrow" pill label over every heading
- No functional text under 11px
- No flat hierarchy — headings and body must contrast clearly in size/weight
- No icon-tile-over-heading pattern
- No oversized italic serif hero headline
- No hero pill/chip badges
- No 60px+ multi-line hero sentences
- No negative letter-spacing collisions
- No Inter/Geist/Space Grotesk/Instrument Serif defaults
- No single font doing every job
- No all-caps body paragraphs

**Color & contrast**
- No purple/blue radial glow halos
- No spotlight/haze behind sections
- No purple-violet or cyan-on-dark default palette
- No glowing borders/neon shadows in dark mode
- No gradient-clipped text
- No gray text on saturated color
- No reflexive cream/beige (#f5efe2-style) background
- Must pass WCAG AA contrast (4.5:1)

**Layout & space**
- No 01/02/03 numbered labels unless order is real, meaningful sequence
- No cards clipped at scroll-edge
- No overlapping floating elements occluding text
- No lopsided multi-column hero (one column way taller)
- No heading crowded closer to prior block than to its own body copy
- No "big number + label + 3 stats" hero block by default
- No repeated identical 3x2 icon-card grids
- No monotonous uniform spacing everywhere — use spacing to group
- No cards-inside-cards
- Line length capped ~75–80 characters
- No content overflow / clipped dropdowns

**Motion**
- No pulsing dot for static status
- No fake blinking terminal cursor on non-editable text
- No infinite auto-scrolling logo marquee
- No bounce/elastic easing on standard UI
- Never animate width/height/margin/padding directly — use transform/opacity
- No constant hover scale/rotate on every image

**Copy**
- No repeated word across title/subtitle/button in one component
- No em-dash overuse
- No buzzwords: "supercharge," "streamline," "enterprise-grade," "empower," "next-generation"
- No aphoristic contrast copy ("Not a feature. A platform.")
- No "performative/theater" framing tropes

**Imagery & quality**
- No clip-art-style shape-assembled hero graphics
- No broken/empty image src
- No uncaught JS errors on load
- No scroll-reveal stuck at opacity: 0
- No cramped (~2px) button/badge padding
- No body text touching viewport edge on mobile
- No justified unhyphenated body text
- No skipped heading levels (h1 → h3)
- No line-height under 1.3, no sub-12px body text, no excess tracking

## How these interact with the base skill

Run the base skill's brainstorm → plan → critique → build → critique process as normal, but when producing the token system:
- **Color section:** name 4–6 hex values as usual, but treat them as the *only* allowed colors in the build (rule 4), and plan where generative/specified imagery replaces flat color fields.
- **Type section:** skip the "choose a display and body face" exploration — the faces are fixed (rule 5) — but still explicitly plan the weight scale, sizes, and pairing rhythm between Outfit and Hedvig Letters Sans.
- **Layout section:** explicitly check each proposed layout against rule 7 before building.
- **Signature element:** must not rely on glow or neon to read as bold (rules 1–2) — find the signature in composition, imagery, type, or motion instead.

---

# Base Frontend Design Skill

*(Anthropic's frontend-design skill, included in full below for reference — this is the general design judgment the hard constraints above are layered on top of.)*

Approach this as the design lead at a small studio known for giving every client a visual identity that could not be mistaken for anyone else's. This client has already rejected proposals that felt templated, and is paying for a distinctive point of view: make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief, and take one real aesthetic risk you can justify.

## Ground it in the subject

If the brief does not pin down what the product or subject is, pin it yourself before designing: name one concrete subject, its audience, and the page's single job, and state your choice. If there's any information in your memory about the human's preferences, context about what they're building, or designs you've made before – use that as a hint. The subject's own world, its materials, instruments, artifacts, and vernacular, is where distinctive choices come from. Build with the brief's real content and subject matter throughout.

## Design principles

For web designs, the hero is a thesis. Open with the most characteristic thing in the subject's world, in whatever form makes sense for it: a headline, an image, an animation, a live demo, an interactive moment. Be deliberate with your choice: a big number with a small label, supporting stats, and a gradient accent is the template answer, only use if that's truly the best option.

Typography carries the personality of the page. Pair the display and body faces deliberately, not the same families you would reach for on any other project, and set a clear type scale with intentional weights, widths, and spacing. Make the type treatment itself a memorable part of the design, not a neutral delivery vehicle for the content.

Structure is information. Structural devices, numbering, eyebrows, dividers, labels, should encode something true about the content, not decorate it. Many generic designs use numbered markers (01 / 02 / 03), but that's only appropriate if the content actually is a sequence - like a real process or a typed timeline where order carries information the reader needs. Question if choices like numbered markers actually make sense before incorporating them.

Leverage motion deliberately. Think about where and if animation can serve the subject: a page-load sequence, a scroll-triggered reveal, hover micro-interactions, ambient atmosphere. An orchestrated moment usually lands harder than scattered effects; choose what the direction calls for. However, sometimes less is more, and extra animation contributes to the feeling that the design is AI-generated.

Match complexity to the vision. Maximalist directions need elaborate execution; minimal directions need precision in spacing, type, and detail. Elegance is executing the chosen vision well.

Consider written content carefully. Often a design brief may not contain real content, and it's up to you to come up with copy. Copy can make a design feel as templated as the design itself. See the below section on writing for more guidance.

## Process: brainstorm, explore, plan, critique, build, critique again

For calibration: AI-generated design right now clusters around three looks: (1) a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta or warm-clay accent (often near #D97757 — Anthropic's own Claude-interaction accent, so on a user's brief it reads as a tell); (2) a near-black background with a single bright acid-green or vermilion accent; (3) a broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns. All three are legitimate for some briefs, but they are defaults rather than choices, and they appear regardless of subject. Where the brief pins down a visual direction, follow it exactly — the brief's own words always win, including when it asks for one of these looks. Where it leaves an axis free, don't spend that freedom on one of these defaults. Just like a human designer who's hired, there's often a careful balance between doing what you're good at and taking each project as a chance to experiment and learn.

Work in two passes. First, brainstorm a short design plan based on the human's design brief: create a compact token system with color, type, layout, and signature. Color: describe the palette as 4–6 named hex values. Type: the typefaces for 2+ roles (a characterful display face that's used with restraint, a complementary body face, and a utility face for captions or data if needed). Layout: a layout concept, using one-sentence prose descriptions and ASCII wireframes to ideate and compare. Signature: the single unique element this page will be remembered by that embodies the brief in an appropriate way.

Then review that plan against the brief before building: if any part of it reads like the generic default you would produce for any similar page (work through a similar prompt to see if you arrive somewhere similar) rather than a choice made for this specific brief — revise that part, say what you changed and why. Only after you've confirmed the relative uniqueness of your design plan should you start to write the code, following the revised plan exactly and deriving every color and type decision from it.

When writing the code, be careful of structuring your CSS selector specificities. It's easy to generate CSS classes that cancel each other out (especially with a type-based selector like .section and a element-based selector like .cta). This can happen often with paddings/margins between sections.

Try to do a lot of this planning and iteration in your thinking, and only show ideas to the user when you have higher confidence it'll delight them.

## Restraint and self-critique

Spend your boldness in one place. Let the signature element be the one memorable thing, keep everything around it quiet and disciplined, and cut any decoration that does not serve the brief. Not taking a risk can be a risk itself! Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected. Critique your own work as you build, taking screenshots if your environment supports it – a picture is worth 1000 tokens. Consider Chanel's advice: before leaving the house, take a look in the mirror and remove one accessory. Human creators have memory and always try to do something new, so if you have a space to quickly jot down notes about what you've tried, it can help you in future passes.

## More on writing in design

Words appear in a design for one reason: to make it easier to understand, and therefore easier to use. They are design material, not decoration. Bring the same intentionality to copy that you would bring to spacing and color. Before writing anything, ask what the design needs to say, and how it can best be said to help the person navigate the experience.

Write from the end user's side of the screen. Name things by what people control and recognize, never by how the system is built. A person manages notifications, not webhook config. Describe what something does in plain terms rather than selling it. Being specific is always better than being clever.

Use active voice as default. A control should say exactly what happens when it's used: "Save changes," not "Submit." An action keeps the same name through the whole flow, so the button that says "Publish" produces a toast that says "Published." The vocabulary of an interface is the signposting for someone navigating the product. Cohesion and consistency are how people learn their way around.

Treat failure and emptiness as moments for direction, not mood. Explain what went wrong and how to fix it, in the interface's voice rather than a person's. Errors don't apologize, and they are never vague about what happened. An empty screen is an invitation to act.

Keep the register conversational and tuned: plain verbs, sentence case, no filler, with tone matched to the brand and the audience. Let each element do exactly one job. A label labels, an example demonstrates, and nothing quietly does double duty.
