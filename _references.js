/// <reference path="construction.js" />
/// <reference path="main.js" />
/// <reference path="manager.creep.js" />
/// <reference path="manager.tower.js" />
/// <reference path="prototype.creep.js" />
/// <reference path="prototype.spawn.js" />
/// <reference path="role.builder.js" />
/// <reference path="role.carrier.js" />
/// <reference path="role.claimer.js" />
/// <reference path="role.distancebuilder.js" />
/// <reference path="role.distanceharvester.js" />
/// <reference path="role.harvester.js" />
/// <reference path="role.repairer.js" />
/// <reference path="role.upgrader.js" />
/// <reference path="role.wallrepairer.js" />
/// <reference path="ScreepsAutocomplete-master/ConstructionSite.js" />
/// <reference path="ScreepsAutocomplete-master/Creep.js" />
/// <reference path="ScreepsAutocomplete-master/Flag.js" />
/// <reference path="ScreepsAutocomplete-master/Game.js" />
/// <reference path="ScreepsAutocomplete-master/Global/Constants.js" />
/// <reference path="ScreepsAutocomplete-master/Memory.js" />
/// <reference path="ScreepsAutocomplete-master/Mineral.js" />
/// <reference path="ScreepsAutocomplete-master/Nuke.js" />
/// <reference path="ScreepsAutocomplete-master/Order.js" />
/// <reference path="ScreepsAutocomplete-master/OwnedStructure.js" />
/// <reference path="ScreepsAutocomplete-master/PathFinder.js" />
/// <reference path="ScreepsAutocomplete-master/prototype.creep.js" />
/// <reference path="ScreepsAutocomplete-master/RawMemory.js" />
/// <reference path="ScreepsAutocomplete-master/Resource.js" />
/// <reference path="ScreepsAutocomplete-master/Room.js" />
/// <reference path="ScreepsAutocomplete-master/RoomObject.js" />
/// <reference path="ScreepsAutocomplete-master/RoomPosition.js" />
/// <reference path="ScreepsAutocomplete-master/Source.js" />
/// <reference path="ScreepsAutocomplete-master/Structure.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureContainer.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureController.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureExtension.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureExtractor.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureKeeperLair.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureLab.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureLink.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureNuker.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureObserver.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructurePortal.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructurePowerBank.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructurePowerSpawn.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureRampart.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureRoad.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureSpawn.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureStorage.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureTerminal.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureTower.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureWall.js" />
ï»¿/// <reference path="construction.js" />
/// <reference path="main.js" />
/// <reference path="manager.creep.js" />
/// <reference path="manager.tower.js" />
/// <reference path="prototype.spawn.js" />
/// <reference path="role.builder.js" />
/// <reference path="role.harvester.js" />
/// <reference path="role.longdistanceharvester.js" />
/// <reference path="role.repairer.js" />
/// <reference path="role.upgrader.js" />
/// <reference path="role.wallrepairer.js" />
/// <reference path="ScreepsAutocomplete-master/ConstructionSite.js" />
/// <reference path="ScreepsAutocomplete-master/Creep.js" />
/// <reference path="ScreepsAutocomplete-master/Flag.js" />
/// <reference path="ScreepsAutocomplete-master/Game.js" />
/// <reference path="ScreepsAutocomplete-master/Global/Constants.js" />
/// <reference path="ScreepsAutocomplete-master/Memory.js" />
/// <reference path="ScreepsAutocomplete-master/Mineral.js" />
/// <reference path="ScreepsAutocomplete-master/Nuke.js" />
/// <reference path="ScreepsAutocomplete-master/Order.js" />
/// <reference path="ScreepsAutocomplete-master/OwnedStructure.js" />
/// <reference path="ScreepsAutocomplete-master/PathFinder.js" />
/// <reference path="ScreepsAutocomplete-master/prototype.creep.js" />
/// <reference path="ScreepsAutocomplete-master/RawMemory.js" />
/// <reference path="ScreepsAutocomplete-master/Resource.js" />
/// <reference path="ScreepsAutocomplete-master/Room.js" />
/// <reference path="ScreepsAutocomplete-master/RoomObject.js" />
/// <reference path="ScreepsAutocomplete-master/RoomPosition.js" />
/// <reference path="ScreepsAutocomplete-master/Source.js" />
/// <reference path="ScreepsAutocomplete-master/Structure.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureContainer.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureController.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureExtension.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureExtractor.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureKeeperLair.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureLab.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureLink.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureNuker.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureObserver.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructurePortal.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructurePowerBank.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructurePowerSpawn.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureRampart.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureRoad.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureSpawn.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureStorage.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureTerminal.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureTower.js" />
/// <reference path="ScreepsAutocomplete-master/Structures/StructureWall.js" />
