# Architecture

The API runs on Cloudflare Workers. D1 stores tasks in one `tasks` table with
`id`, `title`, `due_on` (an ISO day, or null), `done` and `household_id`. Every
household member sees and edits every task of their household. The Workers
`EMAIL` binding sends email. Nothing schedules work yet.
