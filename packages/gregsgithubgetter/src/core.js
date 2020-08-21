const { Octokit } = require("@octokit/core");

class Core {
	constructor(owner, repo, token = null) {
		this.owner = owner;
		this.repo = repo;
		
		const defaults = Octokit.defaults({
			auth: token
		});

		this.octokit = new defaults();
	}
}

module.exports = {
	Core,
}
