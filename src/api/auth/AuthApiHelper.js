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

import Auth from './Auth';
import ApiHelper from '../ApiHelper';
import FacebookAuthProvider from './FacebookAuthProvider';
import GithubAuthProvider from './GithubAuthProvider';
import globals from '../../globals/globals';
import GoogleAuthProvider from './GoogleAuthProvider';
import {Storage, LocalStorageMechanism} from 'metal-storage';

import {
  assertAuthScope,
  assertDefAndNotNull,
  assertFunction,
  assertObject,
  assertUserSignedIn,
  assertBrowserEnvironment,
  assertResponseSucceeded,
} from '../assertions';

/**
 * Class responsible for encapsulating auth API calls.
 */
class AuthApiHelper extends ApiHelper {
  /**
   * Constructs an {@link AuthApiHelper} instance.
   * @param {!WeDeploy} wedeployClient Instance of WeDeploy
   * @param {!string} authUrl Url to Auth service
   * @constructor
   */
  constructor(wedeployClient, authUrl) {
    super(wedeployClient);
    this.currentUser = null;
    this.onSignInCallback = null;
    this.onSignOutCallback = null;
    this.authUrl = authUrl;

    if (LocalStorageMechanism.isSupported()) {
      this.storage = new Storage(new LocalStorageMechanism());
    }

    this.processSignIn_();

    this.provider = {
      Facebook: FacebookAuthProvider,
      Google: GoogleAuthProvider,
      Github: GithubAuthProvider,
    };
  }

  /**
   * Creates access token cookie.
   * @param {string} accessToken The access token
   */
  createAccessTokenCookie(accessToken) {
    if (globals.document && globals.window) {
      globals.document.cookie =
        'access_token=' +
        accessToken +
        '; Domain=' +
        globals.window.location.hostname +
        ';';
    }
  }

  /**
   * Creates Auth instance from data.
   * @param {Object} data Auth data
   * @return {Auth} Returns an Auth instance
   */
  createAuthFromData(data) {
    const auth = Auth.createFromData(data, this.authUrl);
    auth.setWedeployClient(this.wedeployClient, this.authUrl);
    return auth;
  }

  /**
   * Creates user.
   * @param {!Object} data The data to be used to create the user
   * @return {CancellablePromise} Resolves with Auth instance
   */
  createUser(data) {
    assertObject(data, 'User data must be specified as object');

    let request = this.buildUrl_().path('/users');

    let authScope = this.resolveAuthScope();
    if (authScope) {
      request.auth(authScope.token);
    }

    return request
      .post(data)
      .then(response => assertResponseSucceeded(response))
      .then(response => this.createAuthFromData(response.body()));
  }

  /**
   * Deletes access token cookie.
   */
  deleteAccessTokenCookie() {
    if (globals.document && globals.window) {
      globals.document.cookie =
        'access_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;Domain=' +
        globals.window.location.hostname +
        ';';
    }
  }

  /**
   * Deletes user by id.
   * @param {!string} userId User id
   * @return {CancellablePromise} Resolves when user is deleted
   */
  deleteUser(userId) {
    assertDefAndNotNull(userId, 'Cannot delete user without id');
    assertAuthScope(this);
    return this.buildUrl_()
      .path('/users', userId)
      .auth(this.resolveAuthScope().token)
      .delete()
      .then(response => assertResponseSucceeded(response));
  }

  /**
   * Updates user by id.
   * @param {!string} userId User Id
   * @param {!Object} data New user data
   * @return {CancellablePromise} Resolves when the user is updated
   */
  updateUser(userId, data) {
    assertDefAndNotNull(userId, 'Cannot update user without id');
    assertObject(data, 'User data must be specified as object');
    assertAuthScope(this);
    return this.buildUrl_()
      .path('/users', userId)
      .auth(this.resolveAuthScope().token)
      .patch(data)
      .then(response => assertResponseSucceeded(response));
  }

  /**
   * Gets all auth users.
   * @return {CancellablePromise} Resolves with all users
   */
  getAllUsers() {
    assertAuthScope(this);
    return this.buildUrl_()
      .path('/users')
      .auth(this.resolveAuthScope().token)
      .get()
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body().map(this.createAuthFromData, this));
  }

  /**
   * Gets the current browser url without the fragment part.
   * @protected
   * @return {!string} Returns the current browser url
   */
  getHrefWithoutFragment_() {
    let location = globals.window.location;
    return (
      location.protocol +
      '//' +
      location.host +
      location.pathname +
      (location.search ? location.search : '')
    );
  }

  /**
   * Gets the access token from the url fragment.
   * @return {?string} Returns the access token or null if not available
   * @protected
   */
  getRedirectAccessToken_() {
    if (globals.window && globals.window.location) {
      let fragment = globals.window.location.hash;
      if (fragment.indexOf('#access_token=') === 0) {
        return fragment.substring(14);
      }
    }
    return null;
  }

  /**
   * Gets user by id.
   * @param {!string} userId User id
   * @return {CancellablePromise} Resolves with Auth instance
   */
  getUser(userId) {
    assertDefAndNotNull(userId, 'User userId must be specified');
    assertAuthScope(this);
    return this.buildUrl_()
      .path('/users', userId)
      .auth(this.resolveAuthScope().token)
      .get()
      .then(response => assertResponseSucceeded(response))
      .then(response => this.createAuthFromData(response.body()));
  }

  /**
   * Loads current user. Requires a user token as argument.
   * @param {!string} token The user token
   * @return {CancellablePromise} Resolves with an Auth instance
   */
  loadCurrentUser(token) {
    return this.verifyUser(token).then(currentUser => {
      this.currentUser = currentUser;
      if (this.storage) {
        this.storage.set('currentUser', currentUser.getData());
      }
      if (this.currentUser.hasToken()) {
        this.createAccessTokenCookie(this.currentUser.getToken());
      }
      return this.currentUser;
    });
  }

  /**
   * Calls the on sign in callback if set.
   * @protected
   */
  maybeCallOnSignInCallback_() {
    if (this.onSignInCallback) {
      this.onSignInCallback.call(this, this.currentUser);
    }
  }

  /**
   * Calls the on sign out callback if set.
   * @protected
   */
  maybeCallOnSignOutCallback_() {
    if (this.onSignOutCallback) {
      this.onSignOutCallback.call(this, this.currentUser);
    }
  }

  /**
   * Fires passed callback when a user sign-in. Note that it keeps only the
   * last callback passed.
   * @param {!Function} callback The callback function to be called after
   *   signing-in
   */
  onSignIn(callback) {
    assertFunction(callback, 'Sign-in callback must be a function');
    this.onSignInCallback = callback;
  }

  /**
   * Fires passed callback when a user sign-out. Note that it keeps only the
   * last callback passed.
   * @param {!Function} callback The callback function to be called after
   *   signing-out
   */
  onSignOut(callback) {
    assertFunction(callback, 'Sign-out callback must be a function');
    this.onSignOutCallback = callback;
  }

  /**
   * Processes sign-in by detecting a presence of a fragment
   * <code>#access_token=</code> in the url or, alternatively, by local
   * storage current user.
   */
  processSignIn_() {
    let redirectAccessToken = this.getRedirectAccessToken_();
    if (redirectAccessToken) {
      this.removeUrlFragmentCompletely_();
      this.loadCurrentUser(redirectAccessToken).then(() =>
        this.maybeCallOnSignInCallback_()
      );
      return;
    }
    let currentUser = this.storage && this.storage.get('currentUser');
    if (currentUser) {
      this.currentUser = this.createAuthFromData(currentUser);
    }
  }

  /**
   * Removes fragment from url by performing a push state to the current path.
   * @protected
   */
  removeUrlFragmentCompletely_() {
    globals.window.history.pushState(
      {},
      '',
      globals.window.location.pathname + globals.window.location.search
    );
  }

  /**
   * Resolves auth scope from last login or api helper.
   * @return {ApiHelper|Object} Returns auth scope from last login or api
   *   helper.
   */
  resolveAuthScope() {
    if (this.helperAuthScope) {
      return this.helperAuthScope;
    }
    return this.currentUser;
  }

  /**
   * Sends password reset email to the specified email if found in database.
   * For security reasons call doesn't fail if email is not found.
   * @param {!string} email The user email
   * @return {CancellablePromise} Resolves when password reset email is sent
   */
  sendPasswordResetEmail(email) {
    assertDefAndNotNull(email, 'Send password reset email must be specified');
    return this.buildUrl_()
      .path('/user/recover')
      .param('email', email)
      .post()
      .then(response => assertResponseSucceeded(response));
  }

  /**
   * Signs in using email and password.
   * @param {!string} email The user email
   * @param {!string} password The user password
   * @return {CancellablePromise} Resolves with user object
   */
  signInWithEmailAndPassword(email, password) {
    assertDefAndNotNull(email, 'Sign-in email must be specified');
    assertDefAndNotNull(password, 'Sign-in password must be specified');

    return this.buildUrl_()
      .path('/oauth/token')
      .form('grant_type', 'password')
      .form('username', email)
      .form('password', password)
      .post()
      .then(response => assertResponseSucceeded(response))
      .then(response => this.loadCurrentUser(response.body().access_token))
      .then(user => {
        this.maybeCallOnSignInCallback_();
        return user;
      });
  }

  /**
   * Signs in with redirect. Some providers and environment may not support
   * this flow.
   * @param {AuthProvider} provider An Auth provider
   */
  signInWithRedirect(provider) {
    assertBrowserEnvironment();
    assertDefAndNotNull(provider, 'Sign-in provider must be defined');
    assertSupportedProvider(provider);

    if (!provider.hasRedirectUri()) {
      provider.setRedirectUri(this.getHrefWithoutFragment_());
    }
    globals.window.location.href = provider.makeAuthorizationUrl(this.authUrl);
  }

  /**
   * Signs out <code>currentUser</code> and removes from
   *   <code>localStorage</code>.
   * @return {CancellablePromise} Resolves when user is signed out
   */
  signOut() {
    assertUserSignedIn(this.currentUser);
    return this.buildUrl_()
      .path('/oauth/revoke')
      .form('token', this.currentUser.token)
      .post()
      .then(response => assertResponseSucceeded(response))
      .then(response => {
        this.maybeCallOnSignOutCallback_();
        this.unloadCurrentUser_();
        return response;
      });
  }

  /**
   * Builds Url by joining headers and withCredentials.
   * @return {WeDeploy} Returns the {@link WeDeploy} object itself, so calls can
   *   be chained
   * @chainable
   */
  buildUrl_() {
    return this.wedeployClient
      .url(this.authUrl)
      .headers(this.headers_)
      .withCredentials(this.withCredentials_);
  }

  /**
   * Unloads all information for <code>currentUser</code> and removes from
   * <code>localStorage</code> if present.
   */
  unloadCurrentUser_() {
    this.currentUser = null;
    if (this.storage) {
      this.storage.remove('currentUser');
    }
    this.deleteAccessTokenCookie();
  }

  /**
   * Method for verifying tokens. If the provided token has the correct
   * format, is not expired, and is properly signed, the method returns the
   * decoded token.
   * @param {!string} token Authentication token
   * @return {CancellablePromise} Resolves with the user token
   */
  verifyToken(token) {
    assertDefAndNotNull(token, 'Token must be specified');
    return this.buildUrl_()
      .path('/oauth/tokeninfo')
      .param('token', token)
      .get()
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body());
  }

  /**
   * Method for verifying user by token. If the provided token has the correct
   * format, is not expired, and is properly signed, the method returns the
   * user payload.
   * @param {!string} tokenOrEmail Either an authorization token,
   * or the email.
   * @param {string=} opt_password If a email is given as the first param,
   * this should be the password.
   * @return {CancellablePromise} Resolves with an Auth instance
   */
  verifyUser(tokenOrEmail, opt_password) {
    assertDefAndNotNull(tokenOrEmail, 'Token or email must be specified');
    return this.buildUrl_()
      .path('/user')
      .auth(tokenOrEmail, opt_password)
      .get()
      .then(response => assertResponseSucceeded(response))
      .then(response => {
        let data = response.body();
        if (opt_password) {
          data.email = tokenOrEmail;
          data.password = opt_password;
        } else {
          data.token = tokenOrEmail;
        }
        return this.createAuthFromData(data);
      });
  }
}

/**
 * Asserts a passed sign-in provider is supported.
 * Throws an exception if the passed provider is not one of:
 * - FacebookAuthProvider.PROVIDER
 * - GithubAuthProvider.PROVIDER
 * - GoogleAuthProvider.PROVIDER
 * @param {!string} provider
 */
function assertSupportedProvider(provider) {
  switch (provider.constructor.PROVIDER) {
    case FacebookAuthProvider.PROVIDER:
    case GithubAuthProvider.PROVIDER:
    case GoogleAuthProvider.PROVIDER:
      break;
    default:
      throw new Error('Sign-in provider not supported');
  }
}

export default AuthApiHelper;
