# Reminders plan

Revision 2, approved on Sat 24 Oct 2026.

## Goal

Every household member gets one email each morning that lists overdue tasks
and tasks due tomorrow.

## Decisions

| Decision          | Choice                                         | Who            |
| ----------------- | ---------------------------------------------- | -------------- |
| Who gets it       | Every member of the household                  | Yours, 24 Oct  |
| Channel           | Email through the `EMAIL` binding              | Yours, 24 Oct  |
| Form              | One daily digest per person                    | Yours, 24 Oct  |
| Send time         | 07:00 in each member's time zone               | Named default  |
| Duplicate sends   | A `digest_sends` row per member and day        | Named default  |

## Slices

1. **Members.** A `members` table with name, email and time zone, and a
   Members screen to add and remove people. Touches `migrations/`,
   `src/members.ts`, `src/routes/members.ts` and `docs/architecture.md`.
   Size M. Design stop: the table. Lane A.
2. **Digest contents.** A pure `listDigest(tasks, today)` in `src/tasks.ts`
   that returns overdue tasks and tasks due tomorrow, with unit tests, and a
   preview of the digest on the task list. Touches `src/tasks.ts`,
   `src/routes/tasks.ts` and `docs/architecture.md`. Size S. Lane B.
3. **Scheduled send.** An hourly Cron Trigger that sends each member their
   digest at 07:00 local time and records `digest_sends`. Needs slices 1
   and 2. Touches `src/cron.ts`, `migrations/` and `docs/architecture.md`.
   Size M. Design stop: the send log. Lane A after B.

## Lanes

Slices 1 and 2 can run in parallel. Slice 3 starts when both have merged.
