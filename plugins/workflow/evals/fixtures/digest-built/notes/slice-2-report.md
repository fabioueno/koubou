# Slice 2: Digest contents, build report

## What you can try

Run `pnpm vitest run src/tasks.test.ts`. Nothing is visible in the app until
slice 3 sends the email.

## Checks

- `pnpm vitest run src/tasks.test.ts`: 4 tests passed.
- `pnpm tsc --noEmit`: no errors.
- Manual check: skipped, nothing to see yet.

## Named defaults

- Overdue tasks come oldest first. Tasks due tomorrow keep their order.
- Tomorrow is computed in UTC from the ISO day, so month and year ends work.

## Open questions

None.

## Differences from the plan

The preview on the task list is left out: that screen does not exist yet.

Nothing is staged or committed.
