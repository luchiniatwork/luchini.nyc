# Ghostwriter Playbook

Operational guide: how to go from assignment to a published post that sounds
like him. Read `voice-and-tone.md` first; keep `sentence-and-rhythm.md` and
`phrasebook.md` open while drafting.

## File mechanics (this blog)

Posts live in `resources/templates/md/posts/` as `YYYY-MM-DD-slug.md`. The
slug is the filename minus the date prefix; URLs are `/posts/<slug>`.

Frontmatter (YAML):

```yaml
---
title: "Sentence-case title, question marks welcome"
layout: post
date: 2026-09-24            # publication date; matches filename prefix
tags: ["management", "life"] # 1-3 lowercase tags from the existing tag set
draft: true                  # true while working; false to publish
updated: 2026-09-24          # only on republished/updated posts, omit otherwise
---
```

- Prefer reusing existing tags (`management`, `life`, `technology`,
  `business`, `china`, `open source`, `running`, `software`, `lisp`,
  `clojure`) over inventing new ones.
- Images go in a sibling directory named after the full filename stem
  (e.g. `2007-08-03-imagination/icon_quake_big.jpg`) and are referenced
  relatively.
- Verify with `bun run typecheck` and `bun run test` before finishing; tests
  assert draft gating, RSS, sitemap, and archive counts and will need updating
  when a post's publish state changes.

## Workflow for a new post

1. **Pick the archetype first** (`post-anatomy.md`): Lesson, Story, Argument,
   List, or Personal essay. Write it at the top of the draft.
2. **Find the personal evidence.** Every post needs at least one of: a
   personal anecdote, a named real-world story with specifics, or a lived
   detail (a race, a boss, a place he lived). If the assignment has none, get
   one from the author before drafting — do not invent biographical facts.
   (Inventing composite scenes like "imagine a young man proposing" *is* in
   bounds; he does that.)
3. **Draft the hook and the ending before the middle.** Hook from the
   openings catalog; ending from the closings catalog. If those two work, the
   middle follows the skeleton.
4. **Draft in his rhythm.** Medium sentences, short paragraphs, 2–5 punch
   lines, at least two rhetorical questions, one coined term at most.
5. **Season with the phrasebook.** Three to six signature moves total.
6. **Edit for charm, not polish.** Fix errors per the fingerprint table; keep
   marked-but-correct constructions. Read aloud: wrong → fix; merely foreign →
   keep.
7. **Facts and links.** New posts cite sources inline with markdown links for
   any verifiable claim (2026 standard). No source dumps at the bottom; weave
   links into the sentence that makes the claim.
8. **Self-check against the checklist below, then hand over.**

## The repost convention (updating old drafts, established Sept 2026)

When modernizing an old post for publication:

- **Keep the original filename, date, and title.** The post keeps its place in
  the archive timeline.
- **Add `updated: YYYY-MM-DD`** to the frontmatter (renders as "Updated …"
  beside the date).
- **Open with an italic editor's note**, one line, wry but informative:
  > *Written in 2009. Updated in September 2026 — the world caught up with
  > this one.*
  > *First drafted in 2008, completed around 2010 — as the examples give
  > away. Updated in September 2026: the rituals only got bigger.*
- **Preserve original prose.** Edit only: typos, factual errors, grammar that
  distracts, dead references. Do not rephrase his sentences to "improve" them.
- **Add new material as clearly-marked new sections** near the end ("Science
  caught up with the lesson", "What changed since 2009", "The biggest cargo
  cult of them all"), written in the same voice, with linked sources.
- **Fix facts quietly when the fix is mechanical** (population figures,
  company nationalities, misspellings); **flag with the editor's note when the
  post's framing changes** (the cargo-cult date mismatch).

## Do / Don't

**Do**

- Open with story or thesis; close with takeaway.
- Use his metaphor pools: running, marriage, military, survival, craft.
- Name real people, real numbers, real places. "470 foot-pounds of torque",
  not "a lot of force".
- Admit a mistake or uncertainty somewhere in the post.
- Let one joke live in a parenthesis.
- Vary sentence length deliberately; end sections on short sentences.

**Don't**

- Don't summarize the post in the first paragraph.
- Don't use hype vocabulary, SEO phrasing, or engagement-bait closings.
- Don't stack more than two rhetorical questions in a section.
- Don't use more than one coined term (two only if they pair, like "black
  hole" / "email to everybody").
- Don't imitate ESL errors or European number formats — the fingerprint is in
  the *constructions*, not the mistakes.
- Don't write in plural corporate "we" when the post is his experience; "we"
  is for shared human experience, "I" for his.
- Don't exceed ~1,400 words for Lesson/Argument posts; ~1,900 for Story/List.

## Pre-publication checklist

Voice:

- [ ] One clear archetype; skeleton followed
- [ ] Hook from the catalog (no summary intro)
- [ ] At least one personal anecdote or specific named story
- [ ] 2–5 punch-line short sentences; no walls of text (max 4 sentences/para)
- [ ] At least two rhetorical questions doing real work
- [ ] 3–6 phrasebook moves, no more
- [ ] One admitted fallibility or uncertainty
- [ ] Ending is a single closing move (question, checklist, aphorism, or
      sign-off)

Mechanics:

- [ ] Frontmatter complete; `draft: false` only when approved
- [ ] US number/date formats; straight double quotes, consistent dash style
- [ ] Fingerprint table applied: errors fixed, charm preserved
- [ ] All claims that invite verification are linked
- [ ] `bun run typecheck` clean; `bun run test` green (update blog.spec.ts if
      publish state changed)

## Worked example: the same paragraph, three ways

**Generic content voice (rejected):**
> In today's fast-paced business environment, leaders face unprecedented
> pressure to respond instantly. This article explores why urgency culture is
> toxic and offers five strategies for prioritization. Read on to learn more.

*Why it fails: throat-clearing, hype adjectives, promises a listicle, no
person in the room.*

**His voice (from the actual 2026 update):**
> "In 2009 an Urgent request arrived by being summoned to the boss's office.
> Today it arrives as a red badge: Slack, Teams, a phone that never stops. The
> factory of urgency has been industrialized."

*Why it works: concrete then/now, one image per clause, a coined phrase ("the
factory of urgency"), and the punch-line rhythm.*

**Over-imitation (also rejected):**
> "It is no surprise that, rule-of-thumb, the age of now, a.k.a. the present,
> is very, very, incredibly urgent — the more the merrier! Think again, dear
> reader! Have a nice urgent time!"

*Why it fails: every signature move stacked into three sentences. Voice is
rhythm and restraint, not a pile of tics.*
