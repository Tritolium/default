module.exports = { //TODO before recycling the creep, check for other tombstones and dumped resources
    run: function(creep){
        switch(creep.memory.state){
        case creep.EStatus.GATHER:
            let tombstone = Game.getObjectById(creep.memory.tombstone)
            switch(creep.withdraw(tombstone, RESOURCE_ENERGY)){
            case ERR_NOT_IN_RANGE:
                if(!creep.memory.path){
                    creep.memory.path = creep.pos.findPathTo(tombstone)
                }
                creep.moveByPath(creep.memory.path)
                break
            case ERR_NOT_ENOUGH_RESOURCES:
                creep.memory.state = creep.EStatus.RECYCLE
                creep.memory.path = undefined
                break
            case ERR_FULL:
                creep.memory.state = creep.EStatus.DELIVER
                creep.memory.path = undefined
                break
            case ERR_INVALID_TARGET:
                creep.memory.state = creep.EStatus.RECYCLE
                creep.memory.path = undefined
            }
            break
        case creep.EStatus.DELIVER:
            creep.acquireTarget()
            if(creep.memory.target != undefined){
                switch(creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY)){
                case ERR_NOT_IN_RANGE:
                    if(!creep.memory.path){
                        creep.memory.path = creep.pos.findPathTo(Game.getObjectById(creep.memory.target))
                    }
                    creep.moveByPath(creep.memory.path)
                    break
                case ERR_FULL:
                    creep.memory.target = undefined
                    creep.memory.path = undefined
                    break
                }
            }
            if(creep.carry.energy == 0) {
                creep.memory.state = creep.EStatus.HARVEST
                creep.memory.path = undefined
                creep.memory.target = undefined
            }
            break
        case creep.EStatus.RECYCLE:
            if(!creep.memory.target){
                creep.memory.target = creep.pos.findClosestByPath(FIND_MY_SPAWNS).id
            }
            if(creep.memory.path != undefined){
                creep.memory.path = creep.pos.findPathTo(Game.getObjectById(creep.memory.target))
            }
            if(Game.getObjectById(creep.memory.target).recycleCreep(creep) == ERR_NOT_IN_RANGE){
                creep.moveByPath(creep.memory.path)
            }
            break
        default:
            creep.memory.state = creep.EStatus.GATHER
        }
    }
}