module.exports = {
	run: function(creep){
		if(creep.room.name == creep.memory.targetRoom){
			if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE){
				creep.moveTo(creep.room.controller);
			}
			creep.signController(creep.room.controller, "Swarm\'s reach");
		}
		else{
			creep.moveToTargetRoom();
		}
	}
};