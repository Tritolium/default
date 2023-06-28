module.exports = {
	run: function(creep){
	    switch(creep.memory.state){
	    case creep.EStatus.GATHER:
	        let cont = Game.getObjectById(creep.memory.container);
			switch(creep.withdraw(cont, RESOURCE_ENERGY)){
				case ERR_NOT_IN_RANGE:
				    if(!creep.memory.path){
				        creep.memory.path = creep.pos.findPathTo(cont);
				        if(creep.room.find(FIND_CONSTRUCTION_SITES).length < 3){
					    for(point of creep.memory.path){
						    creep.room.createConstructionSite(point.x, point.y, STRUCTURE_ROAD);
				        }
					}
				    }
				    creep.moveByPath(creep.memory.path)
					//creep.moveTo(cont);
					//creep.withdraw(cont, RESOURCE_ENERGY);
					break;
				case ERR_NOT_ENOUGH_RESOURCES:
				case ERR_FULL:
					creep.memory.state = creep.EStatus.DELIVER;
					creep.memory.path = undefined;
					break;
			}
	        break;
	    case creep.EStatus.DELIVER:
	        creep.acquireTarget();
			if (creep.memory.target != undefined) {
				switch(creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY)){
					case ERR_NOT_IN_RANGE:
					    if(!creep.memory.path){
					        creep.memory.path = creep.pos.findPathTo(Game.getObjectById(creep.memory.target));
					    }
					    creep.moveByPath(creep.memory.path);
						break;
					case ERR_FULL:
						creep.memory.target = undefined;
						creep.memory.path = undefined;
						break;
				}
            }
			if (creep.carry.energy == 0) {
				creep.memory.state = creep.EStatus.HARVEST;
				creep.memory.path = undefined;
				creep.memory.target = undefined;
            }
	        break;
	    default:
	        creep.memory.state = creep.EStatus.GATHER;
	        creep.memory.working = undefined;
	        break;
	    }
	}
};