// A ping forks the conversation; its own steps are not the main loop
// working, so the step and completion hooks check this before counting them.
export const ping = { isRunning: false };
