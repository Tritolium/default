var roleRepairer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.working) {
			if(creep.memory.target == undefined){
                creep.memory.target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) =>(s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER)
                                && s.hits < s.hitsMax/4
                });
                if(creep.memory.target == undefined){
                    creep.memory.target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) =>(s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER)
                                && s.hits < s.hitsMax
                });
                }
				if(creep.memory.target  != undefined){
					creep.memory.target = creep.memory.target.id;
				}
            }
            if (creep.memory.target != undefined) {
                if (creep.repair(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.target));
                }
            }else{
                require('role.builder').run(creep);
            }
            if (creep.carry.energy == 0) {
                creep.memory.working = false;
                creep.memory.target = undefined;
            }
			
			if (creep.memory.target != undefined && Game.getObjectById(creep.memory.target).hits == Game.getObjectById(creep.memory.target).hitsMax)
				creep.memory.target = undefined;
        } else {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.working = true;
                creep.say('repair');
            } else {
                creep.getEnergy(true,false);
            }
        }
	}
};

module.exports = roleRepairer;
