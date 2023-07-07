var scheduler = require('scheduler.spawning')
require('util.spawn')()

module.exports = function() {
	StructureSpawn.prototype.spawn = function(){
		var energy = this.room.energyCapacityAvailable;
		
		var repairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.home == this.room.name);
		var wallrepairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallrepairer' && creep.memory.home == this.room.name);
		//var zerglings = _.filter(Game.creeps, (creep) => creep.memory.role == 'zergling' && creep.memory.home == this.room.name);
		
		//builder
		var disBuilder = _.filter(Game.creeps, (creep) => creep.memory.role == 'distanceBuilder');
		
		var claimer = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
		
		if(this.memory.properties == undefined)
		    this.memory.properties = {}
		
		if(this.spawning == null/* && this.memory.spawn == true*/){			//when Spawn is idle and allowed to spawn
			/*
			if (Memory.roomAlert != undefined) {
				console.log('Stopping all spawnactivity, defending');
				this.createCreep([TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE], undefined, {role: 'defender'});
				return;
			}
			*/
			
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
				if(carrier.length < 1) {
				    if(energy > 500){
				        this.createCarrier(500, this.room.name, container.id);
				    } else {
				        this.createCarrier(energy, this.room.name, container.id);
				    }
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
			
			if(this.memory.properties.claim == true){
				var claimer;
				//var spawn = this;
				for(let room of this.room.memory.properties.harvestTargets){
					claimer = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer' && creep.memory.home == spawn.room.name && creep.memory.targetRoom == room);
					if(claimer.length < 1){
						this.createClaimer(room);
						return;
					}
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
			if(!this.memory.stats.idle){
			    this.memory.stats.idle = 0
			}
			this.memory.stats.idle++
			console.log('idle')
		} else {
			if(!this.memory.stats.busy){
				this.memory.stats.busy = 0
			}
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
		body.push(MOVE);
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
