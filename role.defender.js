module.exports = {
	run: function(creep){
		if(creep.room.name == creep.memory.targetRoom){
		    if(creep.memory.target == undefined){
			    creep.memory.target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
				if (creep.memory.target != undefined) {
					creep.memory.target = creep.memory.target.id;
				}
		    }
		    if(creep.memory.target != undefined){
		        if(creep.attack(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE)
		            creep.moveTo(Game.getObjectById(creep.memory.target));
		    } else {
				Memory.roomAlert = undefined;
				creep.suicide();
			}
		} else{
			creep.moveToTargetRoom();
		}
	}
};