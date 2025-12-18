// src/services/requestQueue.ts

let chain: Promise<void> = Promise.resolve();

/**
 * Enfileira tarefas para rodarem uma por vez (serialização).
 * Ajuda a reduzir 429 quando o usuário clica rápido ou dispara várias gerações.
 */
export function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(task, task);
  chain = run.then(() => undefined, () => undefined);
  return run;
}

