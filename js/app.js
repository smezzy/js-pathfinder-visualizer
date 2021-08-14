
let App = (function() {
    let width = 40;
    let height = 15;
    Grid.initializeGrid(width, height);

    let start = new Vec3(0, 0);
    let goal = new Vec3(width - 1, height - 1);

    Astar.setGoal(start, goal);
    return;
    
})();