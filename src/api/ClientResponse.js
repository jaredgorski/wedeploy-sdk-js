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
import ClientMessage from './ClientMessage';

/**
 * Represents a client response object.
 * @extends {ClientMessage}
 */
class ClientResponse extends ClientMessage {
  /**
   * Constructs an {@link ClientResponse} instance.
   * @param {!ClientRequest} clientRequest Instance of {@link ClientRequest}
   *   object.
   * @constructor
   */
  constructor(clientRequest) {
    super();
    if (!clientRequest) {
      throw new Error('Can not create response without request');
    }
    this.clientRequest_ = clientRequest;
  }

  /**
   * Returns request that created this response.
   * @return {!ClientRequest}
   */
  request() {
    return this.clientRequest_;
  }

  /**
   * Fluent getter and setter for response status code.
   * @param {number=} opt_statusCode Request status code to be set. If none is
   *  given, the current status code value will be returned.
   * @return {!ClientMessage|number} Returns response status code if no new
   *   value was given. Otherwise returns the {@link ClientMessage} object
   *   itself, so calls can be chained.
   * @chainable Chainable when used as setter.
   */
  statusCode(opt_statusCode) {
    if (core.isDef(opt_statusCode)) {
      this.statusCode_ = opt_statusCode;
      return this;
    }
    return this.statusCode_;
  }

  /**
   * Fluent getter and setter for response status text.
   * @param {string=} opt_statusText Request status text to be set. If none is
   *   given, the current status text value will be returned.
   * @return {!ClientMessage|number} Returns response status text if no new
   *   value was given. Otherwise returns the {@link ClientMessage} object
   *   itself, so calls can be chained.
   * @chainable Chainable when used as setter.
   */
  statusText(opt_statusText) {
    if (core.isDef(opt_statusText)) {
      this.statusText_ = opt_statusText;
      return this;
    }
    return this.statusText_;
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
