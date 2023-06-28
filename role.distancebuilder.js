module.exports = {
	run: function(creep){
		if(creep.room.name == creep.memory.targetRoom){
			if(creep.memory.working){
				require('role.builder').run();
				if(creep.carry.energy == 0){
					creep.memory.working = false;
				}
			}
			else{
				if(creep.carry.energy == creep.carryCapacity){
					creep.memory.working = true;
				}
				else{
					creep.getEnergy(false, false);
				}
			}
		}
		else{
			creep.moveToTargetRoom();
		}
	}
};