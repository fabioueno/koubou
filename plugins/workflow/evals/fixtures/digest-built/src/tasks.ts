export interface Task {
  id: string;
  title: string;
  dueOn: string | null;
  done: boolean;
  householdId: string;
}

export interface Digest {
  overdue: Task[];
  dueTomorrow: Task[];
}

export function listDue(tasks: Task[], today: string): Task[] {
  return tasks.filter((task) => !task.done && task.dueOn !== null && task.dueOn <= today);
}

export function listDigest(tasks: Task[], today: string): Digest {
  const tomorrow = nextDay(today);
  const open = tasks.filter((task) => !task.done && task.dueOn !== null);

  return {
    overdue: open.filter((task) => task.dueOn! < today).sort(byDueOn),
    dueTomorrow: open.filter((task) => task.dueOn === tomorrow),
  };
}

function nextDay(day: string): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function byDueOn(a: Task, b: Task): number {
  return a.dueOn!.localeCompare(b.dueOn!);
}
