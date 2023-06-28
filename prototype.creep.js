var roleBuilder = require('role.builder');
var roleCarrier = require('role.carrier');
var roleClaimer = require('role.claimer');
var roleControllerClaimer = require('role.controllerclaimer');
var roleGravedigger = require('role.gravedigger')
var roleHarvester = require('role.harvester');
var roleRepairer = require('role.repairer');
var roleUpgrader = require('role.upgrader');
var roleWallRepairer = require('role.wallrepairer');
var roleDistanceHarvester = require('role.distanceharvester');
var roleDistanceBuilder = require('role.distancebuilder');
var roleZergling = require('role.zergling');
var roleDefender = require('role.defender');




module.exports = function () {
	
	Creep.prototype.EStatus = {
		HARVEST : 0,
		DELIVER : 1,
		BUILD   : 2,
        GATHER  : 3,
        RECYCLE : 4
	};
	
    Creep.prototype.runRole = function () {
		//console.log(this.memory.role);
        if(this.hits < this.hitsMax){
            this.room.memory.hurtCreep = this.name;
        }
        switch (this.memory.role) {
			case 'defender':
				roleDefender.run(this);
                break;
            case 'gravedigger':
                roleGravedigger.run(this)
                break
            case 'harvester':
                roleHarvester.run(this);
                break;
            case 'upgrader':
                roleUpgrader.run(this);
				break;
            case 'builder':
                roleBuilder.run(this);
                break;
            case 'repairer':
                roleRepairer.run(this);
                break;
            case 'wallrepairer':
                roleWallRepairer.run(this);
                break;
            case 'distanceHarvester':
                roleDistanceHarvester.run(this);
                break;
            case 'distanceBuilder':
                roleDistanceBuilder.run(this);
                break;
            case 'carrier':
                roleCarrier.run(this);
                break;
            case 'controllerclaimer':
                roleControllerClaimer.run(this);
                break;
            case 'claimer':
                roleClaimer.run(this);
				break;
			case 'zergling':
				roleZergling.run(this);
				break;
        }
    };

    Creep.prototype.moveToTargetRoom = function () {
        var exitDir = this.room.findExitTo(this.memory.targetRoom)
        var exit = this.pos.findClosestByPath(exitDir)
		this.moveTo(exit)
    };

    Creep.prototype.moveToHomeRoom = function () {
        var exitDir = this.room.findExitTo(this.memory.homeRoom);
        var exit = this.pos.findClosestByPath(exitDir)
        this.moveTo(exit);
    };

    Creep.prototype.getEnergy = function (useContainer, usePickup) {
        let container, energy;
		switch(this.memory.role){
		case "harvester":
            if(this.harvest(Game.getObjectById(this.memory.source)) == ERR_NOT_IN_RANGE){
                if(!this.memory.path){
                    this.memory.path = this.pos.findPathTo(Game.getObjectById(this.memory.source))
                }
                this.moveByPath(this.memory.path)
            }
            /*
			if(this.harvest(Game.getObjectById(this.memory.source)) == ERR_NOT_IN_RANGE){
				this.moveTo(Game.getObjectById(this.memory.source));
			}
            return;
            */
		}
		
        if (useContainer) {
            container = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
            });
            if (container != undefined) {
                if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(container);
                }
            }
        }
        if (container == undefined) {
            if (usePickup) {
                energy = this.room.find(FIND_DROPPED_RESOURCES, { filter: (s) => s.resourceType == RESOURCE_ENERGY });
                if (energy.length) {
                    if (this.pickup(energy[0]) == ERR_NOT_IN_RANGE) {
                        this.moveTo(energy[0]);
                    }
                }
            }
            if (energy == undefined) {
                var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                    this.moveTo(source);
                }
            }
        }
    };
	
	Creep.prototype.acquireTarget = function () {
		if(this.memory.target == undefined || this.memory.target == null){
			switch(this.memory.role){
				case 'distanceHarvester':
				case 'harvester':
                    if(this.memory.target === undefined || this.memory.target === null){
                        this.memory.target = this.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity ||
                                        s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity ||
                                        s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity ||
                                        s.structureType == STRUCTURE_LINK && s.energy < s.energyCapacity
                    
					    });
                    }
					if(this.memory.target != undefined){
						this.memory.target = this.memory.target.id;
					}
                    break;
                case 'gravedigger':
				case 'carrier':
				    this.memory.target = this.pos.findClosestByPath(FIND_STRUCTURES, {
						filter: (s) => s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity ||
									   s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity ||
									   s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity
				    });
				    if(this.memory.target != undefined){
						this.memory.target = this.memory.target.id;
					}
				    break;
			}
		}
	}
}