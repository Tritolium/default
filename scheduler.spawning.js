module.exports = {
    scheduleCreep: function(creep_role, room_name){
        if(Game.rooms[room_name].memory.buffer === undefined) {
            Game.rooms[room_name].memory.buffer = new Array(0)
        }
        var buffer = Game.rooms[room_name].memory.buffer
        if(buffer.indexOf(creep_role) == -1){
            buffer.push(creep_role)
        }
    },

    shift: function(room){
        return room.memory.buffer.shift()
    },

    unshift: function(room, creep_role){
        room.memory.buffer.unshift(creep_role)
    },

    checkSchedule: function(room_name){
        //harvester
        var room = Game.rooms[room_name]
        
        for(let source of room.find(FIND_SOURCES)){
            var harvester = _.filter(Game.creeps, (creep) => 
                creep.memory.role == 'harvester' &&
                creep.memory.home == room_name &&
                creep.memory.source == source.id
            )
            var maxHarvester = Math.ceil(10/((Math.floor(room.energyCapacityAvailable/100)-1)*2))
            if(harvester.length < maxHarvester){
                this.scheduleCreep('harvester', room_name)
            }
        }
        //upgrader
        var upgrader = _.filter(Game.creeps, (creep) => 
            creep.memory.role == 'upgrader' && 
            creep.memory.home == room_name
        )

        if(room.memory.properties === undefined)
            room.memory.properties = {}
        
        if(room.memory.properties.minUpgrader === undefined)
            room.memory.properties.minUpgrader = 1

		if (upgrader.length < room.memory.properties.minUpgrader) {
            this.scheduleCreep('upgrader', room_name)
		}
        //distanceharvester
        for(let distRoom of room.memory.properties.harvestTargets){
            var distanceHarvester = _.filter(Game.creeps, (creep) =>
                creep.memory.role == 'distanceHarvester' &&
                creep.memory.homeRoom == room_name &&
                creep.memory.targetRoom == distRoom
            )
            if(distanceHarvester.length < room.memory.properties.minDistanceHarvester){
                this.scheduleCreep('distanceHarvester', room_name)
            }
        }
        //carrier
        for(let container of room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}})){
            var carrier = _.filter(Game.creeps, (creep) =>
                creep.memory.role == 'carrier' &&
                creep.memory.home == room_name &&
                creep.memory.container == container.id
            )
            if(carrier.length < 1){
                this.scheduleCreep('carrier', room_name)
            }
        }
        //builder
        //repairer
    }
}
