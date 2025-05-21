document.addEventListener('DOMContentLoaded', () => {
    const algorithmSelect = document.getElementById('algorithm-select');
    const graphTypeSelect = document.getElementById('graph-type-select');
    const numNodesInput = document.getElementById('num-nodes');
    const startNodeInput = document.getElementById('start-node');
    const endNodeInput = document.getElementById('end-node');
    const runButton = document.getElementById('run-button');
    const resetButton = document.getElementById('reset-button');
    const svg = document.getElementById('graph-svg');
    const logOutput = document.getElementById('log-output');

    const svgWidth = svg.clientWidth;
    const svgHeight = svg.clientHeight;
    const nodeRadius = 15;

    let nodes = [];
    let edges = [];
    let currentGraphType = '';
    let currentNumNodes = 0;

    function logMessage(message) {
        logOutput.value += message + '\n';
        logOutput.scrollTop = logOutput.scrollHeight;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function clearGraph() {
        svg.innerHTML = '';
        nodes = [];
        edges = [];
    }
    
    function clearLog() {
        logOutput.value = '';
    }

    function generateNodePositions(numNodes, type) {
        const tempNodes = [];
        const centerX = svgWidth / 2;
        const centerY = svgHeight / 2;
        const radius = Math.min(svgWidth, svgHeight) / 2 - 50;

        for (let i = 0; i < numNodes; i++) {
            let x, y;
            if (type === 'cycle' || type === 'complete' || type.includes('random')) {
                const angle = (i / numNodes) * 2 * Math.PI;
                x = centerX + radius * Math.cos(angle);
                y = centerY + radius * Math.sin(angle);
            } else if (type === 'path') {
                x = (svgWidth / (numNodes + 1)) * (i + 1);
                y = centerY;
            } else if (type === 'star') {
                if (i === 0) { // Central node
                    x = centerX;
                    y = centerY;
                } else {
                    const angle = ((i - 1) / (numNodes - 1)) * 2 * Math.PI;
                    x = centerX + radius * 0.7 * Math.cos(angle);
                    y = centerY + radius * 0.7 * Math.sin(angle);
                }
            } else if (type === 'grid') {
                const gridSize = Math.ceil(Math.sqrt(numNodes));
                const col = i % gridSize;
                const row = Math.floor(i / gridSize);
                const spacingX = svgWidth / (gridSize + 1);
                const spacingY = svgHeight / (gridSize + 1);
                x = spacingX * (col + 1);
                y = spacingY * (row + 1);
            } else if (type === 'bipartite') {
                const half = Math.floor(numNodes / 2);
                const part = i < half ? 0 : 1;
                if (part === 0) {
                    x = svgWidth * 0.25;
                    y = (svgHeight / (half + 1)) * (i + 1);
                } else {
                    x = svgWidth * 0.75;
                    y = (svgHeight / ((numNodes - half) + 1)) * ( (i-half) + 1);
                }
            } else if (type === 'binary_tree') {
                 // Simple layered positioning for binary tree
                const levels = Math.floor(Math.log2(numNodes)) + 1;
                let level = 0;
                let nodesInLevel = 1;
                let countInLevel = 0;
                let assigned = 0;
                
                for(let k=0; k<numNodes; k++){
                    if(countInLevel >= nodesInLevel) {
                        level++;
                        nodesInLevel *=2;
                        countInLevel = 0;
                    }
                    const yPos = (svgHeight / (levels + 1)) * (level + 1);
                    const xPos = (svgWidth / (nodesInLevel + 1)) * (countInLevel + 1);
                    tempNodes.push({ id: k, x: xPos, y: yPos, fill: 'lightblue' });
                    countInLevel++;
                }
                return tempNodes;

            } else { // Default fallback (circular)
                const angle = (i / numNodes) * 2 * Math.PI;
                x = centerX + radius * Math.cos(angle);
                y = centerY + radius * Math.sin(angle);
            }
            tempNodes.push({ id: i, x, y, fill: 'lightblue' });
        }
        return tempNodes;
    }

    function generateGraph(type, numNodesVal) {
        clearGraph();
        clearLog();
        logMessage(`Generating ${type} graph with ${numNodesVal} nodes.`);
        
        currentGraphType = type;
        currentNumNodes = numNodesVal;

        nodes = generateNodePositions(numNodesVal, type);
        
        // Adjust endNodeInput max value
        endNodeInput.max = numNodesVal - 1;
        if (parseInt(endNodeInput.value) >= numNodesVal) {
            endNodeInput.value = numNodesVal - 1;
        }
         if (parseInt(startNodeInput.value) >= numNodesVal) {
            startNodeInput.value = numNodesVal - 1;
        }


        if (type === 'path') {
            for (let i = 0; i < numNodesVal - 1; i++) {
                edges.push({ source: nodes[i], target: nodes[i+1], weight: Math.floor(Math.random() * 10) + 1 });
            }
        } else if (type === 'cycle') {
            for (let i = 0; i < numNodesVal - 1; i++) {
                edges.push({ source: nodes[i], target: nodes[i+1], weight: Math.floor(Math.random() * 10) + 1 });
            }
            edges.push({ source: nodes[numNodesVal-1], target: nodes[0], weight: Math.floor(Math.random() * 10) + 1 });
        } else if (type === 'complete') {
            for (let i = 0; i < numNodesVal; i++) {
                for (let j = i + 1; j < numNodesVal; j++) {
                    edges.push({ source: nodes[i], target: nodes[j], weight: Math.floor(Math.random() * 10) + 1 });
                }
            }
        } else if (type === 'star') {
            if (numNodesVal > 0) {
                for (let i = 1; i < numNodesVal; i++) {
                    edges.push({ source: nodes[0], target: nodes[i], weight: Math.floor(Math.random() * 10) + 1 });
                }
            }
        } else if (type === 'grid') {
            const gridSize = Math.ceil(Math.sqrt(numNodesVal));
            for (let r = 0; r < gridSize; r++) {
                for (let c = 0; c < gridSize; c++) {
                    const currentIndex = r * gridSize + c;
                    if (currentIndex >= numNodesVal) continue;
                    // Connect to right neighbor
                    if (c < gridSize - 1 && (currentIndex + 1 < numNodesVal)) {
                         if((r * gridSize + c+1) < numNodesVal) // ensure target node exists if not a perfect square
                            edges.push({ source: nodes[currentIndex], target: nodes[currentIndex + 1], weight: Math.floor(Math.random() * 10) + 1 });
                    }
                    // Connect to bottom neighbor
                    if (r < gridSize - 1 && (currentIndex + gridSize < numNodesVal)) {
                         if(( (r+1) * gridSize + c) < numNodesVal ) // ensure target node exists if not a perfect square
                            edges.push({ source: nodes[currentIndex], target: nodes[currentIndex + gridSize], weight: Math.floor(Math.random() * 10) + 1 });
                    }
                }
            }
        } else if (type === 'bipartite') {
            const half = Math.floor(numNodesVal / 2);
            for (let i = 0; i < half; i++) {
                for (let j = half; j < numNodesVal; j++) {
                     edges.push({ source: nodes[i], target: nodes[j], weight: Math.floor(Math.random() * 10) + 1 });
                }
            }
        } else if (type === 'binary_tree') {
            for (let i = 0; i < numNodesVal; i++) {
                const leftChildIdx = 2 * i + 1;
                const rightChildIdx = 2 * i + 2;
                if (leftChildIdx < numNodesVal) {
                    edges.push({ source: nodes[i], target: nodes[leftChildIdx], weight: Math.floor(Math.random() * 10) + 1 });
                }
                if (rightChildIdx < numNodesVal) {
                    edges.push({ source: nodes[i], target: nodes[rightChildIdx], weight: Math.floor(Math.random() * 10) + 1 });
                }
            }
        }
        else if (type === 'sparse' || type === 'dense') {
            const p = (type === 'sparse') ? 0.2 : 0.6; // Probability of edge creation
            for (let i = 0; i < numNodesVal; i++) {
                for (let j = i + 1; j < numNodesVal; j++) {
                    if (Math.random() < p) {
                        edges.push({ source: nodes[i], target: nodes[j], weight: Math.floor(Math.random() * 10) + 1 });
                    }
                }
            }
            // Basic check for connectivity - if not connected, add a few more edges. This is a simplification.
            if (nodes.length > 0 && !isConnected(nodes, edges) && type ==='sparse') {
                logMessage("Graph might be disconnected. Adding a few spanning edges for sparse graph.");
                for(let i = 0; i < numNodesVal -1; i++) { // create a path to ensure connectivity
                    if (!edges.find(e => (e.source.id === i && e.target.id === i+1) || (e.source.id === i+1 && e.target.id === i))) {
                         edges.push({ source: nodes[i], target: nodes[i+1], weight: Math.floor(Math.random() * 10) + 1 });
                    }
                }
            }
        }


        drawGraph();
    }
    
    // Basic connectivity check (BFS) - simplified
    function isConnected(nodesToTest, edgesToTest) {
        if (nodesToTest.length === 0) return true;
        const adj = new Map();
        nodesToTest.forEach(node => adj.set(node.id, []));
        edgesToTest.forEach(edge => {
            adj.get(edge.source.id).push(edge.target.id);
            adj.get(edge.target.id).push(edge.source.id);
        });

        const visited = new Set();
        const queue = [nodesToTest[0].id];
        visited.add(nodesToTest[0].id);

        while (queue.length > 0) {
            const u = queue.shift();
            for (const v of adj.get(u)) {
                if (!visited.has(v)) {
                    visited.add(v);
                    queue.push(v);
                }
            }
        }
        return visited.size === nodesToTest.length;
    }


    function drawGraph(pathEdges = []) {
        svg.innerHTML = ''; // Clear previous drawing

        // Draw edges first (so they are under nodes)
        edges.forEach(edge => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', edge.source.x);
            line.setAttribute('y1', edge.source.y);
            line.setAttribute('x2', edge.target.x);
            line.setAttribute('y2', edge.target.y);
            line.setAttribute('class', 'edge');
            line.setAttribute('id', `edge-${edge.source.id}-${edge.target.id}`);
            if (pathEdges.some(pe => (pe.source.id === edge.source.id && pe.target.id === edge.target.id) || (pe.source.id === edge.target.id && pe.target.id === edge.source.id) )) {
                line.style.stroke = 'red';
                line.style.strokeWidth = '3px';
            }
            svg.appendChild(line);

            // Draw edge weight
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', (edge.source.x + edge.target.x) / 2);
            text.setAttribute('y', (edge.source.y + edge.target.y) / 2 - 5); // offset slightly
            text.setAttribute('class', 'edge-weight');
            text.textContent = edge.weight;
            svg.appendChild(text);
        });

        // Draw nodes
        nodes.forEach(node => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', nodeRadius);
            circle.setAttribute('fill', node.fill || 'lightblue');
            circle.setAttribute('class', 'node');
            circle.setAttribute('id', `node-${node.id}`);
            svg.appendChild(circle);

            // Draw node labels
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', node.x);
            label.setAttribute('y', node.y);
            label.setAttribute('class', 'node-label');
            label.textContent = node.id;
            svg.appendChild(label);
        });
    }
    
    function updateNodeColor(nodeId, color) {
        const nodeElement = document.getElementById(`node-${nodeId}`);
        if (nodeElement) {
            nodeElement.setAttribute('fill', color);
        }
    }

    function updateEdgeColor(sourceId, targetId, color) {
        let edgeElement = document.getElementById(`edge-${sourceId}-${targetId}`);
        if (!edgeElement) { // Check reverse direction for undirected graphs
             edgeElement = document.getElementById(`edge-${targetId}-${sourceId}`);
        }
        if (edgeElement) {
            edgeElement.style.stroke = color;
            edgeElement.style.strokeWidth = '3px';
        }
    }
    
    async function dijkstra(startNodeId, endNodeId) {
        logMessage(`Starting Dijkstra's from node ${startNodeId} to ${endNodeId}.`);
        if (nodes.length === 0) {
            logMessage("Graph is empty. Please generate a graph first.");
            return;
        }
        if (startNodeId < 0 || startNodeId >= nodes.length || endNodeId < 0 || endNodeId >= nodes.length) {
            logMessage("Invalid start or end node ID.");
            return;
        }


        const dist = new Array(nodes.length).fill(Infinity);
        const prev = new Array(nodes.length).fill(null);
        const pq = new Set(); // Using a Set as a simple priority queue substitute

        dist[startNodeId] = 0;
        nodes.forEach(node => pq.add(node.id));
        
        updateNodeColor(startNodeId, 'yellow'); // Mark start node
        await sleep(500);

        while (pq.size > 0) {
            // Get node with smallest distance from pq
            let u = -1;
            let minD = Infinity;
            for (const nodeId of pq) {
                if (dist[nodeId] < minD) {
                    minD = dist[nodeId];
                    u = nodeId;
                }
            }

            if (u === -1) break; // No path or remaining nodes are unreachable

            pq.delete(u);
            logMessage(`Visiting node ${u}, current distance: ${dist[u] === Infinity ? "Infinity" : dist[u]}`);
            updateNodeColor(u, 'orange'); // Mark visited
            await sleep(500);

            if (u === endNodeId) {
                logMessage(`Reached destination node ${endNodeId}!`);
                break; // Found shortest path to destination
            }

            const neighbors = edges.filter(edge => edge.source.id === u || edge.target.id === u);

            for (const edge of neighbors) {
                const vNode = (edge.source.id === u) ? edge.target : edge.source;
                const v = vNode.id;

                if (pq.has(v)) { // Only consider nodes still in the priority queue
                    updateEdgeColor(u,v, 'lightgreen'); // Highlight edge being considered
                    await sleep(300);

                    const alt = dist[u] + edge.weight;
                    if (alt < dist[v]) {
                        dist[v] = alt;
                        prev[v] = u;
                        logMessage(`  Updating dist to ${v} via ${u} to ${alt}. Edge weight: ${edge.weight}`);
                        updateNodeColor(v, 'pink'); // Mark node whose distance is updated
                        updateEdgeColor(u,v, 'green'); // Highlight edge in potential path
                        await sleep(500);
                         updateNodeColor(v, 'lightblue'); // Reset color or keep pink if you prefer
                    } else {
                         updateEdgeColor(u,v, '#aaa'); // Dim edge not taken for shorter path
                         await sleep(300);
                    }
                }
            }
            updateNodeColor(u, 'gray'); // Mark processed
        }

        // Reconstruct and highlight path
        if (dist[endNodeId] === Infinity) {
            logMessage(`No path found from ${startNodeId} to ${endNodeId}.`);
            return;
        }

        const path = [];
        let curr = endNodeId;
        while (curr !== null) {
            path.unshift(curr);
            if (prev[curr] !== null) {
                const prevNode = prev[curr];
                updateEdgeColor(prevNode, curr, 'red');
                updateNodeColor(curr, 'red');
            }
            curr = prev[curr];
        }
        updateNodeColor(startNodeId, 'red'); // Ensure start is red if part of path
        logMessage(`Shortest path: ${path.join(' -> ')}. Total distance: ${dist[endNodeId]}`);
        
        // Draw the final graph with the highlighted path
        const pathEdgesToHighlight = [];
        for(let i=0; i < path.length -1; i++) {
            const sourceNode = nodes.find(n => n.id === path[i]);
            const targetNode = nodes.find(n => n.id === path[i+1]);
            const edge = edges.find(e => (e.source.id === sourceNode.id && e.target.id === targetNode.id) || (e.source.id === targetNode.id && e.target.id === sourceNode.id));
            if(edge) pathEdgesToHighlight.push(edge);
        }
        drawGraph(pathEdgesToHighlight); // Redraw with final path
        nodes.forEach(n => updateNodeColor(n.id, path.includes(n.id) ? 'red' : 'gray')); // Color nodes on path
        updateNodeColor(startNodeId, 'yellow'); // Re-color start node for emphasis
        updateNodeColor(endNodeId, 'purple');   // Re-color end node for emphasis
    }


    function floydWarshall() {
        logMessage("Floyd-Warshall Algorithm Selected.");
        logMessage("This algorithm finds all-pairs shortest paths.");
        logMessage("Visualization would typically involve showing the distance matrix updating,");
        logMessage("or highlighting paths between selected pairs after computation.");
        logMessage("Complexity: O(V^3). Implementation not included in this demo.");
        // Actual implementation would involve initializing a distance matrix
        // and iterating through all k, then i, then j.
        // dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    }

    async function prim() {
        logMessage("Prim's Algorithm (MST) Selected.");
        logMessage("This algorithm finds a Minimum Spanning Tree.");
        if (nodes.length === 0) {
            logMessage("Graph is empty. Please generate a graph first.");
            return;
        }

        const mstEdges = [];
        const visited = new Array(nodes.length).fill(false);
        const minEdge = new Array(nodes.length).fill(null).map(() => ({weight: Infinity, from: -1, to: -1, edgeRef: null}));
        
        // Start from node 0 (can be arbitrary)
        minEdge[0].weight = 0;
        let totalMstWeight = 0;

        for (let i = 0; i < nodes.length; i++) {
            let u = -1;
            // Find unvisited node with smallest edge weight to connect to MST
            for (let v_idx = 0; v_idx < nodes.length; v_idx++) {
                if (!visited[v_idx] && (u === -1 || minEdge[v_idx].weight < minEdge[u].weight)) {
                    u = v_idx;
                }
            }

            if (u === -1 || minEdge[u].weight === Infinity) {
                 // Check if all reachable nodes are visited
                const allVisitedOrUnreachable = nodes.every((node, idx) => visited[idx] || minEdge[idx].weight === Infinity);
                if (!allVisitedOrUnreachable && i < nodes.length -1) { // If graph is disconnected and not all nodes are processed
                     logMessage(`Graph might be disconnected. MST cannot span all nodes. Nodes processed: ${i}`);
                }
                break; // No more nodes can be added / graph disconnected
            }

            visited[u] = true;
            if (minEdge[u].edgeRef) { // Don't add for the starting node's 0-weight
                mstEdges.push(minEdge[u].edgeRef);
                totalMstWeight += minEdge[u].weight;
                updateNodeColor(minEdge[u].from, 'teal');
                updateNodeColor(minEdge[u].to, 'teal');
                updateEdgeColor(minEdge[u].from, minEdge[u].to, 'teal');
                logMessage(`Adding edge (${minEdge[u].from}-${minEdge[u].to}) weight ${minEdge[u].weight} to MST.`);
                await sleep(500);
            } else if (i===0) { // Color the starting node
                 updateNodeColor(u, 'teal');
                 await sleep(500);
            }


            // Update minEdge for adjacent nodes
            const neighbors = edges.filter(edge => edge.source.id === u || edge.target.id === u);
            for (const edge of neighbors) {
                const vNode = (edge.source.id === u) ? edge.target : edge.source;
                const v = vNode.id;
                if (!visited[v] && edge.weight < minEdge[v].weight) {
                    minEdge[v] = {weight: edge.weight, from: u, to: v, edgeRef: edge};
                    logMessage(`  Considering edge (${u}-${v}) weight ${edge.weight} for node ${v}.`);
                    updateEdgeColor(u,v, 'lightgreen'); // Highlight considered edge
                     await sleep(200);
                }
            }
        }
        logMessage(`Prim's MST construction complete. Total weight: ${totalMstWeight}`);
        logMessage(`MST Edges: ${mstEdges.map(e => `(${e.source.id}-${e.target.id} w:${e.weight})`).join(', ')}`);
    }
    
    async function kruskal() {
        logMessage("Kruskal's Algorithm (MST) Selected.");
        logMessage("This algorithm finds a Minimum Spanning Tree by adding edges in increasing order of weight if they don't form a cycle.");
         if (nodes.length === 0) {
            logMessage("Graph is empty. Please generate a graph first.");
            return;
        }

        const mstEdges = [];
        let totalMstWeight = 0;
        
        // Parent array for Union-Find
        const parent = Array(nodes.length).fill(0).map((_, i) => i);
        function find(i) {
            if (parent[i] === i) return i;
            return parent[i] = find(parent[i]);
        }
        function union(i, j) {
            const rootI = find(i);
            const rootJ = find(j);
            if (rootI !== rootJ) {
                parent[rootI] = rootJ;
                return true; // Union successful
            }
            return false; // Already in the same set (cycle)
        }

        const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
        
        for(const node of nodes) { // Initially color all nodes
            updateNodeColor(node.id, 'lightgray');
        }
        await sleep(300);

        for (const edge of sortedEdges) {
            logMessage(`Considering edge (${edge.source.id}-${edge.target.id}) with weight ${edge.weight}`);
            updateEdgeColor(edge.source.id, edge.target.id, 'orange'); // Highlight current edge
            await sleep(400);

            if (union(edge.source.id, edge.target.id)) {
                mstEdges.push(edge);
                totalMstWeight += edge.weight;
                updateNodeColor(edge.source.id, 'darkgreen');
                updateNodeColor(edge.target.id, 'darkgreen');
                updateEdgeColor(edge.source.id, edge.target.id, 'darkgreen'); // Add to MST
                logMessage(`  Added edge (${edge.source.id}-${edge.target.id}) to MST.`);
                await sleep(500);
            } else {
                logMessage(`  Edge (${edge.source.id}-${edge.target.id}) forms a cycle. Skipping.`);
                updateEdgeColor(edge.source.id, edge.target.id, '#ccc'); // Dim skipped edge
                await sleep(400);
            }
             if (mstEdges.length === nodes.length - 1 && nodes.length > 0) break; // MST is complete
        }
        
        if(mstEdges.length < nodes.length -1 && nodes.length > 0 && !isConnected(nodes, mstEdges)){
             logMessage("Graph might be disconnected. Kruskal found an MST for a connected component.");
        }
        logMessage(`Kruskal's MST construction complete. Total weight: ${totalMstWeight}`);
        logMessage(`MST Edges: ${mstEdges.map(e => `(${e.source.id}-${e.target.id} w:${e.weight})`).join(', ')}`);
    }


    runButton.addEventListener('click', () => {
        const algo = algorithmSelect.value;
        const startNodeId = parseInt(startNodeInput.value);
        const endNodeId = parseInt(endNodeInput.value);
        const numNodesVal = parseInt(numNodesInput.value);

        // Regenerate graph if type or numNodes changed, or if it's the first run.
        // Or if no graph exists
        if (currentGraphType !== graphTypeSelect.value || currentNumNodes !== numNodesVal || nodes.length === 0) {
             generateGraph(graphTypeSelect.value, numNodesVal);
        } else {
            // Reset colors if graph is reused
            drawGraph(); 
            clearLog();
            logMessage("Reusing existing graph structure. Resetting colors.");
        }


        if (algo === 'dijkstra') {
            if (startNodeId < 0 || startNodeId >= nodes.length || endNodeId < 0 || endNodeId >= nodes.length ) {
                 logMessage(`Invalid start (${startNodeId}) or end (${endNodeId}) node for ${nodes.length} nodes. Please select values between 0 and ${nodes.length-1}.`);
                 return;
            }
            dijkstra(startNodeId, endNodeId);
        } else if (algo === 'floyd-warshall') {
            floydWarshall();
        } else if (algo === 'prim') {
            prim();
        } else if (algo === 'kruskal') {
            kruskal();
        }
    });
    
    resetButton.addEventListener('click', () => {
        const numNodesVal = parseInt(numNodesInput.value);
        generateGraph(graphTypeSelect.value, numNodesVal); // Regenerate with current settings
        logMessage("Graph reset with current settings.");
    });

    // Initial graph generation
    generateGraph(graphTypeSelect.value, parseInt(numNodesInput.value));
});
