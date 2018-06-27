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
 * @ignore
 * @name LICENSE
 */

'use strict';

import Uri from 'metal-uri';
import {core} from 'metal';

/**
 * Class responsible for encapsulate provider information.
 */
class AuthProvider {
  /**
   * Constructs an {@link AuthProvider} instance.
   * @constructor
   */
  constructor() {
    this.provider = null;
    this.providerScope = null;
    this.redirectUri = null;
    this.scope = null;
  }

  /**
   * Checks if provider is defined and not null.
   * @return {boolean} Returns true if provider is set, false otherwise
   */
  hasProvider() {
    return core.isDefAndNotNull(this.provider);
  }

  /**
   * Checks if scope is defined and not null.
   * @return {boolean} Returns true if scope is set, false otherwise
   */
  hasProviderScope() {
    return core.isDefAndNotNull(this.providerScope);
  }

  /**
   * Checks if redirect Uri is defined and not null.
   * @return {boolean} Returns true if redirect Uri is set, false otherwise
   */
  hasRedirectUri() {
    return core.isDefAndNotNull(this.redirectUri);
  }

  /**
   * Checks if scope is defined and not null.
   * @return {boolean} Returns true if scope is set, false otherwise
   */
  hasScope() {
    return core.isDefAndNotNull(this.scope);
  }

  /**
   * Makes authorization url. An optional authorization Url might be provided.
   * @param {string} opt_authUrl Optional authorization Url.
   * @return {string} Normalized authorization Url
   */
  makeAuthorizationUrl(opt_authUrl) {
    let uri = new Uri(opt_authUrl);

    uri.setPathname('/oauth/authorize');

    if (this.hasProvider()) {
      uri.setParameterValue('provider', this.getProvider());
    }
    if (this.hasProviderScope()) {
      uri.setParameterValue('provider_scope', this.getProviderScope());
    }
    if (this.hasRedirectUri()) {
      uri.setParameterValue('redirect_uri', this.getRedirectUri());
    }
    if (this.hasScope()) {
      uri.setParameterValue('scope', this.getScope());
    }

    if (uri.isUsingDefaultProtocol()) {
      uri.setProtocol('https:');
    }

    return uri.toString();
  }

  /**
   * Gets provider name.
   * @return {string} Returns the name of the current provider
   */
  getProvider() {
    return this.provider;
  }

  /**
   * Gets provider scope.
   * @return {string} Returns the provider scopes
   */
  getProviderScope() {
    return this.providerScope;
  }

  /**
   * Gets redirect Uri.
   * @return {string} Returns the redirect Uri
   */
  getRedirectUri() {
    return this.redirectUri;
  }

  /**
   * Gets scope.
   * @return {string} Returns the current scope
   */
  getScope() {
    return this.scope;
  }

  /**
   * Sets provider scope.
   * @param {string=} providerScope Scope string. Separate by space for multiple
   *   scopes, e.g. "scope1 scope2"
   */
  setProviderScope(providerScope) {
    assertStringIfDefAndNotNull(
      providerScope,
      'Provider scope must be a string'
    );
    this.providerScope = providerScope;
  }

  /**
   * Sets redirect Uri.
   * @param {string} redirectUri The redirect Uri to be set to the current
   *   instance
   */
  setRedirectUri(redirectUri) {
    assertStringIfDefAndNotNull(redirectUri, 'Redirect uri must be a string');
    this.redirectUri = redirectUri;
  }

  /**
   * Sets scope.
   * @param {string=} scope Scope string. Separate by space for multiple
   *   scopes, e.g. "scope1 scope2"
   */
  setScope(scope) {
    assertStringIfDefAndNotNull(scope, 'Scope must be a string');
    this.scope = scope;
  }
}

/**
 * Throws an exception if the provided value is defined and not null, but not a
 *   string.
 * @param {!*} value The value to be checked
 * @param {!string} errorMessage The message to be provided to the exception.
 * @ignore
 */
function assertStringIfDefAndNotNull(value, errorMessage) {
  if (core.isDefAndNotNull(value) && !core.isString(value)) {
    throw new Error(errorMessage);
  }
}

export default AuthProvider;
