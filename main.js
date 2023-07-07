require('prototype.spawn')();
require('prototype.creep')();

//var managerCreep = require('manager.creep');
//var managerTower = require('manager.tower')
var scheduler = require('scheduler.spawning')

//var construction = require('construction');

var HOME = 'E44S33';

let elapsed

module.exports.loop = function () {
	let bucket = Game.cpu.bucket;
	const StartCpu = Game.cpu.getUsed();
	console.log(bucket);

	Game.rooms.E44S33.memory.properties = {
		minBuilder: 2,
		minUpgrader: 2,
		minRepairer: 1,
		minDistanceHarvester: 3,

		distanceHarvest: true,

		harvestTargets: [
			'E43S33',
			'E45S33'
		]
	}
    if(bucket > 1000)
	    scheduler.checkSchedule(HOME)
	else
	    console.log('skip schedule')
	   
	elapsed = Game.cpu.getUsed() - StartCpu;
    console.log(elapsed);
	
	if(bucket > 9000){
	    for (var name in Memory.creeps) {		//defrac memory
		    if (!Game.creeps[name]) {
		    	delete Memory.creeps[name];
	    	}
    	}
	}
	
	elapsed = Game.cpu.getUsed() - StartCpu;
    console.log(elapsed);

	
	//managerCreep.run();
    //managerTower.run();
	
	if(bucket > 50){
		for(var name in Game.spawns){
			Game.spawns[name].spawn();
		}
	} else {
		console.log('skip spawn');
	}
	
	elapsed = Game.cpu.getUsed() - StartCpu;
    console.log(elapsed);
	
    if(bucket > 20){
		for(var name in Game.creeps){
		    elapsed = Game.cpu.getUsed() - StartCpu;
			Game.creeps[name].runRole();
			elapsed = Game.cpu.getUsed() - StartCpu;
		}
	} else {
		console.log('skip creep');
	}
	
	elapsed = Game.cpu.getUsed() - StartCpu;
    console.log(elapsed);
	console.log('---------------------------');
}
