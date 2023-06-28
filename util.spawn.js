module.exports = function() {
    StructureSpawn.prototype.rateSpawn = function(){
        var stats = this.memory.stats
        stats.rate = stats.busy/stats.idle

        return stats.rate
    },

    StructureSpawn.prototype.resetStats = function(){
        this.memory.stats.busy = 0
        this.memory.stats.idle = 0
        this.memory.stats.rate = 0

        return OK
    },

    StructureSpawn.prototype.setup = function(){
        this.memory.stats = {}
    }
}