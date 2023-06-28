var roleHarvester = {
    
    /** @param {Creep} creep **/
    _run: function(creep) {
		switch(creep.memory.state){
		case creep.EStatus.DELIVER:
			creep.acquireTarget();
			if (creep.memory.target != undefined) {
				switch(creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY)){
					case ERR_NOT_IN_RANGE:
						creep.moveTo(Game.getObjectById(creep.memory.target));
						break;
					case ERR_FULL:
						creep.memory.target = undefined;
						break;
				}
            }
			if (creep.carry.energy == 0) {
				creep.memory.state = creep.EStatus.HARVEST
				creep.memory.target = undefined
				creep.memory.path = undefined
            }
			break;
		case creep.EStatus.HARVEST:
			if (creep.carry.energy == creep.carryCapacity) {
				creep.memory.state = creep.EStatus.DELIVER
				creep.memory.path  = undefined
            } else {
				creep.getEnergy(false,false);
            }
			break;
		default:
			creep.memory.state = creep.EStatus.HARVEST;
			creep.memory.working = undefined;
			break;
		}
	},

	/** @param {Creep} creep **/
    run: function(creep) {
		switch(creep.memory.state){
		case creep.EStatus.DELIVER:
			creep.acquireTarget();
			if (creep.memory.target != undefined) {
				switch(creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY)){
					case ERR_NOT_ENOUGH_RESOURCES:
						creep.memory.state = creep.EStatus.HARVEST
						creep.memory.target = undefined
						creep.memory.path = undefined
						break
					case ERR_NOT_IN_RANGE:
						creep.moveTo(Game.getObjectById(creep.memory.target));
						break
					case ERR_FULL:
						creep.memory.target = undefined
						break
				}
            }
			break;
		case creep.EStatus.HARVEST:
			switch(creep.harvest(Game.getObjectById(creep.memory.source))){
			case ERR_NOT_IN_RANGE:
				creep.moveTo(Game.getObjectById(creep.memory.source))
				break
			}
			if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()){
				creep.memory.state = creep.EStatus.DELIVER
			}
			break
		default:
			creep.memory.state = creep.EStatus.HARVEST
			break
		}
	}
};

module.exports = roleHarvester;
