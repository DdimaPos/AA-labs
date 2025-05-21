import { Logger } from "../utils/logger.js";

export function dfs(graph, start, target, logger = new Logger()) {
  const stack = [[start]];
  const visited = new Set();

  // logger.log(`Start DFS from ${start} to find ${target}`);

  while (stack.length > 0) {
    const path = stack.pop();
    const node = path[path.length - 1];
    // logger.log(`Popped path: ${path.join(' -> ')}`);

    if (!visited.has(node)) {
      // logger.log(`Visiting: ${node}`);
      visited.add(node);

      if (node === target) {
        // logger.log(`Target ${target} found!`);
        return path;
      }

      for (const neighbor of graph[node]) {
        // logger.log(`Stacking: ${neighbor} from ${node}`);
        stack.push([...path, neighbor]);
      }
    }
  }

  logger.log(`Target ${target} not found.`);
  return null;
}
