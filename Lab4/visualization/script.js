
let network = null;
let allNodes = null;
let visNodes;

class Logger {
  constructor(outputElement) {
    this.outputElement = outputElement;
    this.steps = [];
  }

  log(message) {
    this.steps.push(message);
    if (this.outputElement) {
      this.outputElement.textContent += message + '\n';
      this.outputElement.scrollTop = this.outputElement.scrollHeight; // Auto-scroll
    }
  }

  clear() {
    this.steps = [];
    if (this.outputElement) {
      this.outputElement.textContent = '';
    }
  }

  getLogs() {
    return this.steps.join('\n');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function highlightNode(nodeId) {
  if (!allNodes) return;
  allNodes.update({ id: nodeId, color: { background: 'yellow' } });
}

function resetNodeColors() {
  if (!allNodes) return;
  allNodes.get().forEach(n => {
    allNodes.update({ id: n.id, color: '#97C2FC' });
  });
}

function generateDirectedGraph(width, depth) {
  const graph = {};
  let nodeCount = 1;

  function createNodeName(index) {
    return 'N' + index;
  }

  function addChildren(parent, currentDepth) {
    if (currentDepth >= depth) return;
    graph[parent] = [];

    for (let i = 0; i < width; i++) {
      const child = createNodeName(nodeCount++);
      graph[parent].push(child);
      addChildren(child, currentDepth + 1);
    }
  }

  const root = createNodeName(0);
  addChildren(root, 0);

  // Ensure all nodes exist
  Object.values(graph).flat().forEach(child => {
    if (!graph.hasOwnProperty(child)) graph[child] = [];
  });

  return { graph, start: root };
}

async function bfsPath(graph, start, target, logger) {
  const queue = [[start]];
  const visited = new Set();
  logger.log(`Start BFS from ${start} to find ${target}`);

  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];
    logger.log(`Dequeued path: ${path.join(' -> ')}`);

    if (!visited.has(node)) {
      logger.log(`Visiting: ${node}`);
      visited.add(node);
      await highlightNode(node);
      await sleep(500);
      if (node === target) {
        logger.log(`Target ${target} found!`);
        return path;
      }

      for (const neighbor of graph[node]) {
        logger.log(`Queueing: ${neighbor} from ${node}`);
        queue.push([...path, neighbor]);
      }
    }
  }

  logger.log(`Target ${target} not found.`);
  return null;
}

async function dfsPath(graph, start, target, logger) {
  const stack = [[start]];
  const visited = new Set();
  logger.log(`Start DFS from ${start} to find ${target}`);

  while (stack.length > 0) {
    const path = stack.pop();
    const node = path[path.length - 1];
    logger.log(`Popped path: ${path.join(' -> ')}`);

    if (!visited.has(node)) {
      logger.log(`Visiting: ${node}`);
      visited.add(node);
      await highlightNode(node);
      await sleep(500);
      if (node === target) {
        logger.log(`Target ${target} found!`);
        return path;
      }

      for (const neighbor of graph[node]) {
        logger.log(`Stacking: ${neighbor} from ${node}`);
        stack.push([...path, neighbor]);
      }
    }
  }

  logger.log(`Target ${target} not found.`);
  return null;
}

function visualizeGraph(graph) {
  const nodes = [];
  const edges = [];

  for (const node in graph) {
    nodes.push({ id: node, label: node, color: '#97C2FC' }); // Default blue
    for (const neighbor of graph[node]) {
      edges.push({ from: node, to: neighbor, arrows: 'to' });
    }
  }

  const container = document.getElementById('graphContainer');
  const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
  const options = {
    layout: { hierarchical: { direction: 'UD', sortMethod: 'directed' } },
    edges: { arrows: 'to' },
    physics: false
  };

  network = new vis.Network(container, data, options);
  allNodes = data.nodes;
}

async function runGraphSearch() {
  const width = parseInt(document.getElementById('width').value);
  const depth = parseInt(document.getElementById('depth').value);
  const target = document.getElementById('target').value;
  const algorithm = document.getElementById('algorithm').value;

  resetNodeColors();

  const bfsLogEl = document.getElementById('bfsLog');
  const dfsLogEl = document.getElementById('dfsLog');

  const { graph, start } = generateDirectedGraph(width, depth);
  visualizeGraph(graph);

  const bfsLogger = new Logger(bfsLogEl);
  const dfsLogger = new Logger(dfsLogEl);

  bfsLogger.clear();
  dfsLogger.clear();

  if (algorithm === 'bfs') {
    await bfsPath(graph, start, target, bfsLogger);
  } else {
    await dfsPath(graph, start, target, dfsLogger);
  }
}
