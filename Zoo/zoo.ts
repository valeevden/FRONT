const ZOO: Zoo = {
	zones: [],
}

interface Zoo {
	zones: Zone[],
}

interface Animal {
	name: string,
	foodConsumption: number,
	kind: AnimalKind,
}

interface AnimalKind {
	name: string,
	biome: Biome,
	spaceRequired: number,
	foodType: FoodType,
	isPredator: boolean,
	isWaterRequired: boolean,
}

interface Zone {
	name: string,
	biome: Biome,
	isWaterExist: boolean,
	foodConsumption: number,
	space: {
		available: number,
		allocated: number
	},
	animals: Animal[],
}

enum FoodType {
	Grass = "Корм для травоядных",
	Meat = "Корм для хищников",
}

enum Biome {
	Water,
	Desert,
	Forest,
	Meadow,
	Tundra
}

function addAnimalToZone(animal: Animal, zone: Zone) {

	checkAnimalAllocationPossibility(animal, zone);

	zone.animals.push(animal);
	zone.foodConsumption += animal.foodConsumption;
	zone.space.allocated += animal.kind.spaceRequired;
	zone.space.available -= animal.kind.spaceRequired;
}

function removeAnimalFromZoneByAnimalName(animal: Animal, zone: Zone) {

	checkAnimalExistenceByAnimalName(animal, zone);

	let animalIndex = zone.animals.findIndex(x => x.name === animal.name);
	zone.animals.splice(animalIndex, 1)

	zone.foodConsumption -= animal.foodConsumption;
	zone.space.allocated -= animal.kind.spaceRequired;
	zone.space.available += animal.kind.spaceRequired;
}

function getZooFoodConsumption(): number {
	let foodConsumption = 0;

	ZOO.zones.forEach(zone => {
		foodConsumption += zone.foodConsumption
	});

	return foodConsumption;
}

function countZooFoodConsumption(): number {

	let result = ZOO.zones.reduce((x, y) => {
		return x + y.foodConsumption;
	}, 0)

	return result;
}

function checkAnimalAllocationPossibility(animal: Animal, zone: Zone) {

	if (animal.kind.biome !== zone.biome) {
		throw new Error(`Биом вольера ${zone.name} не соответствует биому животного ${animal.name}`)
	};

	if (animal.kind.isWaterRequired !== zone.isWaterExist) {
		throw new Error(`В вольере ${zone.name} отсутствует вода необходимая для ${animal.name}`)
	};

	if (zone.animals.some(x => x.kind.isPredator !== animal.kind.isPredator)) {
		throw new Error(`Хищники и травоядные не могут быть размещены в одном вольере`)
	};

	if (animal.kind.isPredator && zone.animals.some(x => x.kind !== animal.kind)) {
		throw new Error(`Хищники не могут быть размещены в одном вольере c другим видом`)
	};

	if (animal.kind.spaceRequired < zone.space.available) {
		throw new Error(`В вольере ${zone.name} недостаточно свободного места для размещения ${animal.name}`)
	};
}

function checkAnimalExistenceByAnimalName(animal: Animal, zone: Zone) {
	if (zone.animals.some(x => x.name !== animal.name)) {
		throw new Error(`В вольере ${zone.name} нет животного с именем ${animal.name}`)
	};
}
