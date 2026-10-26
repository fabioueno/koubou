---
name: explain
description: >
  The user's standing output format for substantial answers. Load this skill
  before you answer how code or a system works, why something failed (a CI run,
  a test, a bug), which option to choose, or what happens step by step, and
  before you write a plan, review, report or summary. It turns those answers
  into an HTML page with diagrams, images and other visuals instead of terminal
  prose, and its words follow `kanso:write`. Load it even when the answer looks
  easy to give directly, and even when the user does not ask for a page. Only
  one-line facts, status lines and clarifying questions skip the page.
---

# kanso: explain

This skill decides when a reply becomes an HTML Artifact instead of terminal
text, and how to build that page. Load `kanso:write` first: its rules govern
every word on the page and in the terminal reply.

## When a reply becomes a page

This is the user's standing preference, and it replaces the Artifact tool's
default of "answer in the terminal and offer a page". Do not offer a page: make
one.

Make a page for a substantive reply. A reply is substantive when it does one of
these:

- It explains how something works or why something happened.
- It compares options, recommends one, or reviews code or a design.
- It presents a plan, a report or a walkthrough.
- It has more than about ten lines of prose.

When you make a page, the terminal reply stays short: at most three sentences
and no lists (see "The terminal reply").

Keep these in the terminal:

- A one-line or short factual answer.
- Status lines while you work.
- A clarifying question.
- The diff or summary of a small code edit.

Prose for a file (a doc, a comment, a commit message, a pull request) is not a
page. `kanso:write` covers it.

## How to build the page

Follow the Artifact tool's own flow. Do not restate its page contract here, or
the two will drift apart.

1. Load `kanso:write` with the Skill tool, unless this session already loaded
   it. The session-start summary does not replace it: the page needs its full
   meaning rules.
2. Call `Artifact` with `action: "quickstart"` and the fitting `intent`.
3. Load the skills it names. Load `artifact-design` for the page, unless the
   quickstart result already includes its guidance. Load `artifact-diagramming`
   before you draw a diagram. Load `dataviz` before you draw a chart.
4. Write the page to a local `.html` file in the scratchpad directory (or
   `$CLAUDE_JOB_DIR/tmp` in a background job). A file on disk lets the person
   and any tooling read the page without the link.
5. Publish that file with the Artifact tool. To update the page later, publish
   the same file path again.

If the session has no Artifact tool (a headless run, for example), the page
rules still apply. Skip steps 2, 3 and 5. Write the page as a self-contained
`<slug>.html` file in the working directory, where `<slug>` names the subject,
and give its path in the terminal reply instead of a link.

Write all page text with `kanso:write`. Headings are short noun phrases or
questions. The first section answers the question in two or three sentences.

## Pictures before words

Prefer a visual to prose when it carries the point: a diagram, a table, an image
or an animation. Use a diagram when the subject has a shape that prose hides.
Ask: "Must the reader hold more than three things in their head at once to
follow this?" If yes, draw it.

| The content is...                                                     | Use                                                                                                |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| A flow, request path or sequence of calls                             | Sequence or flow diagram                                                                           |
| States and the events that move them                                  | State diagram                                                                                      |
| Parts and how they connect                                            | Box-and-arrow architecture                                                                         |
| A change                                                              | Before and after, side by side                                                                     |
| Options against criteria                                              | Table                                                                                              |
| Numbers over time or across groups                                    | Chart (load `dataviz`)                                                                             |
| Steps the reader does                                                 | Numbered list                                                                                      |
| Something that moves or changes over time                             | Animation                                                                                          |
| Something the reader would see (a screen, an error dialog, an output) | A screenshot or a captured image, annotated, when the session can capture one. Otherwise, draw it. |

Draw diagrams as inline SVG, not images from elsewhere. Let the diagram carry
the mechanism, and let a short STE caption say what to notice. Do not repeat the
whole diagram in prose under it. Label every box and arrow with the same terms
the text uses (rule 2 of `kanso:write`).

A diagram obeys the meaning rules of `kanso:write` too:

- Draw a path you verified differently from a path you suspect (for example,
  solid and dashed lines), and say which is which in a legend. Do not draw a
  link that the evidence does not show.
- Show one main idea. Split a diagram with more than about 12 nodes into two.
- If the diagram carries a fact that the text does not state, add a short text
  version under it, so a reader who cannot see the diagram gets the fact.

Use an animation when the order or timing is the point: a request that crosses
several services, a queue that drains, a cache that fills and expires, a state
machine that reacts to events, or a walkthrough of what happens on each click,
retry or tick of a timer. Build it from the same inline SVG, moved with CSS or a
small script, not as a video file. A reader can pause a page animation on one
step, and its labels stay sharp and searchable. Give it these:

- Play, pause and step controls, and a caption for each step that says what
  happens in it.
- A start in the paused state, at step one.
- Under `prefers-reduced-motion`, no motion: show the steps as a static
  sequence.

When the person asks you to walk them through what happens step by step, or on
each click or each retry, give the page those step controls. A static timeline
can sit next to them, but it does not replace them, because the person asked to
follow the steps one at a time.

Do not draw or animate for decoration. A diagram of one box, or a flow with two
steps, is worse than one sentence. Outside a requested walkthrough, an animation
that a static sequence diagram could replace is worse than that diagram.

## The terminal reply

After you publish, write a short terminal reply:

1. The answer itself in at most three STE sentences, so the person can act
   without opening the page. Use no lists or headings: the walkthrough, the
   reasons and the caveats belong on the page.
2. The page link, and one line that says whether you rendered or tested the page
   in a browser. Give the file's path instead only when the session has no
   Artifact tool. Do not claim a check that did not run.
3. Any status line the session requires, such as `result:`, `needs input:` or
   `failed:` in a background job. The page never replaces these lines.

Caveats, open questions and things you did not check go on the page, not in the
reply. The reply still keeps the answer's confidence: a likely cause stays
"likely", and an unproven one says so. The whole reply looks like this:

> Only the first click in each 30 seconds sends an email. The button stays
> disabled during the countdown, and the server drops any click that still
> arrives, with the same "sent" reply. The page steps through each click.
>
> Page: https://claude.ai/code/artifact/… I did not open it in a browser.
