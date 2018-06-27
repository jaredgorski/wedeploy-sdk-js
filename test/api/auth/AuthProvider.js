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
 */

'use strict';

import AuthProvider from '../../../src/api/auth/AuthProvider';

/* eslint-disable max-len,require-jsdoc */
describe('AuthProvider', function() {
  it('should support default constructor', function() {
    assert.doesNotThrow(function() {
      new AuthProvider();
    });
  });

  it('should not set default provider', function() {
    const provider = new AuthProvider();
    assert.strictEqual(null, provider.getProvider());
  });

  it('should set provider scope', function() {
    const provider = new AuthProvider();
    assert.ok(!provider.hasProviderScope());
    provider.setProviderScope('providerScope');
    assert.ok(provider.hasProviderScope());
    assert.strictEqual('providerScope', provider.getProviderScope());
  });

  it('should set provider scope as string', function() {
    const provider = new AuthProvider();
    assert.throws(function() {
      provider.setProviderScope(0);
    }, Error);
  });

  it('should set redirect uri', function() {
    const provider = new AuthProvider();
    assert.ok(!provider.hasRedirectUri());
    provider.setRedirectUri('uri');
    assert.ok(provider.hasRedirectUri());
    assert.strictEqual('uri', provider.getRedirectUri());
  });

  it('should set redirect uri as string', function() {
    const provider = new AuthProvider();
    assert.throws(function() {
      provider.setRedirectUri(0);
    }, Error);
  });

  it('should set scope', function() {
    const provider = new AuthProvider();
    assert.ok(!provider.hasScope());
    provider.setScope('scope');
    assert.ok(provider.hasScope());
    assert.strictEqual('scope', provider.getScope());
  });

  it('should set scope as string', function() {
    const provider = new AuthProvider();
    assert.throws(function() {
      provider.setScope(0);
    }, Error);
  });

  it('should make authorization url with base auth url', function() {
    const provider = new AuthProvider();
    assert.strictEqual(
      'https://auth:8080/oauth/authorize',
      provider.makeAuthorizationUrl('https://auth:8080')
    );
  });

  it('should make authorization url for null parameters', function() {
    const provider = new AuthProvider();
    assert.strictEqual('/oauth/authorize', provider.makeAuthorizationUrl());
  });

  it('should make authorization url for empty parameters', function() {
    const provider = new AuthProvider();
    provider.setProviderScope('');
    provider.setRedirectUri('');
    provider.setScope('');
    assert.strictEqual(
      '/oauth/authorize?provider_scope=&redirect_uri=&scope=',
      provider.makeAuthorizationUrl()
    );
  });

  it('should make authorization url for defined parameters', function() {
    const provider = new AuthProvider();
    provider.setProviderScope('scope1 scope2');
    provider.setRedirectUri('uri');
    provider.setScope('scope1 scope2');
    assert.strictEqual(
      '/oauth/authorize?provider_scope=scope1%20scope2&redirect_uri=uri&scope=scope1%20scope2',
      provider.makeAuthorizationUrl()
    );
  });
});
