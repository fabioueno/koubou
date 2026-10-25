# Architecture

The API runs on Cloudflare Workers. D1 stores tasks in one `tasks` table with
`id`, `title`, `due_on` (an ISO day, or null), `done` and `household_id`.
Every household member sees and edits every task of their household. Email
goes out through the Workers `EMAIL` binding; nothing schedules work yet.

## Daily digest

`listDigest(tasks, today)` in `src/tasks.ts` decides what each morning's email
lists: the open tasks due before `today`, oldest first, and the open tasks due
the day after. A task due today is in neither list, because the email of the
day before listed it as due tomorrow. The caller passes `today` in the
member's own time zone.
