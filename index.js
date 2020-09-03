const redisHelpers = require('./redisHelpers');

const {
	askName, askCompanyName,
	askEmployees, askTrucks,
	askConfirm,
} = require('./askHelpers');
const { displayProfile } = require('./displayHelpers');

async function askProfile() {
	const profile = {};
	
	console.info(`Bonjour, je suis Truskbot, je suis chargé de vous guider durant votre inscription !`);
	
	profile.name = await askName();
	profile.companyName = await askCompanyName(profile.name)
	profile.employeeNames = await askEmployees();
	profile.trucks = await askTrucks();
	
	displayProfile(profile);
	const isOk = await askConfirm('Ces informations sont elles valides ?');
	if (!isOk) {
		console.info('Très bien, recommençons tout depuis le début ;-)')
		await redisHelpers.flushAll();
		return askProfile();
	}
	
	console.info('Merci de votre inscription chez Trusk, nous reviendrons vers vous dans les plus brefs délais !');
	await redisHelpers.flushAll();
	process.exit(0);
}

(async () => {
	try {
		await askProfile();
	} catch (err) {
		console.error("Mince, quelque chose s'est mal passé de mon côté, je vous prie de m'en excuser...");
	}
})();
