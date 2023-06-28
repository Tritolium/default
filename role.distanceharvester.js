var harvester = require('role.harvester');

module.exports = {
	_run: function(creep){
		switch(creep.memory.state){
			case creep.EStatus.DELIVER:
				if(creep.room.name == creep.memory.homeRoom)
					harvester.run(creep);
				else
					creep.moveToHomeRoom();
				break;
			case creep.EStatus.HARVEST:
				if(creep.room.name == creep.memory.targetRoom)
					harvester.run(creep);
				else
					creep.moveToTargetRoom();
				break;
			default:
			    creep.memory.state = creep.EStatus.HARVEST;
			    creep.memory.working = undefined;
			    break;
		}
	},

	run: function(creep){
		switch(creep.memory.state){
			case creep.EStatus.DELIVER:
				if(creep.room.name == creep.memory.homeRoom) {
					creep.acquireTarget()
					if(creep.memory.target != undefined){
						switch(creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY)){
						case ERR_NOT_ENOUGH_RESOURCES:
							creep.memory.state = creep.EStatus.HARVEST
							creep.memory.target = undefined
							break
						case ERR_FULL:
							creep.memory.target = undefined
							break
						case ERR_NOT_IN_RANGE:
							creep.moveTo(Game.getObjectById(creep.memory.target))
							break
						}
					}
				} else
					creep.moveToHomeRoom();
				break;
			case creep.EStatus.HARVEST:
				if(creep.room.name == creep.memory.targetRoom){
					if(!creep.memory.target){
						creep.memory.target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
						if(creep.memory.target){
							creep.memory.target = creep.memory.target.id
						}
					}
					switch(creep.harvest(Game.getObjectById(creep.memory.target))){
					case ERR_NOT_IN_RANGE:
						creep.moveTo(Game.getObjectById(creep.memory.target))
					}
					if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()){
						creep.memory.state = creep.EStatus.DELIVER
						creep.memory.target = undefined
					}
				} else
					creep.moveToTargetRoom();
				break
			default:
			    creep.memory.state = creep.EStatus.HARVEST
			    break
		}
	}
};