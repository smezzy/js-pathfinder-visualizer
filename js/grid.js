function Vec3(x, y) {
    this.x = x;
    this.y = y;
}

function PathNode (node, type) {
    this.node = node;
    this.type = type;
}

let Grid = (function() {
    let grid;
    let width, height;
    let nodeSize = 24;
    let nodeBorder = 1;
    let path = [];

    let mouseDown = 0;
    document.addEventListener('mousedown', () => {
        mouseDown++;
    });
    document.addEventListener('mouseup', () => {
        mouseDown--;
    });

    const initializeGrid = (wid, hei) => {
        width = wid;
        height = hei;
        grid = document.querySelector('.grid');
        renderGrid();
        grid.addEventListener('click', function (action) {
            if(action.target.classList.contains('node')) {
                onNodeClicked(action);
            }
        })
        let children = document.querySelectorAll('.empty');
        children.forEach((node) => {
            node.addEventListener('mouseenter', () => {
                if (mouseDown > 0) {
                    node.classList = 'node selected';
                }
            })
        })
    }
    
    const renderGrid = () => {
        for (let y = 0; y < height; y++) {
            let tempArray = [];
            for(let x = 0; x < width; x++) {
                let node = document.createElement('div');
                node.className = 'node empty'
                node.style.width = `${nodeSize}px`;
                node.style.height = `${nodeSize}px`;
                node.id = `${x}-${y}`
                node.style.left = `${1 + nodeSize * x + x * nodeBorder}px`;
                node.style.top = `${1 + nodeSize * y + y * nodeBorder}px`;
                grid.appendChild(node); 
            }
        }
        
        grid.style.width = `${nodeSize * width + width * nodeBorder}px`;
        grid.style.height = `${nodeSize * height + height * nodeBorder}px`;
    }

    const selectNodeByPosition = (x, y, type) => {
        let node = document.getElementById(x + '-' + y);

        if (type != 'goal' && type != 'start') {
            if(node.classList.contains('goal') || node.classList.contains('start')) return;
            selectNode(node, type);
        }
        
        selectNode(node, type);

    }

    const getNodeByPosition = (x, y) => {
        let node = document.getElementById(x + '-' + y);
        return {
            node: node,
            position: new Vec3(x, y),
        };
    }


    const selectNode = (node, type) => {
        node.classList = 'node ' + type;

    }

    const pushToPath = (_node, type) => {
        let pathNode = new PathNode(_node, type);
        path.push(pathNode);     
    }

    const displayPath = () => {
        let index = 0;
        (function(i){
            setTimeout(() => {
                if (i >= path.length) return;
                let _node = path[index];
                _node.node.classList = 'node ' + _node.type;
                index++;
                arguments.callee(index);
            }, 35);
        })(index);
    }

    let goalSelected = false;
    let startSelected = false;

    const onNodeClicked = (action) => {
        let clickedNode = action.target;
        let isSelected = clickedNode.classList.contains('selected');
        let isStart = clickedNode.classList.contains('start');
        let isGoal = clickedNode.classList.contains('goal');

        if (isGoal) {
            startSelected - false;
            goalSelected = true;
            selectNode(clickedNode, 'empty');
            return;
        } else if (isStart) {
            goalSelected = false;
            startSelected = true;
            selectNode(clickedNode, 'empty');
            return;
        }

        if(goalSelected) {
            selectNode(clickedNode, 'goal');
            let coords = clickedNode.id.split('-');
            Astar.setGoal(null, new Vec3(parseInt(coords[0]), parseInt(coords[1])));
            return;
        } else if (startSelected) {
            selectNode(clickedNode, 'start');
            let coords = clickedNode.id.split('-');
            Astar.setGoal(new Vec3(parseInt(coords[0]), parseInt(coords[1])), null);
            return;
        }

        if(isSelected) {
            selectNode(clickedNode, 'empty');
        } else {
            selectNode(clickedNode, 'selected');
        }
    }

    const randomizeNodes = (walls) => {
        if(walls < 0) {
            walls = prompt('Quantas parede');
        }
        if (walls <= 0) return;
        randomX = Math.floor(Math.random() * (width - 0) + 0);
        randomY = Math.floor(Math.random() * (height - 0) + 0);
        selectNodeByPosition(randomX, randomY, 'selected');
        randomizeNodes(walls - 1);

    }

    const clearWalls = () => {
        let walls = document.querySelectorAll('.selected');
        walls.forEach((wall) => {
            wall.classList = 'node empty';
        });
    }

    return {
        initializeGrid: initializeGrid,
        selectNodeByPosition: selectNodeByPosition,
        getNodeByPosition: getNodeByPosition,
        selectNode: selectNode,
        displayPath: displayPath,
        pushToPath: pushToPath,
        randomizeNodes: randomizeNodes,
        clearWalls: clearWalls
    };

})();


