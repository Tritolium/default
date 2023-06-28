var HOME = 'E92N53';
var i = 0;

var numHarvester = 2;

var managerCreep = {

    run: function () {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var distanceE92N54 = _.filter(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == 'E92N54');
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        //var builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var wallrepairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallrepairer');
        var claimer = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
        
        var energy = Game.spawns['Spawn1'].room.energyCapacityAvailable;
    
        
        
    }
}

module.exports = managerCreep;