const inquirer = require('inquirer');

const macros = require('./macros');

const redisHelpers = require('./redisHelpers');
const { displayError } = require('./displayHelpers');

async function askList(question, choices) {
	const numberPrompt = {
		type: 'list',
		name: 'answer',
		message: question,
		choices,
	};
	
	const { answer } = await inquirer.prompt(numberPrompt);
	
	return answer;
}
async function askString(question) {
	const stringPrompt = {
		type: 'input',
		name: 'answer',
		message: question,
	};
	
	const answers = await inquirer.prompt(stringPrompt);
	const answer = answers.answer?.trim();
	
	if (!answer) {
		displayError();
		return askString(question);
	}
	
	return answer;
}
async function askNumber(question) {
	const numberPrompt = {
		type: 'number',
		name: 'answer',
		message: question,
	};
	
	const { answer } = await inquirer.prompt(numberPrompt);
	
	if (Number.isNaN(answer)) {
		displayError();
		return askNumber(question);
	}
	
	return answer;
}
async function askConfirm(question) {
	const { answer } = await inquirer.prompt({
		type: 'confirm',
		name: 'answer',
		message: question,
	});
	return answer;
}

async function askName() {
	const registeredName = await redisHelpers.getKey('name');
	if (registeredName) {
		console.info(`Re-bonjour ${registeredName} !`);
		return registeredName;
	}
	
	const name = await askString("Tout d'abord, comment vous appelez-vous ?");
	console.info(`Enchanté de vous connaître ${name} !`);
	
	await redisHelpers.setKey('name', name);
	
	return name;
}
async function askCompanyName(profileName) {
	const registeredCompanyName = await redisHelpers.getKey('companyName');
	if (registeredCompanyName) {
		console.info(`Vous travaillez chez ${registeredCompanyName} si je ne m'abuse`);
		return registeredCompanyName;
	}
	
	const companyName = await askString('Ensuite, quel est le nom de votre société ?');
	console.info(`D'accord, ${profileName} de ${companyName} :-)`);
	
	await redisHelpers.setKey('companyName', companyName);
	
	return companyName;
}

async function askEmployees() {
	async function askEmployeesNumber() {
		const nbEmployees = await askNumber("Combien y a-t-il d'employés dans votre société ?");
		
		if (nbEmployees < 1) {
			console.error('Vous devez bien avoir au moins un employé, non ?');
			return askEmployeesNumber();
		}
		
		await redisHelpers.setKey('nbEmployees', nbEmployees);
		console.info(`Je vois, ${nbEmployees} employés donc !`);
		return nbEmployees;
	}
	async function askEmployeeNames(max, accumulator = [], current = 0) {
		if (current === max) {
			return accumulator;
		}
		
		accumulator[current] = await askString(`${current + 1} / ${max}: Quel est le nom de cet(te) employé(e) ?`);
		await redisHelpers.addToSet('employees', accumulator[current]);
		
		return askEmployeeNames(max, accumulator, current + 1);
	}
	
	
	const registeredEmployeesNumber = await redisHelpers.getKey('nbEmployees');
	const nbEmployees = registeredEmployeesNumber || await askEmployeesNumber();
	
	const registeredEmployees = await redisHelpers.getSet('employees');
	if (registeredEmployees.length === nbEmployees) {
		return registeredEmployees;
	}
	
	return [
		...registeredEmployees,
		...await askEmployeeNames(nbEmployees - registeredEmployees.length)
	];
}
async function askTrucks() {
	async function askTrucksNumber() {
		const nbTrucks = await askNumber('Et pour finir, de combien de camions votre société dispose-t-elle ?');
		
		if (nbTrucks < 1) {
			console.error('Cela va être compliqué de livrer sans camion, vous êtes sûr(e) de ne pas en avoir au moins un ? ;-)');
			return askTrucksNumber();
		}
		
		await redisHelpers.setKey('nbTrucks', nbTrucks);
		console.info(`C'est noté, ${nbTrucks} camions !`);
		return nbTrucks;
	}
	async function askTrucksSpecs(max, accumulator = [], current = 0) {
		if (current === max) {
			return accumulator;
		}
		
		const volume = await askNumber(`${current + 1} / ${max}: Quel est le volume de ce camion (m3) ?`);
		const type = await askList(`${current + 1} / ${max}: Quel type de camion est-ce ?`, Object.values(macros.TRUCKS_TYPES));
		accumulator[current] = { volume, type };
		await redisHelpers.addToSet('trucks', JSON.stringify(accumulator[current]));
		
		return askTrucksSpecs(max, accumulator, current + 1);
	}
	
	
	const registeredTrucksNumber = await redisHelpers.getKey('nbTrucks');
	const nbTrucks = registeredTrucksNumber || await askTrucksNumber();
	
	const registeredTrucks = (await redisHelpers.getSet('trucks'))
		.reduce((trucks, truck) => {
			trucks.push(JSON.parse(truck));
			return trucks;
		}, []);
	
	if (registeredTrucks.length === registeredTrucksNumber) {
		return registeredTrucks;
	}
	
	return [
		...registeredTrucks,
		...await askTrucksSpecs(nbTrucks - registeredTrucks.length),
	];
}

module.exports = {
	askName, askCompanyName,
	askEmployees, askTrucks,
	askConfirm,
}
