var HOME = 'E92N53';
var managerCreep = {

    run: function () {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var longDistanceHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester');
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var wallrepairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallrepairer');
        
        var energy = Game.spawns['Spawn1'].room.energyCapacityAvailable;

        if (harvesters.length < 2) {
            //if (harvesters[0].ticksToLive < 500){
                var suc = Game.spawns['Spawn1'].createCustomCreep(Game.spawns['Spawn1'].room.energyCapacityAvailable, 'harvester');
            //}
            if (suc == ERR_NOT_ENOUGH_ENERGY && harvesters.length < 1) {
                Game.spawns['Spawn1'].createCustomCreep(Game.spawns['Spawn1'].room.energyAvailable, 'harvester');
            }
        } else {
			if (upgrader.length < 3) {
                Game.spawns['Spawn1'].createCustomCreep(Game.spawns['Spawn1'].room.energyCapacityAvailable, 'upgrader');
            }
			if(upgrader.length > 0){
				if (repairers.length < 1) {
					Game.spawns['Spawn1'].createCustomCreep(Game.spawns['Spawn1'].room.energyCapacityAvailable, 'repairer');
				}

				if (builder.length < 2) {
					Game.spawns['Spawn1'].createCustomCreep(Game.spawns['Spawn1'].room.energyCapacityAvailable, 'builder');
				}
				
				if (wallrepairers.length < 1) {
					Game.spawns['Spawn1'].createCustomCreep(Game.spawns['Spawn1'].room.energyCapacityAvailable, 'wallrepairer');
				}
				if (longDistanceHarvesters < 1) {
                    //Game.spawns['Spawn1'].createLongDistanceHarvester(energy, 5, HOME, 'E92N54', 0);
                }
			}
        }
    }
}

module.exports = managerCreep;