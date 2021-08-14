function Node(node, position, g, h, parent) {
    let open;
    this.position = position;
    this.node = node;
    this.g = g;
    this.h = h;
    this.f = this.g + this.h;
    this.parent = parent;
}

let Astar = (function() {

    let goal = new Vec3(0, 0);
    let start = new Vec3(0, 0);

    let closed = [];
    let open = [];


    const startPathfinding = () => {
        let startNode = Grid.getNodeByPosition(start.x, start.y);
        let _node = new Node(startNode, new Vec3(start.x, start.y), 0, 0, this);
        pathfind(_node);
        setTimeout(() => {
            Grid.displayPath();
        }, 150);
    }

    function getNeighbors(_position) {
        let above = Grid.getNodeByPosition(_position.x, _position.y - 1);
        let below = Grid.getNodeByPosition(_position.x, _position.y + 1);
        let onLeft = Grid.getNodeByPosition(_position.x - 1, _position.y);
        let onRight = Grid.getNodeByPosition(_position.x + 1, _position.y);

        return {
            above: above,
            below: below,
            onLeft: onLeft,
            onRight: onRight
        }
    }

    let index = 0;

    function pathfind(origin) {
        let neighbors = getNeighbors(origin.position);
        let parent = origin;
        let lowestScore = 999;
        let bestNode = new Node();



        for (node in neighbors) {
            
            if(neighbors[node].node != null) {

                let _node = neighbors[node].node;
                let _pos = neighbors[node].position;
                let difference = new Vec3(Math.abs(goal.x - _pos.x), Math.abs(goal.y - _pos.y));
                let h = difference.x + difference.y;
                let nodeObj = new Node(_node, _pos, parent.g + 1, h, origin);

                if(neighbors[node].node.classList.contains('goal')) {
                    console.log('goal reached lmao');
                    closed.push(nodeObj);
                    backtrack(closed[closed.length - 1])
                    return;
                }

                if (neighbors[node].node.classList.contains('empty')) {
                    Grid.selectNode(_node, 'open');
                    //_node.classList = 'node open';
                    open.push(nodeObj);

                }
            }
        }

        open.forEach((node) => {
            if (node.f < lowestScore) {
                lowestScore = node.f;
                bestNode = node;
            } else if (node.f == lowestScore) {
                if(node.h < bestNode.h) {
                    bestNode = node;
                }
            }
        });

        closed.push(bestNode);

        let _index = open.indexOf(bestNode);
        if(_index > -1) {
            open.splice(_index, 1);
        }

        
        Grid.selectNode(bestNode.node, 'closed');
        pathfind(bestNode);
    }

    function backtrack(goal) {

        if(goal.node.node && goal.node.node.classList.contains('start')) {
            console.log('start reached, pathfinding ended');
            return;
        }

        let pai = goal.parent;
        Grid.pushToPath(pai.node, 'path');
        // Grid.selectNode(pai.node, 'path');
        //pai.node.classList = 'node path';
        backtrack(pai);
    }

    const setGoal = (_start, _goal) => {

        if (_start != null) {
            start = _start;
        } 
        if (_goal != null) {
            goal = _goal;
        } 

        Grid.selectNodeByPosition(start.x , start.y, 'start');
        Grid.selectNodeByPosition(goal.x , goal.y, 'goal');
    }

    return {
        getNeighbors: getNeighbors,
        startPathfinding: startPathfinding,
        setGoal: setGoal
    }

})();


