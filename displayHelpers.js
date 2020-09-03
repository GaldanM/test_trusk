const errorMessages = [
	"Hmm, il semblerait que vous n'ayez pas répondu correctement à la question !",
	"Aïe, je n'arrive pas à comprendre votre réponse à ma question :/",
	"Ah... pas sûr que cela réponde correctement à ma question...",
	"Intéressant... mais je ne peux pas considérer ceci comme une réponse valable !",
];

function displayError() {
	console.error(errorMessages[Math.floor(Math.random() * errorMessages.length)]);
}

function displayProfile(profile) {
	console.info('------------------------------------');
	console.info(`Nom: ${profile.name}`);
	console.info(`Société: ${profile.companyName}`);
	console.info('------------------------------------');
	console.info(`Employés:\n${profile.employeeNames
		.map(e => `- ${e}`)
		.join('\n')}`);
	console.info('------------------------------------');
	console.info(`Camions:\n${profile.trucks
		.map(t => `- ${t.type} de ${t.volume} m3`)
		.join('\n')}`);
	console.info('------------------------------------');
}

module.exports = {
	displayError,
	displayProfile,
}
