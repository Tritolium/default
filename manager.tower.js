module.exports = {
    run: function () {
        var towers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
            filter: (s) =>
                s.structureType == STRUCTURE_TOWER
        });
        for(let tower of towers) {
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target != undefined) {
                tower.attack(target);
            } else if (tower.energy > tower.energyCapacity * 0.7) {
                var ramparts = tower.room.find(FIND_STRUCTURES, {
                    filter: (s) =>
                        s.structureType == STRUCTURE_RAMPART
                });
                var rampart = undefined;
                for(let ram of ramparts) {
                    if ((rampart != undefined && ram.hits < rampart.hits) || rampart == undefined) {
                        rampart = ram;
                    }
                }
                //tower.repair(rampart);
            }
        }
    }
};