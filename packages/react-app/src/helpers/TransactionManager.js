const { BigNumber, ethers } = require("ethers");

const STORAGE_KEY = "transactionResponses";
const LOCAL_STORAGE_CHANGED_EVENT_NAME = "localStorageChanged";

export class TransactionManager {
	constructor(provider, signer, loggingEnabled) {
		this.provider = provider;
		this.signer = signer;
		this.loggingEnabled = loggingEnabled ? loggingEnabled : false
	}

	log = (...args) => {
		if (!this.loggingEnabled) {
			return;
		}

  	console.log(...args);
	}

	getStorageKey() {
		return STORAGE_KEY;
	}

	getTransactionResponseKey(transactionResponse) {
		return transactionResponse?.nonce + "_" + transactionResponse?.chainId;
	}

	getLocalStorageChangedEventName() {
		return LOCAL_STORAGE_CHANGED_EVENT_NAME;
	}

	getTransactionResponses() {
		let transactionResponsesString = localStorage.getItem(STORAGE_KEY);

		if (transactionResponsesString === null) {
			return {};
		}

		return JSON.parse(transactionResponsesString);
	}
	setTransactionResponses(transactionResponses) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(transactionResponses));

		// StorageEvent doesn't work in the same window
		window.dispatchEvent(new CustomEvent(LOCAL_STORAGE_CHANGED_EVENT_NAME));
	}

	getTransactionResponse(key) {
		let transactionResponses = this.getTransactionResponses();

		return transactionResponses[key];
	}
	setTransactionResponse(transactionResponse) {
		transactionResponse.date = new Date();

		let transactionResponses = this.getTransactionResponses();

		transactionResponses[this.getTransactionResponseKey(transactionResponse)] = transactionResponse;

		this.setTransactionResponses(transactionResponses);
	}
	removeTransactionResponse(transactionResponse) {
		let transactionResponses = this.getTransactionResponses();

		delete transactionResponses[this.getTransactionResponseKey(transactionResponse)];

		this.setTransactionResponses(transactionResponses);
	}
	async updateTransactionResponse(transactionResponse) {
		let newTransactionResponse = await this.provider.getTransaction(transactionResponse.hash);

		this.setTransactionResponse(newTransactionResponse ? newTransactionResponse : transactionResponse);
	}

	getTransactionResponsesArray() {
		let transactionResponses = this.getTransactionResponses();

		if (Object.keys(transactionResponses).length === 0) {
			return [];
		}

		this.fixTransactionResponsesKey(transactionResponses);

		let transactionResponsesArray = [];

		let keysArray = Object.keys(transactionResponses);

		keysArray.forEach(key => {
			transactionResponsesArray.push(transactionResponses[key]);
		})

		return transactionResponsesArray;
	}


	// Using transactionResponse?.nonce + transactionResponse?.chainId as a key was not a good idea
	fixTransactionResponsesKey(transactionResponses) {
		let newTransactionResponses = {};

		let keysArray = Object.keys(transactionResponses);

		keysArray.forEach(key => {
			if (key == (transactionResponses[key].nonce + transactionResponses[key].chainId)) {
				newTransactionResponses[this.getTransactionResponseKey(transactionResponses[key])] = transactionResponses[key];
			}
			else {
				return;
			}
		})

		if (Object.keys(newTransactionResponses).length > 0) {
			console.log("newTransactionResponses", newTransactionResponses);
			this.setTransactionResponses(newTransactionResponses);
		}
	}

	async getConfirmations(transactionResponse) {
		let newTransactionResponse = await this.provider.getTransaction(transactionResponse.hash);

		if (!newTransactionResponse) {
			this.log("getConfirmations newTransactionResponse is undefined", transactionResponse);

			// I'm not sure what is this case, but it happened
			// Maybe the transaction was just confirmed when SpeedUpTx button was hit, resulting in the previous response to be confirmed, 
			// and the new sped up hash to be invalid
			// Also, sometimes the provider is faulty and returns null
			let nonce = await this.provider.getTransactionCount(transactionResponse.from);

			if (transactionResponse.nonce <= (nonce - 1)) {
				console.log("getConfirmations nonce is already used", transactionResponse);
				// Transaction with the same nonce was already confirmed
				transactionResponse.confirmations = 100;
				this.updateTransactionResponse(transactionResponse);

				return -1;
			}

			return 0;
		}

		return newTransactionResponse.confirmations;
	}	

	async isTransactionPending(transactionResponse) {
		let confirmations = await this.getConfirmations(transactionResponse);

		return !(confirmations > 0);
	}

	cancelTransaction(key) {
		let transactionParams = this.getSpeedUpTransactionParams(key, 10);

		transactionParams.to = transactionParams.from;
		transactionParams.data = "0x";
		transactionParams.value = "0x";
		this.log("transactionParams", transactionParams);

		return this.signer.sendTransaction(transactionParams);
	}
	
	speedUpTransaction(key, speedUpPercentage) {
		if (!speedUpPercentage) {
			speedUpPercentage = 10;
		}

		let transactionParams = this.getSpeedUpTransactionParams(key, speedUpPercentage);
		this.log("transactionParams", transactionParams);

		if (!transactionParams) {
			return;
		}

		return this.signer.sendTransaction(transactionParams);
	}

	getSpeedUpTransactionParams(key, speedUpPercentage) {
		let transactionResponse = this.getTransactionResponse(key);

		if (!transactionResponse) {
			return undefined;
		}

		let transactionParams = this.getTransactionParams(transactionResponse);

		// Legacy txs
		if (transactionParams.gasPrice) {
			transactionParams.gasPrice = this.getUpdatedGasPrice(transactionParams.gasPrice, speedUpPercentage);
		}
		// EIP1559
		else {
			transactionParams.maxPriorityFeePerGas = this.getUpdatedGasPrice(transactionParams.maxPriorityFeePerGas, speedUpPercentage);
			
			// This shouldn't be necessary, but without it polygon fails way too many times with "replacement transaction underpriced"
			transactionParams.maxFeePerGas = this.getUpdatedGasPrice(transactionParams.maxFeePerGas, speedUpPercentage);
		}

		return transactionParams;
	}

	getTransactionParams(transactionResponse) {
		if (!transactionResponse) {
			return {};
		}

		let transactionParams = {};

		["type", "chainId", "nonce", "maxPriorityFeePerGas", "maxFeePerGas", "gasPrice", "gasLimit", "from", "to", "value", "data"].forEach(param => {
			this.addTransactionParamIfExists(transactionParams, param, transactionResponse[param]);
		})
		
		return transactionParams;
	}
	getUpdatedGasPrice(gasPrice, speedUpPercentage) {
		let gasPriceBigNumber = BigNumber.from(gasPrice);

		gasPriceBigNumber = gasPriceBigNumber.mul(speedUpPercentage + 100).div(100);

		return gasPriceBigNumber.toHexString();
	}
	addTransactionParamIfExists(transactionParams, param, value) {
		if ((value == 0) || (value && value != null)) {
			if (["maxPriorityFeePerGas", "maxFeePerGas", "gasPrice", "gasLimit", "value"].indexOf(param) > -1) {
				value = BigNumber.from(value).toHexString();
			}

			transactionParams[param] = value;
		}
	}
}




