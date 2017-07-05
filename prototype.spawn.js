module.exports = function() {
    StructureSpawn.prototype.createCustomCreep = function(energy, roleType){
        var numBodyParts = Math.floor(energy/200);
        body = [];
        
        for(var i = 0; i < numBodyParts; i++){
            body.push(WORK);
        }
        for(var i = 0; i < numBodyParts; i++){
            body.push(CARRY);
        }
        for(var i = 0; i < numBodyParts; i++){
            body.push(MOVE);
        }
        
        return this.createCreep(body, undefined, {role: roleType});
    };

    StructureSpawn.prototype.createLongDistanceHarvester = function (energy, numOfWorkParts, home, target, sourceIndex) {
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

        return this.createCreep(body, undefined, { role: 'longDistanceHarvester', home: home, target: target, sourceId: sourceIndex, working: false});
    }
};