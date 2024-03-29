var scheduler = require('scheduler.spawning')
require('util.spawn')()

const constSites = [
	[-1, -1], [1, -1], [1, 1], [-1, 1],		// first ring
	[-2, -2], [0, -2], [2, -2], [2, 0],		// second ring
	[2, 2], [0, 2], [-2, 2], [-2, 0],
	[-3, -3], [-1, -3], [1, -3], [3, -3],	// third ring
	[3, -1], [3, 1], [3, 3], [1, 3],
	[-1, 3], [-3, 3], [-3, 1], [-3, -1],
	[-4, -4], [-2, -4], [0, -4], [2, -4],	// fourth ring
	[4, -4], [4, -2], [4, 0], [4, 2],
	[4, 4], [2, 4], [0, 4], [-2, 4],
	[-4, 4], [-4, 2], [-4, 0], [-4, -2]
]

module.exports = function() {
	StructureSpawn.prototype.spawn = function(){
		var energy = this.room.energyCapacityAvailable;
		
		var repairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.home == this.room.name);
		var wallrepairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallrepairer' && creep.memory.home == this.room.name);
		//var zerglings = _.filter(Game.creeps, (creep) => creep.memory.role == 'zergling' && creep.memory.home == this.room.name);
		
		//builder
		var disBuilder = _.filter(Game.creeps, (creep) => creep.memory.role == 'distanceBuilder');

		var defender = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender' && creep.memory.targetRoom == this.room.name);
		
		if(this.memory.properties == undefined)
		    this.memory.properties = {}
		
		if(this.spawning == null/* && this.memory.spawn == true*/){			//when Spawn is idle and allowed to spawn
			
			if (this.room.find(FIND_HOSTILE_CREEPS).length > 0 && defender.length < 0) {
				console.log('Stopping all spawnactivity, defending');
				let energyavailable = this.room.energyAvailable
				let parts = Math.floor(energyavailable/190)
				let body = []
				for(let i = 0; i < parts; i++)
					body.push(TOUGH,ATTACK,MOVE,MOVE)
				this.createCreep(body, undefined, {role: 'defender', targetRoom: this.room.name});
				return;
			}
			
			//harvester
			/**
			 * for each source an amount of harvesters is spawned, based on the formula
			 * num_harvester = Math.ceil(10/((Math.floor(EnergyCapacity/100)-1)*2))
			 * more than 10 Workparts are not effective, so there is a cap at 1100
			 */
			for(let source of this.room.find(FIND_SOURCES)){
				var harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.home == this.room.name && creep.memory.source == source.id);
				var maxHarvester = Math.ceil(10/((Math.floor(this.room.energyCapacityAvailable/100)-1)*2)) //old: Math.ceil(700/this.room.energyCapacityAvailable)
				if(harvester.length < maxHarvester){
					ret = this.spawnHarvesterCreep(source.id)
					console.log(ret)
					if(ret === -6){
						console.log('harvester: not enough resources')
					    harvester = _.filter(Game.creeps, (creep) => creep.memory.role =='harvester' && creep.memory.home == this.room.name);
					    if(!harvester.length){
							console.log('no harvesters')
					        this.spawnEmergencyHarvesterCreep(source.id)
					        //this.spawning.memory.source = source.id;
					        return;
					    }
					}
					return;
				}
			}
						
			//carrier
			var containerarray = this.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
			for (container of containerarray) {
				let carrier = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.memory.home == this.room.name && creep.memory.container == container.id);
				if(this.room.memory.evaluation === undefined || this.room.memory.evaluation.containers[container.id] === undefined)
					break
				if(carrier.length < this.room.memory.evaluation.containers[container.id].maxCarrier) {
				    this.createCarrier(this.room.memory.evaluation.containers[container.id].body * 100, this.room.name, container.id);
				    
				    /**
					if(this.createCarrier(this.room.energyCapacityAvailable, this.room.name, container.id) == ERR_NOT_ENOUGH_ENERGY) {
						let allcarrier = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.memory.home == this.room.name);
						console.log(allcarrier.lenght);
						if (!allcarrier.lenght) {
							//this.createCarrier(this.room.energyAvailable, this.room.name, container.id);
						}
					}**/
					return;
				}
			}
			
			//upgrader
			var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.home == this.room.name);
			if (upgrader.length < this.room.memory.properties.minUpgrader) {
				console.log('upgrader: ' + this.createCustomCreep(this.room.energyCapacityAvailable, 'upgrader', this.room.name));
				return;
			}
			
			//distanceHarvester
			if (this.room.memory.properties.distanceHarvest){
				var distanceHarvester;
				var spawn = this;
				for(let room of this.room.memory.properties.harvestTargets){
					distanceHarvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'distanceHarvester' && creep.memory.homeRoom == spawn.room.name && creep.memory.targetRoom == room);
					if(distanceHarvester.length < this.room.memory.properties.minDistanceHarvester){
						console.log('distanceHarvester: ' + this.createDistanceHarvester(energy,Math.floor(energy/300),spawn.room.name,room));
						return;
					}
				}
			}
			
			if (repairer.length < this.room.memory.properties.minRepairer){
			    if(energy < 400){
			        this.createCustomCreep(energy, 'repairer', this.room.name);
			    } else {
			        this.createCustomCreep(400, 'repairer', this.room.name);
			    }
				//this.createCustomCreep(energy,'repairer',this.room.name);
				return;
			} else {
				if (wallrepairer.length < this.memory.minWallrepairer) {
					this.createCustomCreep(energy, 'wallrepairer', this.room.name);
					return;
				}
			}
				
			var constructionSites;
			var builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.home == this.room.name);
			if(builder.length < this.room.memory.properties.minBuilder){
				constructionSites = this.room.find(FIND_CONSTRUCTION_SITES);
				if(constructionSites.length){
					if(energy < 600){
						this.createCustomCreep(energy, 'builder', this.room.name)
					} else {
						this.createCustomCreep(600, 'builder', this.room.name)
					}
					return;
				}
			}
			//mechanic as of now not effective
			var gravedigger
			for(tombstone of this.room.find(FIND_TOMBSTONES, {filter: (t) => t.store[RESOURCE_ENERGY] > 50 && t.ticksremaining > 25})){
				gravedigger = _.filter(Game.creeps, (creep) => creep.memory.role == 'gravedigger' && creep.memory.target == tombstone.id)
				if(gravedigger.length < 1){
					this.createGravedigger();
					return
				}
			}
			
			for(ruin of this.room.find(FIND_RUINS, {filter: (r) => r.store[RESOURCE_ENERGY] > 50})){
				gravedigger = _.filter(Game.creeps, (creep) => creep.memory.role == 'gravedigger' && creep.memory.target == ruin.id)
				if(gravedigger.length < 1){
					this.createGravedigger(ruin.id);
					return
				}
			}
			
			if(this.memory.expand == true){
				if (this.memory.target.controller == false) {
					var suc = this.createControllerClaimer();
					if (suc != ERR_BUSY && suc != ERR_NOT_ENOUGH_ENERGY) {
						this.memory.target.controller = true;
					}
				} else {
					if (disBuilder.length< this.memory.minDistanceBuilder) {
						this.createDistanceBuilder(energy, 6, this.memory.target.room);
						return;
					}
				}
			}
			
			var claimer;
			for(let room of this.room.memory.properties.harvestTargets){
				claimer = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer' && creep.memory.home == spawn.room.name && creep.memory.targetRoom == room);
				if(claimer.length < 1){
					this.createClaimer(room);
					return;
				}
			}
				
			if(this.memory.properties.swarm){
				var zerglings = _.filter(Game.creeps, (creep) => creep.memory.role == 'zergling' && creep.memory.home == this.room.name);
				if(zerglings.length < this.memory.properties.minZergling){
					console.log('swarm');
					this.createZergling(this.memory.target.room, energy);
					return;
				}
			}
			
			//target room, only possible, when creep in room
			//console.log(Map.rooms['E71S9'].find(FIND_CONSTRUCTION_SITES));
			//constructionSites = Map.rooms[this.memory.target].find(FIND_CONSTRUCTION_SITES);

			//if(disBuilder < this.memory.minDistanceBuilder && constructionSites.length){
			//	this.createDistanceBuilder(energy,6,this.memory.target);
			//}
			//}
			
			//if this point is reached, spawn remains idle;
			if(!this.memory.stats)
				this.memory.stats = {}
			
			if(!this.memory.stats.idle){
			    this.memory.stats.idle = 0
			}
			this.memory.stats.idle++
			console.log(`idle: ${this.memory.stats.idle}`)
			if(this.memory.stats.idle % 500 === 0 && this.room.find(FIND_CONSTRUCTION_SITES).length < 3){
				console.log('Expand Spawn')
				let spawnPos = this.pos
				for(site of constSites){
					let constSitePos = new RoomPosition(spawnPos.x + site[0], spawnPos.y + site[1], this.room.name)
					let ret = constSitePos.createConstructionSite(STRUCTURE_EXTENSION)
					if(ret === OK || ret === ERR_FULL || ret === ERR_RCL_NOT_ENOUGH)
						break

					constSitePos.lookFor(LOOK_STRUCTURES).map(structure => {
						if(structure.structureType === STRUCTURE_ROAD)
							structure.destroy()
					})
				}
			}

			// perform evaluation
			if(!this.room.memory.evaluation)
				this.room.memory.evaluation = {}
			
			if(!this.room.memory.evaluation.containers)
				this.room.memory.evaluation.containers = {}
			
			let containerlist = this.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}})
			let maxCarryParts = Math.floor(this.room.energyCapacityAvailable/100)
			maxCarryParts = Math.min(maxCarryParts, 5)

			for(container of containerlist){
				if(this.room.memory.evaluation.containers[container.id] === undefined){
					// calc distance from container to spawn
					let path = PathFinder.search(container.pos, {pos: this.pos, range: 1}, {swampCost: 1}).path
					let source = container.pos.findInRange(FIND_SOURCES, 3).length > 0
					this.room.memory.evaluation.containers[container.id] = {distance: path.length, source: source}
				}

				let stats = this.room.memory.evaluation.containers[container.id]
				stats.carryparts = Math.ceil(stats.distance * 0.4)
				if(stats.source){
					if(maxCarryParts >= stats.carryparts){
						stats.maxCarrier = 1
						stats.body = stats.carryparts
					} else {
						stats.maxCarrier = Math.ceil(stats.carryparts/maxCarryParts)
						stats.body = Math.ceil(stats.carryparts/stats.maxCarrier)
					}
				} else {
					stats.maxCarrier = 1
					stats.body = Math.min(stats.carryparts, maxCarryParts)
				}
				
			}
		} else {
			if(!this.memory.stats)
				this.memory.stats = {}
			
			if(!this.memory.stats.busy)
				this.memory.stats.busy = 0
			
			this.memory.stats.busy++
			console.log('busy spawning ' + Memory.creeps[this.spawning.name].role + ' ' + this.spawning.name)
		}
	};
	
	/**
	 * spawns a harvester creep, assigned to the given source
	 * @param {string} sourceId the sources ID
	 */
	StructureSpawn.prototype.spawnHarvesterCreep = function(sourceId){
		let numWorkParts = 1
		if(this.room.energyCapacityAvailable >= 350)
			numWorkParts = Math.floor(this.room.energyCapacityAvailable/100) - 1;
		if(numWorkParts > 5)
			numWorkParts = 5;
		let body = [];
		for(let i = 0; i <numWorkParts; i++){
			body.push(WORK);
		}
		body.push(CARRY);
		body.push(MOVE)

		return this.createCreep(body, undefined, {role: 'harvester', home: this.room.name, working: false, source: sourceId});
	};
	
	StructureSpawn.prototype.spawnEmergencyHarvesterCreep = function(sourceId){
	    let numWorkParts = Math.floor(this.room.energyAvailable/100) - 1;
		if(numWorkParts > 5)
			numWorkParts = 5;
		let body = [];
		for(let i = 0; i <numWorkParts; i++){
			body.push(WORK);
		}
		body.push(CARRY);
		body.push(MOVE);
		return this.createCreep(body, undefined, {role: 'harvester', home: this.room.name, working: false, source: sourceId});
	};
	
    StructureSpawn.prototype.createCustomCreep = function(energy, roleType, home){
        var numBodyParts = Math.floor(energy/200);
        var body = [];
        
        for(var i = 0; i < numBodyParts; i++){
            body.push(WORK);
        }
        for(var i = 0; i < numBodyParts; i++){
            body.push(CARRY);
        }
        for(var i = 0; i < numBodyParts; i++){
            body.push(MOVE);
        }
        
        return this.createCreep(body, undefined, {role: roleType, home: home, working: false});
    };

    StructureSpawn.prototype.createLongDistanceHarvester = function (energy, numOfWorkParts, home, target, sourceIndex) { //depricated
        var body = [];
        let i;

        for (i = 0; i < numOfWorkParts; i++) {
            body.push(WORK);
        }

        energy -= 150 * numOfWorkParts;

        var numOfParts = Math.floor(energy / 100);

        for(i = 0; i < numOfParts; i++){
            body.push(CARRY);
        }

        for (i = 0; i < numOfWorkParts + numOfParts; i++){
            body.push(MOVE);
        }

        return this.createCreep(body, undefined, { role: 'longDistanceHarvester', homeRoom: home, targetRoom: target, sourceId: sourceIndex, working: false});
    };
	
	StructureSpawn.prototype.createDistanceHarvester = function (energy, numOfWorkParts, home, target) {
        var body = [];
        let i;

        for (i = 0; i < numOfWorkParts; i++) {
            body.push(WORK);
        }

        energy -= 150 * numOfWorkParts;

        var numOfParts = Math.floor(energy / 100);

        for(i = 0; i < numOfParts; i++){
            body.push(CARRY);
        }

        for (i = 0; i < numOfWorkParts + numOfParts; i++){
            body.push(MOVE);
        }

        return this.createCreep(body, undefined, { role: 'distanceHarvester', homeRoom: home, targetRoom: target, working: false});
    };
	
	StructureSpawn.prototype.createDistanceBuilder = function (energy, numOfWorkParts, target) {
        var body = [];
        let i;

        for (i = 0; i < numOfWorkParts; i++) {
            body.push(WORK);
        }

        energy -= 150 * numOfWorkParts;

        var numOfParts = Math.floor(energy / 100);

        for(i = 0; i < numOfParts; i++){
            body.push(CARRY);
        }

        for (i = 0; i < numOfWorkParts + numOfParts; i++){
            body.push(MOVE);
        }

        return this.createCreep(body, undefined, { role: 'distanceBuilder', targetRoom: target, working: false});
	};
	
	StructureSpawn.prototype.createGravedigger = function(tombstone){
		return this.createCreep([CARRY,MOVE], undefined, {role: 'gravedigger', tombstone: tombstone})
	}
	
	Structure.prototype.createClaimer = function (target) {
		return this.createCreep([CLAIM,MOVE], undefined, {role: 'claimer',home: this.room.name, targetRoom: target});
	};

	Structure.prototype.createControllerClaimer = function () {
	    return this.createCreep([CLAIM,MOVE],undefined,{role: 'controllerclaimer', target: this.memory.target.room});
	}
	/**@param {number} energy 
	 * @param {Room} home
	*/
	Structure.prototype.createCarrier = function (energy, home, container){
		var body = [];
		let i;
		var numOfParts = Math.floor(energy / 100);
		for(i = 0; i < numOfParts; i++){
			body.push(CARRY);
		}
		for(i = 0; i < numOfParts; i++){
			body.push(MOVE);
		}
		return this.createCreep(body, undefined, {role: 'carrier', home: home, container: container});
	};
	
	Structure.prototype.createZergling = function(targetRoom, energy){
		return this.createCreep([ATTACK,MOVE],undefined,{role: 'zergling', home: this.room.name, targetRoom: targetRoom});
	}
};
