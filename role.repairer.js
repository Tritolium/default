var roleBuilder = require('role.builder');
var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 gather');
	    }
	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.repairing = true;
	        creep.say('🚧 repair');
	    }

	    if(creep.memory.repairing) {
	        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: function(object){
                if(object.structureType != STRUCTURE_ROAD) {
                    return false;
                }
                if(object.structureType == STRUCTURE_ROAD && object.hits > object.hitsMax * 0.9) {
                    return false;
                }
                return true;
	        }});
            if(target != null) {
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	    else {
	        var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE){
                creep.moveTo(source);
            }
	    }
	}
};

module.exports = roleRepairer;