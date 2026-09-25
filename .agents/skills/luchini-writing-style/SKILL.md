---
name: luchini-writing-style
description: Write or edit blog posts for luchini.nyc in the author's personal voice (Tiago Luchini). Use when drafting, ghostwriting, editing, or republishing posts for this blog, when asked to make text "sound like" the site's author, or when touching files under resources/templates/md/posts/.
---

# Luchini writing style

This skill teaches you to write like the author of luchini.nyc. The condensed
rules below are enough for a passable draft; the reference documents listed at
the end are how you make it indistinguishable.

## When this applies

- Writing a new post for `resources/templates/md/posts/`
- Editing or finishing an existing draft post
- Updating an old post for republication (see the repost convention below)
- Any request to make prose "sound like Tiago" / "sound like the blog"

Do NOT invent biographical facts (jobs, places, races, family, employers). If
a post needs personal evidence you don't have, ask the author. Composite
illustrative scenes ("imagine a young man proposing...") are fine — he writes
those himself.

## The voice in five rules

1. **Story first, lesson second.** Open with an anecdote or a bold thesis —
   never a summary, never "In this post I will...".
2. **Short paragraphs.** Two to four sentences each. One-sentence paragraphs
   for emphasis.
3. **Talk to the reader.** "You" and "we", rhetorical questions doing real
   work (at least two per post), asides in parentheses.
4. **End with the takeaway.** One closing move: an exit question, a checklist,
   an aphorism, or a warm sign-off. Never all of them.
5. **Confident but fallible.** Strong opinions, and somewhere in the post an
   openly admitted mistake or uncertainty.

The stance is practitioner-teacher telling a story to a smart friend: first
person, plain spoken English, medium sentences with occasional 2–7 word punch
lines ("Wrong.", "Simple!", "But things changed a while ago."). Warmth and dry
humor, never hype, never corporate polish, never engagement bait.

## Signature moves (use 3–6 per post, no more)

- Coin a term in quotes and reuse it all post ("the 'black hole' syndrome",
  "agent washing"). Maximum one or two per post.
- "It is no surprise that...", "Take X, for example", "If you think X, think
  again", "In one simple word: ...", "a.k.a.", "rule-of-thumb".
- Absurd-precision detail with a familiar yardstick ("470 foot-pounds of
  torque — about the same as the V-8 in a new Corvette").
- Metaphors from his pools: ultra-running, marriage/family, military history,
  survival/resourcefulness, craft.

## The non-native fingerprint — keep the charm, fix the error

He is Brazilian; the English is fluent but marked. That marking is voice:

- **Keep** (grammatical, distinctive): formal connectives ("It comes as no
  surprise", "It goes without saying"), direct unhedged statements, "Do make
  sure..." imperatives, present-tense scene setting.
- **Never imitate errors**: misspellings ("loosing"), agreement slips ("an
  expensive movies"), preposition drift ("into the right track"), European
  number formats ("3.000 hours"). New posts use US formats ("3,000").
- Test: read it aloud. If a native speaker would call it wrong, fix it. If
  they would only call it slightly foreign, that is the voice — leave it.

## File mechanics

- Posts: `resources/templates/md/posts/YYYY-MM-DD-slug.md`; slug (and URL
  `/posts/<slug>`) comes from the filename minus the date prefix.
- Frontmatter: `title`, `layout: post`, `date`, `tags` (1–3 existing
  lowercase tags), `draft: true|false`, and `updated: YYYY-MM-DD` only on
  republished posts.
- Images: sibling directory named after the full filename stem, referenced
  relatively.
- Before finishing: `bun run typecheck` and `bun run test`. Publishing a post
  changes production behavior — update `tests/blog.spec.ts` expectations
  (archive counts, RSS items, sitemap) to match.

## Repost convention (updating old drafts)

Keep filename, date, and title. Flip `draft: false`, add
`updated: YYYY-MM-DD`, and open with a one-line italic editor's note
("*Written in 2009. Updated in September 2026 — the world caught up with this
one.*"). Preserve original prose — fix only typos, factual errors, and dead
references. Add modern material as clearly marked new sections near the end,
with linked sources.

## Scheduling convention (future-dated posts)

"This post is scheduled for March 31st" means: set `date: YYYY-MM-DD`
(the next occurrence of that calendar date — echo the full resolved date
back before merging), flip `draft: false`, and rename the filename date
prefix to match. The slug is unchanged, so links never break.

Production hides future-dated posts everywhere (archive, tags, RSS,
sitemap, related posts, direct URL → 404) and starts serving them
automatically once the date passes — no redeploy. Dev shows them with a
`scheduled` badge. The gate is date-granular against the UTC calendar
date: a post goes live at 00:00 UTC (evening of the prior day in US
timezones); a time of day cannot be expressed.

The post must merge to `prod` before its date — batch-merging a queue
of scheduled posts is the intended workflow. Scheduling does not change
prod-visible counts, so no `tests/blog.spec.ts` updates are needed
(unlike publishing, per file mechanics above); the committed
`2099-01-01-scheduled-test-fixture.md` covers the gate.

## Reference documents (read these for depth)

All under `docs/writing-style/` in this repository (resolve relative to the
repo root, e.g. `../../../docs/writing-style/` from this skill directory):

- `README.md` — index and the 30-second voice summary
- `voice-and-tone.md` — persona, four tonal registers, values, banned tones.
  Read first for new posts.
- `post-anatomy.md` — the five archetypes (Lesson / Story / Argument / List /
  Personal essay) with skeletons, openings & closings catalogs. Pick an
  archetype before drafting.
- `sentence-and-rhythm.md` — sentence shapes, paragraph rhythm, punctuation
  habits, the full keep-vs-fix fingerprint table. Keep open while editing.
- `phrasebook.md` — signature phrases with real citations and dosage limits.
- `ghostwriter-playbook.md` — full workflow, do/don't lists, pre-publication
  checklist, worked examples. Run the checklist before handing over.

Workflow shortcut: new post → `voice-and-tone.md` + `post-anatomy.md`;
editing a draft → `sentence-and-rhythm.md` + `phrasebook.md`; republishing an
old post → `ghostwriter-playbook.md` (repost convention); always finish with
its checklist.

## Companion skill

Pre-writing research — questions, sources, verified facts, yardstick detail —
is owned by the sibling skill `luchini-writing-research`
(`../luchini-writing-research/SKILL.md`). The author researches before
writing: run that skill first when a post needs a fact base, then draft here.
Its notes live in `docs/research/`, named after the planned post slug.
