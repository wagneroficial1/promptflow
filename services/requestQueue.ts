// Uma fila simples: executa 1 tarefa por vez, na ordem.
let chain = Promise.resolve();

export function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(task);

  // Mantém a fila viva mesmo se der erro
  chain = run.catch(() => {});

  return run;
}
