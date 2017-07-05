require('prototype.spawn')();

var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');
var roleRepairer = require('role.repairer');
var roleUpgrader = require('role.upgrader');
var roleWallRepairer = require('role.wallrepairer');
var roleLongDistanceHarvester = require('role.longdistanceharvester');

var managerCreep = require('manager.creep');
var managerTower = require('manager.tower');

var construction = require('construction');

var HOME = 'E92N53';

module.exports.loop = function () {
    
    managerCreep.run();
    managerTower.run();
    
    
    for(var name in Game.creeps){
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            //construction.road(creep.room.controller.pos, new RoomPosition(30,33,'E92N53'));
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
            //construction.road(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'wallrepairer'){
            roleWallRepairer.run(creep);
        }
        if (creep.memory.role == 'longDistanceHarvester'); {
            //roleLongDistanceHarvester.run(creep);
        }
    }
}