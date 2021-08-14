
let App = (function() {

    Grid.initializeGrid(40, 15);

    let start = new Vec3(0, 0);
    let goal = new Vec3(39, 14);

    Astar.setGoal(start, goal);
    return;
    
})();