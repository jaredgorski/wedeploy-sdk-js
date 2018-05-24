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

import {assertDefAndNotNull} from './assertions';
import {MultiMap} from 'metal-structs';
import Auth from './auth/Auth';

/**
 * Class responsible for encapsulating API calls.
 */
class ApiHelper {
  /**
   * Constructs an {@link ApiHelper} instance.
   * @param {!WeDeploy} wedeployClient {@link WeDeploy} client reference.
   * @constructor
   */
  constructor(wedeployClient) {
    assertDefAndNotNull(
      wedeployClient,
      'WeDeploy client reference must be specified'
    );
    this.wedeployClient = wedeployClient;
    this.headers_ = new MultiMap();
    this.withCredentials_ = false;
  }

  /**
   * Adds a header. If a header with the same name already exists, it will not
   * be overwritten, but the new value will be stored as well. The order is
   * preserved.
   * @param {string} name
   * @param {string} value
   * @return {!ApiHelper} Returns the {@link ApiHelper}
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
   * Adds authorization information to this request.
   * @param {!Auth|string} authOrTokenOrEmail Either an {@link Auth} instance,
   * an authorization token, or the email.
   * @param {string=} opt_password If a email is given as the first param,
   * this should be the password.
   * @return {ApiHelper}
   * @chainable
   */
  auth(authOrTokenOrEmail, opt_password) {
    this.helperAuthScope = Auth.create(authOrTokenOrEmail, opt_password);
    this.helperAuthScope.wedeployClient = this.wedeployClient;
    return this;
  }

  /**
   * Assigns the passed value to the internal with credentials option.
   * @param {boolean} withCredentials
   * @return {ApiHelper} Returns the {@link ApiHelper} object itself, so calls
   *   can be chained.
   * @chainable
   */
  withCredentials(withCredentials) {
    this.withCredentials_ = !!withCredentials;
    return this;
  }
}

export default ApiHelper;
