var roleBuilder = {
	/**
	 * 
	 * @param {Creep} creep 
	 */
	run: function(creep){
		switch(creep.memory.state){
		case creep.EStatus.GATHER:
			creep.getEnergy(true, false)
			if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()){
				creep.memory.state = creep.EStatus.BUILD
				creep.memory.path = undefined
			}
			break
		case creep.EStatus.BUILD:
			let targets
			if(creep.memory.target == undefined){
				targets = creep.room.find(FIND_CONSTRUCTION_SITES)
				if(targets != undefined && targets.length){
					creep.memory.target = targets[0].id
				}
			}
			if(creep.memory.target != undefined){
				switch(creep.build(Game.getObjectById(creep.memory.target))){
				case ERR_NOT_ENOUGH_RESOURCES:
					creep.memory.state = creep.EStatus.GATHER
					creep.memory.path = undefined
					break
				case ERR_NOT_IN_RANGE:
					if(!creep.memory.path){
						creep.memory.path = creep.pos.findPathTo(Game.getObjectById(creep.memory.target))
					}
					creep.moveByPath(creep.memory.path)
				case ERR_INVALID_TARGET:
					creep.memory.target = undefined
					creep.memory.path = undefined
				}
			} else {
				require('role.repairer').run(creep);
			}
			break
		default:
			creep.memory.state = creep.EStatus.GATHER
			break
		}
	}
};

module.exports = roleBuilder;
