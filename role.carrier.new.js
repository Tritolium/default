module.exports = {
	run: function(creep){
		if(creep.memory.working){							//when working
			if(creep.memory.destination == undefined){		//aquire new destination
				creep.memory.destination = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_TOWER || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.energy < s.energyCapacity});
			}
			if(creep.memory.destination != undefined && creep.transfer(creep.memory.destination, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
				creep.moveTo(creep.memory.destination);
			}
			if(creep.carry.energy == 0){					//stop working, get energy
				creep.memory.working = false;
				creep.memory.destination = undefined;
			}
		} else {											//when getting energy
			if(creep.carry.energy == creep.carryCapacity){	//cap reached, start working
				creep.memory.working = true;
				creep.memory.destination = undefined;
			} else {
				if(creep.memory.destination == undefined || creep.memory.destination.store[ENERGY] > 0){
					creep.memory.destination = creep.pos.findClosestByRange(FIND_STRUCTURES,{filter: (s) => (s.structureType == STRUCTURE_CONTAINER) && s.store[RESOURCE_ENERGY] > 0});
				}
				if(creep.memory.destination != undefined && creep.withdraw(tank, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
					creep.moveTo(tank);
				}
			}
		}
};