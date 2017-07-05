var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');
var roleRepairer = require('role.repairer');
var roleUpgrader = require('role.upgrader');
var roleWallRepairer = require('role.wallrepairer');
var roleLongDistanceHarvester = require('role.longdistanceharvester');

module.exports = {
    Creep.prototype.runRole = function(creep) {
        switch(creep.memory.role){
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'repairer':
                roleRepairer.run(creep);
                break;
            case 'wallrepairer':
                roleWallRepairer.run(creep);
                break;
            case 'longDistanceHarvester':
                roleLongDistanceHarvester.run(creep);
                break;
        }
    }
}