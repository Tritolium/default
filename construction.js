var construction = {
    road: function(origin, goal) {
        let path = PathFinder.search(origin, goal, {
            plainCost: 2,
            swampCost: 2
        });
        for (let pos in path) {
            Game.spawns['Spawn1'].room.createConstructionSite(pos, STRUCTURE_ROAD);
        }
    }
}

module.exports = construction;