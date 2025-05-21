import {bfs} from "./algorithms/bfs.js"
import {dfs} from "./algorithms/dfs.js"
import {Logger} from "./utils/logger.js"
import {generateDirectedGraph} from "./utils/generateGraph.js"
import {bench} from "./utils/bench.js"

const { graph, start } = generateDirectedGraph(20, 4); // width=2, depth=3 w^d nodes
const logger = new Logger();

const target = 'N1'; // you can dynamically select a node
// console.log('--- BFS ---');
// const bfsResult = bfs(graph, start, target, logger);
// console.log('Path:', bfsResult);
//
// console.log('\n--- DFS ---');
// const dfsResult = dfs(graph, start, target, logger);
// console.log('Path:', dfsResult);
bench(20,4)
bench(19,4)
bench(12,5)
bench(10,5)
bench(8,6)
bench(6,7)
bench(5,8)
bench(4,9)
bench(3,11)
