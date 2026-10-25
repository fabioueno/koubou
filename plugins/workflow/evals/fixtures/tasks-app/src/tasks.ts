export interface Task {
  id: string;
  title: string;
  dueOn: string | null;
  done: boolean;
  householdId: string;
}

export function listDue(tasks: Task[], today: string): Task[] {
  return tasks.filter((task) => !task.done && task.dueOn !== null && task.dueOn <= today);
}
