import {Logger} from "./../utils/logger.js"

export function bfs(graph, start, target, logger = new Logger()) {
  const queue = [[start]];
  const visited = new Set();

  // logger.log(`Start BFS from ${start} to find ${target}`);

  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];
    // logger.log(`Dequeued path: ${path.join(' -> ')}`);

    if (!visited.has(node)) {
      // logger.log(`Visiting: ${node}`);
      visited.add(node);

      if (node === target) {
        // logger.log(`Target ${target} found!`);
        return path;
      }

      for (const neighbor of graph[node]) {
        // logger.log(`Queueing: ${neighbor} from ${node}`);
        queue.push([...path, neighbor]);
      }
    }
  }

  logger.log(`Target ${target} not found.`);
  return null;
}
