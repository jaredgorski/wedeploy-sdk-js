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

import {core, isDef, isDefAndNotNull, isObject, isString} from 'metal';
import {MultiMap} from 'metal-structs';

import {
  assertDefAndNotNull,
  assertObject,
  assertResponseSucceeded,
} from '../assertions';

/**
 * Class responsible for storing authorization information.
 */
class Auth {
  /**
   * Constructs an {@link Auth} instance.
   * @param {string} tokenOrEmail Either the authorization token, or
   *   the username.
   * @param {string=} opt_password If a username is given as the first param,
   *   this should be the password.
   * @constructor
   */
  constructor(tokenOrEmail, opt_password = null) {
    this.token = core.isString(opt_password) ? null : tokenOrEmail;
    this.email = core.isString(opt_password) ? tokenOrEmail : null;
    this.password = opt_password;

    this.createdAt = null;
    this.id = null;
    this.name = null;
    this.photoUrl = null;
    this.supportedScopes = [];
    this.wedeployClient = null;
    this.data_ = null;
    this.headers_ = new MultiMap();
  }

  /**
   * Constructs an {@link Auth} instance.
   * @param {string} authOrTokenOrEmail Either an auth instance, the
   *   authorization token, or the username.
   * @param {string=} opt_password If a username is given as the first param,
   *   this should be the password.
   * @return {!Auth}
   */
  static create(authOrTokenOrEmail, opt_password) {
    if (authOrTokenOrEmail instanceof Auth) {
      return authOrTokenOrEmail;
    } else if (isString(authOrTokenOrEmail) && isString(opt_password)) {
      return new Auth(authOrTokenOrEmail, opt_password);
    } else if (isString(authOrTokenOrEmail) && !isDef(opt_password)) {
      return new Auth(authOrTokenOrEmail);
    } else if (
      isDefAndNotNull(authOrTokenOrEmail) &&
      isObject(authOrTokenOrEmail)
    ) {
      return Auth.createFromData(authOrTokenOrEmail);
    } else {
      return new Auth();
    }
  }

  /**
   * Makes user Auth from data object.
   * @param {Object} data
   * @param {?string=} authUrl
   * @return {Auth}
   * @protected
   */
  static createFromData(data, authUrl) {
    let auth = new Auth();
    if (isObject(data)) {
      auth.data_ = data;
      let properties = {};
      Object.keys(data).forEach(key => {
        properties[key] = {
          enumerable: true,
          value: data[key],
          writable: true,
        };
      });
      Object.defineProperties(auth, properties);
    }
    auth.setWedeployClient(this.wedeployClient, authUrl);
    return auth;
  }

  /**
   * Gets the created at date.
   * @return {string}
   */
  getCreatedAt() {
    return this.createdAt;
  }

  /**
   * Gets the auth data
   * @return {Object}
   */
  getData() {
    return this.data_;
  }

  /**
   * Gets the email.
   * @return {string}
   */
  getEmail() {
    return this.email;
  }

  /**
   * Gets the id.
   * @return {string}
   */
  getId() {
    return this.id;
  }

  /**
   * Gets the name.
   * @return {string}
   */
  getName() {
    return this.name;
  }

  /**
   * Gets the password.
   * @return {string}
   */
  getPassword() {
    return this.password;
  }

  /**
   * Gets the photo url.
   * @return {string}
   */
  getPhotoUrl() {
    return this.photoUrl;
  }

  /**
   * Gets the supported scopes.
   * @return {array.<string>}
   */
  getSupportedScopes() {
    return this.supportedScopes;
  }

  /**
   * Gets the token.
   * @return {string}
   */
  getToken() {
    return this.token;
  }

  /**
   * Checks if created at is set.
   * @return {boolean}
   */
  hasCreatedAt() {
    return core.isDefAndNotNull(this.createdAt);
  }

  /**
   * Checks if data is set.
   * @return {boolean}
   */
  hasData() {
    return core.isDefAndNotNull(this.data_);
  }

  /**
   * Checks if the email is set.
   * @return {boolean}
   */
  hasEmail() {
    return core.isDefAndNotNull(this.email);
  }

  /**
   * Checks if the id is set.
   * @return {boolean}
   */
  hasId() {
    return core.isDefAndNotNull(this.id);
  }

  /**
   * Checks if the name is set.
   * @return {boolean}
   */
  hasName() {
    return core.isDefAndNotNull(this.name);
  }

  /**
   * Checks if the password is set.
   * @return {boolean}
   */
  hasPassword() {
    return core.isDefAndNotNull(this.password);
  }

  /**
   * Checks if the photo url is set.
   * @return {boolean}
   */
  hasPhotoUrl() {
    return core.isDefAndNotNull(this.photoUrl);
  }

  /**
   * Checks if the user has scopes.
   * @param {string|array.<string>} scopes Scope or array of scopes to check.
   * @return {boolean}
   */
  hasSupportedScopes(scopes) {
    if (Array.isArray(scopes)) {
      return scopes.every(val => this.supportedScopes.indexOf(val) > -1);
    } else {
      return this.supportedScopes.indexOf(scopes) > -1;
    }
  }

  /**
   * Checks if the token is set.
   * @return {boolean}
   */
  hasToken() {
    return core.isDefAndNotNull(this.token);
  }

  /**
   * Sets created at.
   * @param {string} createdAt
   */
  setCreatedAt(createdAt) {
    this.createdAt = createdAt;
  }

  /**
   * Sets data.
   * @param {Object} data
   */
  setData(data) {
    this.data_ = data;
  }

  /**
   * Sets the email.
   * @param {string} email
   */
  setEmail(email) {
    this.email = email;
  }

  /**
   * Sets the headers.
   * @param {!MultiMap|Object} headers The headers to be set
   */
  setHeaders(headers) {
    if (!(headers instanceof MultiMap)) {
      headers = MultiMap.fromObject(headers);
    }

    headers.names().forEach(name => {
      const values = headers.getAll(name);

      values.forEach(value => {
        this.headers_.set(name, value);
      });
    });
  }

  /**
   * Sets the id.
   * @param {string} id
   */
  setId(id) {
    this.id = id;
  }

  /**
   * Sets the name.
   * @param {string} name
   */
  setName(name) {
    this.name = name;
  }

  /**
   * Sets the password.
   * @param {string} password
   */
  setPassword(password) {
    this.password = password;
  }

  /**
   * Sets the photo url.
   * @param {string} photoUrl
   */
  setPhotoUrl(photoUrl) {
    this.photoUrl = photoUrl;
  }

  /**
   * Sets supported scopes.
   * @param {array.<string>} supportedScopes
   */
  setSupportedScopes(supportedScopes) {
    this.supportedScopes = supportedScopes;
  }

  /**
   * Sets the token.
   * @param {string} token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Sets the WeDeploy client.
   * @param {Object} wedeployClient
   * @param {?string=} authUrl
   */
  setWedeployClient(wedeployClient, authUrl) {
    this.authUrl = authUrl;
    this.wedeployClient = wedeployClient;
  }

  /**
   * Updates the user.
   * @param {!Object} data
   * @return {CompletableFuture}
   */
  updateUser(data) {
    assertObject(data, 'User data must be specified as object');
    return this.buildUrl_()
      .path('/users', this.getId().toString())
      .auth(this)
      .patch(data)
      .then(response => assertResponseSucceeded(response));
  }

  /**
   * Deletes the current user.
   * @return {CompletableFuture}
   */
  deleteUser() {
    assertDefAndNotNull(this.getId(), 'Cannot delete user without id');
    return this.buildUrl_()
      .path('/users', this.getId().toString())
      .auth(this)
      .delete()
      .then(response => assertResponseSucceeded(response));
  }

  /**
   * Builds URL by joining the headers.
   * @return {WeDeploy} Returns the {@link WeDeploy} object itself, so calls can
   *   be chained.
   * @chainable
   */
  buildUrl_() {
    assertDefAndNotNull(
      this.authUrl,
      'Cannot perform operation without an auth url'
    );
    return this.wedeployClient.url(this.authUrl).headers(this.headers_);
  }
}

export default Auth;
