module.exports = {
	run: function(creep) {
		if(creep.room.name == creep.memory.targetRoom){
			creep.signController(creep.room.controller, 'I am the Swarm. Armies will be shattered. Worlds will burn.');
			if(creep.memory.target == undefined){
				creep.memory.target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
				if(creep.memory.target != undefined)
					creep.memory.target = creep.memory.target.id;
				else {
				    creep.memory.targetRoom = Game.spawns['Spawn1'].memory.target.room;
			        Game.spawns['Spawn1'].memory.properties.swarm = false;
			        if(creep.signController(creep.room.controller, 'I am the Swarm. Armies will be shattered. Worlds will burn.') == ERR_NOT_IN_RANGE){
			            creep.moveTo(creep.room.controller);
			        }
				}
			}
			switch (creep.attack(Game.getObjectById(creep.memory.target))){
				case ERR_NOT_IN_RANGE:
					creep.moveTo(Game.getObjectById(creep.memory.target));
					break;
				case ERR_INVALID_TARGET:
					creep.memory.target = undefined;
					break;
			}
		} else {
			var exit = creep.room.findExitTo(creep.memory.targetRoom);
			creep.moveTo(creep.pos.findClosestByRange(exit));
			Game.spawns['Spawn1'].memory.properties.swarm = true;
		}
	}
};