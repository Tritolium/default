var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function (creep) {
		creep.signController(creep.room.controller, 'Swarm\'s home');
		switch(creep.memory.state){
		case creep.EStatus.DELIVER:
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				if(!creep.memory.path){
					creep.memory.path = creep.pos.findPathTo(creep.room.controller);
					if(creep.room.find(FIND_CONSTRUCTION_SITES).length < 3){
						const terrain = new Room.Terrain(creep.memory.home)
					    for(point of creep.memory.path){
							if(terrain.get(point.x, point.y) !== TERRAIN_MASK_WALL)
						    	creep.room.createConstructionSite(point.x, point.y, STRUCTURE_ROAD);
				        }
					}
				}
				creep.moveByPath(creep.memory.path);
			}
			if(creep.carry.energy == 0){
				creep.memory.state = creep.EStatus.HARVEST;
				creep.memory.path = undefined;
			}
			break;
		case creep.EStatus.HARVEST:
			creep.getEnergy(true, false);
			if(creep.carry.energy == creep.carryCapacity) {
				creep.memory.state = creep.EStatus.DELIVER;
				creep.memory.path = undefined;
			}
			break;
		default: //entrypoint
			creep.memory.state = creep.EStatus.HARVEST;
			creep.memory.working = undefined;
			break;
		}
    }
}

module.exports = roleUpgrader;
