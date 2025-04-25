import { Logger } from "./logger.js";
import { writeData } from "./writeData.js";
import { bfs } from "../algorithms/bfs.js";
import { dfs } from "../algorithms/dfs.js";
import { generateDirectedGraph } from "./generateGraph.js";

export function bench(width, depth) {
  var nToSearch = Array.from({ length: depth }, (_, i) => i + 1);
  var perfBfs = [];
  var perfDfs = [];
  var startT, end;
  var logger = new Logger();
  const { graph, start } = generateDirectedGraph(width, depth); // width=2, depth=3 w^d nodes

  nToSearch.forEach((node) => {
    startT = performance.now();
    bfs(graph, start, `N${node}`, logger);
    end = performance.now();
    perfBfs.push(Math.floor(end - startT));

    startT = performance.now();
    dfs(graph, start, `N${node}`, logger);
    end = performance.now();
    perfDfs.push(Math.floor(end - startT));
  });

  writeData("bfs", width, depth, JSON.stringify(perfBfs));
  writeData("dfs", width, depth, JSON.stringify(perfDfs));
}
