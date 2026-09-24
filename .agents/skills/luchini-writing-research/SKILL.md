---
name: luchini-writing-research
description: Research and fact-gathering for the author's writing — companion to luchini-writing-style, which owns voice and drafting. Use when a new post idea needs a fact base before drafting, when a draft has unsourced claims, when modernizing an old post for republication ("the world caught up"), or when asked to research a topic that might become a post. Produces durable research notes in docs/research/.
---

# Luchini writing research

Accessory skill to `luchini-writing-style`. That skill owns *how* posts sound;
this one owns *what* there is to say before drafting: questions, sources,
verified facts, quotable precision. The author researches as much as possible
before writing anything — so research comes first, drafting second.

## When this applies

- A new post idea exists and needs a fact base before any drafting
- A draft makes verifiable claims that lack sources
- Republishing an old post and the update needs modern evidence
- "Research this topic" for anything that might become a post

Do NOT draft with this skill — hand off to `luchini-writing-style` once the
research note is solid. And research can never supply biographical facts
(jobs, places, races, family). It supplies world-evidence only; the style
skill's rule stands.

## Where research lives

Durable notes in `docs/research/`, one file per planned post, named after the
planned post file: `docs/research/YYYY-MM-DD-slug.md` — the same slug the
post will have in `resources/templates/md/posts/`, so note and post stay
paired. Notes are working documents: append as you go, never polish them for
publication. They survive the session, feed reposts years later, and let the
author review what every claim rests on.

Use the template at the bottom. Keep every section — an empty section ("Open
questions: none yet") is signal, not clutter.

## Workflow

1. **Frame the questions.** Turn the idea into 2–5 research questions. Pick a
   tentative archetype (Lesson / Story / Argument / List / Personal essay —
   see `docs/writing-style/post-anatomy.md`), because it decides what to hunt:
   an Argument needs data and named cases; a Story needs scene detail; a
   Lesson needs one mechanism explained exactly right.
2. **Fan out wide, then deep.** `web_search` with `queries` — 2–4 varied
   angles (academic phrasing, practitioner phrasing, contrarian phrasing) —
   never a single query. Use `recencyFilter` for fast-moving topics. Then
   `fetch_content` on the strongest hits, and `get_search_content` with
   `findText` to mine stored results without re-fetching.
3. **Prefer primary sources.** Studies (link the DOI), official docs, original
   reporting, direct transcripts — over listicles and aggregators. If only a
   secondary source is reachable, say so in the note.
4. **Verify before it enters the note.** Every URL that could end up in a post
   must be fetched and read, not just seen in a search snippet. Use
   `source_check` for load-bearing or surprising claims, and get 2+
   independent sources for anything the post leans on. Record publication
   dates — a 2009 post updated in 2026 must not cite a 2014 study as
   "recent".
5. **Hunt the yardstick.** His signature move is absurd precision plus a
   familiar yardstick ("470 foot-pounds of torque — about the same as the V-8
   in a new Corvette"). For every striking figure, research the comparison
   too: what everyday thing weighs, costs, or lasts that much? Capture both.
6. **Check the personal-evidence gap.** Mark which claims need *his* life — a
   race, a boss, a place he lived. Those become asks for the author, never
   inventions.
7. **Decide done-ness.** Research is done when every question has a primary
   source or sits openly in "Open questions", and the note holds at least one
   surprising finding — the thing the post can teach. Then fill the handoff
   summary and stop.

For large retrieval jobs (dozens of pages, long crawls), the
`isolated-research` subagent can run the crawl and write the note; review its
output before drafting. Quick fact checks stay in-process.

## Handoff to drafting

The note's handoff summary is the bridge: the thesis the evidence supports,
the 3–5 best facts with links, yardstick candidates, and the open asks. Point
`luchini-writing-style` at the note. In the published post, claims get inline
markdown links woven into the claiming sentence (2026 standard) — never a
source dump at the bottom.

## Repost research (updating old posts)

- Research what changed since the original date — the "world caught up" angle
  needs modern, dated, linked evidence.
- Re-fetch every original link; dead references get fixed or flagged.
- New sections near the end need sources dated after the original post, each
  with a working link.

## Anti-patterns

- Never invent a URL, citation, statistic, or quote. If it can't be fetched
  and read, it doesn't exist.
- Never cite a source read only as a headline or snippet.
- Don't let research become the post: the note holds evidence; the style skill
  turns evidence into story.
- No hype sources, no SEO-bait framing. If a source sounds like marketing,
  find the study it is mangling.

## Note template

```markdown
# Research: <working title>

- Planned post: `YYYY-MM-DD-slug`
- Archetype guess: Lesson | Story | Argument | List | Personal essay
- Status: gathering | ready to draft | handed off
- Started: YYYY-MM-DD

## Research questions

1. ...

## Findings

### <subtopic>

- Fact — [source](url) (publisher, date). Reliability note if needed.

## Yardstick candidates

- Precise figure — familiar comparison — [source](url)

## Disagreements and caveats

- ...

## Personal-evidence asks for the author

- ...

## Open questions

- ...

## Handoff summary (fill last)

- Thesis the evidence supports:
- Best facts (3–5, with links):
- Yardstick candidates:
- Still missing:
```
