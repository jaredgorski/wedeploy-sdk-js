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

import {assertDefAndNotNull, assertResponseSucceeded} from '../assertions';
import {MultiMap} from 'metal-structs';
import ApiHelper from '../ApiHelper';

/**
 * Class responsible for encapsulate email API calls.
 */
class EmailApiHelper extends ApiHelper {
  /**
   * Constructs an {@link EmailApiHelper} instance.
   * @param {!WeDeploy} wedeployClient {@link WeDeploy} client reference.
   * @param {!string} emailUrl The Url to Email service
   * @constructor
   */
  constructor(wedeployClient, emailUrl) {
    super(wedeployClient);
    this.emailUrl = emailUrl;
    this.params = new MultiMap();
  }

  /**
   * Set from attribute on params to be send on email request.
   * @param  {string} from Set `from` parameter to the request
   * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
   *   so calls can be chained
   * @chainable
   */
  from(from) {
    assertDefAndNotNull(from, 'Parameter "from" must be specified');

    this.params.set('from', from);

    return this;
  }

  /**
   * Set bcc attribute on params to be send on email request.
   * @param  {string} bcc Set `bcc` parameter to the request
   * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
   *   so calls can be chained
   * @chainable
   */
  bcc(bcc) {
    assertDefAndNotNull(bcc, 'Parameter "bcc" must be specified');

    this.params.add('bcc', bcc);

    return this;
  }

  /**
   * Set cc attribute on params to be send on email request.
   * @param  {string} cc Set `cc` parameter to the request
   * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
   *   so calls can be chained
   * @chainable
   */
  cc(cc) {
    assertDefAndNotNull(cc, 'Parameter "cc" must be specified');

    this.params.add('cc', cc);

    return this;
  }

  /**
   * Set message attribute on params to be send on email request.
   * @param  {string} message Set `message` parameter to the request
   * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
   *   so calls can be chained
   * @chainable
   */
  message(message) {
    assertDefAndNotNull(message, 'Parameter "message" must be specified');

    this.params.set('message', message);

    return this;
  }

  /**
   * Set priority attribute on params to be send on email request.
   * @param  {string} priority Set `priority` parameter to the request
   * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
   *   so calls can be chained
   * @chainable
   */
  priority(priority) {
    assertDefAndNotNull(priority, 'Parameter "priority" must be specified');

    this.params.set('priority', priority);

    return this;
  }

  /**
   * Set replyTo attribute on params to be send on email request.
   * @param  {string} replyTo Set `replyTo` parameter to the request
   * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
   *   so calls can be chained
   * @chainable
   */
  replyTo(replyTo) {
    assertDefAndNotNull(replyTo, 'Parameter "replyTo" must be specified');

    this.params.set('replyTo', replyTo);

    return this;
  }

  /**
   * Set to attribute on params to be send on email request.
   * @param  {string} to Set `to` parameter to the request
   * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
   *   so calls can be chained
   * @chainable
   */
  to(to) {
    assertDefAndNotNull(to, 'Parameter "to" must be specified');

    this.params.add('to', to);

    return this;
  }

  /**
   * Set subject attribute on params to be send on email request.
   * @param  {string} subject Set `subject` parameter to the request
   * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
   *   so calls can be chained
   * @chainable
   */
  subject(subject) {
    assertDefAndNotNull(subject, 'Parameter "subject" must be specified');

    this.params.set('subject', subject);

    return this;
  }

  /**
   * Sends an email based on given params.
   * @return {!CancellablePromise} Resolves with response body
   */
  send() {
    const client = this.buildUrl_().path('emails');

    this.params.names().forEach(name => {
      const values = this.params.getAll(name);

      values.forEach(value => {
        client.form(name, value);
      });
    });

    this.params.clear();
    this.headers_.clear();
    this.withCredentials_ = false;

    return client
      .post()
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body());
  }

  /**
   * Checks the status of an email.
   * @param  {string} emailId The Id of the email to be checked
   * @return {!CancellablePromise} Resolves with response body
   */
  status(emailId) {
    assertDefAndNotNull(emailId, 'Parameter "emailId" param must be specified');

    return this.buildUrl_()
      .path('emails', emailId, 'status')
      .get()
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body());
  }

  /**
   * Builds Url by joining headers, auth and withCredentials.
   * @return {WeDeploy} Returns the {@link WeDeploy} object itself, so calls can
   *   be chained
   * @chainable
   */
  buildUrl_() {
    return this.wedeployClient
      .url(this.emailUrl)
      .headers(this.headers_)
      .withCredentials(this.withCredentials_)
      .auth(this.helperAuthScope);
  }
}

export default EmailApiHelper;
