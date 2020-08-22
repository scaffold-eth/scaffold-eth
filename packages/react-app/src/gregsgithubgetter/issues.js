const { Core } = require("./core");

class Issues extends Core {
	constructor(owner, repo, token = null) {
		super(owner, repo, token);
	}
	
	getAll = async () => {
		try {
			return (await this.octokit.request(`GET /repos/${this.owner}/${this.repo}/issues`)).data;
		} catch (e) {
			throw e;
		}
	}

	get = async (issue_id) => {
		try {
			return (await this.octokit.request(`GET /repos/${this.owner}/${this.repo}/issues/${issue_id}`)).data;
		} catch (e) {
			throw e;
		}
	}
}

module.exports = {
	Issues,
}
