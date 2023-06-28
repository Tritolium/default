module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('ð gather');
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('ð§ repair wall');
        }

        if(creep.memory.working) {
            var walls = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART});
            var target = null;
            for(var perc = 0.0001; perc < 1; perc = perc + 0.0001){
                for(let wall of walls){
                    if (wall.hits / wall.hitsMax < perc) {
                        creep.memory.wall = wall;
                        target = wall;
                        break;
                    }
                }
                if(target != null){
                    break;
                }
            }
            if(target != null){
                if(creep.repair(target) == ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            } else {
                require('role.repairer').run(creep);
            }
        }
        else {
            creep.getEnergy(true,false);
        }
    }
};