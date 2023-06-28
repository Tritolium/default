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
            }else if(tower.room.memory.hurtCreep != undefined){
                var creep = Game.creeps[tower.room.memory.hurtCreep];
                tower.heal(creep);
                if(creep != undefined && creep.hits == creep.hitsMax){
                    creep.room.memory.hurtCreep = undefined;
                }
            } else if (tower.energy > tower.energyCapacity * 0.8) {
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