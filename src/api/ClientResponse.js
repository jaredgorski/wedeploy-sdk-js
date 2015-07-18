'use strict';

import core from 'bower:metal/src/core';
import ClientMessage from './ClientMessage';

/**
 */
class ClientResponse extends ClientMessage {

	constructor(clientRequest) {
		super();
		if (!clientRequest) {
			throw new Error('Can\'t create response without request');
		}
		this.clientRequest_ = clientRequest;
	}

	/**
	 * Returns request that created this response.
	 * @return {ClientRequest}
	 */
	request() {
		return this.clientRequest_;
	}

	/**
	 * Fluent getter and setter for response status code.
	 * @param {number} opt_statusCode Request status code to be set.
	 * @return {number} Returns response status code.
	 */
	statusCode(opt_statusCode) {
		if (core.isDef(opt_statusCode)) {
			this.statusCode_ = opt_statusCode;
			return this;
		}
		return this.statusCode_;
	}

	/**
	 * Checks if response succeeded. Any status code 2xx or 3xx is considered
	 * valid.
	 * @return {boolean}
	 */
	succeeded() {
		return this.statusCode() >= 200 && this.statusCode() <= 399;
	}

}

export default ClientResponse;
