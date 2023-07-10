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
		        switch(creep.attack(Game.getObjectById(creep.memory.target))){
					case ERR_NOT_IN_RANGE:
						creep.moveTo(Game.getObjectById(creep.memory.target))
						break
					case ERR_INVALID_TARGET:
						creep.memory.target = undefined
						break
					case ERR_NO_BODYPART:
						creep.suicide()
						break
				}
		            
		    }
		} else{
			creep.moveToTargetRoom();
		}
	}
};
