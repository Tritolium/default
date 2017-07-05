var roleHarvester = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        
		if(creep.memory.working && creep.carry.energy == 0) {
			creep.memory.working = false;
		}
		if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
			creep.memory.working = true;
		}
		if(creep.memory.working) {
			var tank = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: function(s){
			    if(s.energy < s.energyCapacity){
			        if(s.StructureContainer != STRUCTURE_TOWER){
			            return true;
			        }else if(Game.spawns['Spawn1'].room.energyAvailable == Game.spawns['Spawn1'].room.energyCapacityAvailable){
			            return true;
			        }
			    }
			}});
			if(creep.transfer(tank, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(tank);
			}
		}
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                creep.moveTo(sources[0]);
            }
        }
    }
};

module.exports = roleHarvester;