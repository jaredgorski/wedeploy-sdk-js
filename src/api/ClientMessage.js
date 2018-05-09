/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Liferay, Inc. nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

import {core} from 'metal';
import {MultiMap} from 'metal-structs';

/**
 * Represents a client message (e.g. a request or a response).
 */
class ClientMessage {
  /**
	 * Constructs an {@link ClientMessage} instance.
	 * @constructor
	 */
  constructor() {
    this.headers_ = new MultiMap();
  }

  /**
	 * Fluent getter and setter for request body.
	 * @param {*=} opt_body Request body to be set. If none is given,
	 *   the current value of the body will be returned.
	 * @return {*} Returns request body if no body value was given. Otherwise
	 *   returns the {@link ClientMessage} object itself, so calls can be chained.
	 * @chainable Chainable when used as setter.
	 */
  body(opt_body) {
    if (core.isDef(opt_body)) {
      this.body_ = opt_body;
      return this;
    }
    return this.body_;
  }

  /**
	 * Adds a header. If a header with the same name already exists, it will not
	 * be overwritten, but the new value will be stored as well. The order is
	 * preserved.
	 * @param {string} name
	 * @param {string} value
	 * @return {!ClientMessage} Returns the {@link ClientMessage}
	 *   object itself, so calls can be chained.
	 * @chainable
	 */
  header(name, value) {
    if (arguments.length !== 2) {
      throw new Error('Invalid arguments');
    }
    this.headers_.set(name, value);
    return this;
  }

  /**
	 * Fluent getter and setter for request headers.
	 * @param {MultiMap|Object=} opt_headers Request headers list to
	 *   be set. If none is given the current value of the headers will
	 *   be returned.
	 * @return {!MultiMap|ClientMessage} Returns map of request headers
	 *   if no new value was given. Otherwise returns the {@link ClientMessage}
	 *   object itself, so calls can be chained.
	 * @chainable Chainable when used as setter.
	 */
  headers(opt_headers) {
    if (core.isDef(opt_headers)) {
      if (opt_headers instanceof MultiMap) {
        this.headers_ = opt_headers;
      } else {
        this.headers_.values = opt_headers;
      }
      return opt_headers;
    }
    return this.headers_;
  }

  /**
	 * Removes the body.
	 */
  removeBody() {
    this.body_ = undefined;
  }
}

export default ClientMessage;
