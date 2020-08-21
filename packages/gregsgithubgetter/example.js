const { Issues } = require("./src");

const ghIssues = new Issues("chainsafe", "lodestar", null);

(async () => {
	const allIssues = await ghIssues.getAll();
	console.log(allIssues);
	
	const specificIssue = await ghIssues.get(allIssues[0].number);
	console.log(specificIssue);
})()

