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

import Auth from '../../../src/api/auth/Auth';
import WeDeploy from '../../../src/api/WeDeploy';

describe('Auth', function() {
  before(function() {
    WeDeploy.auth('http://localhost');
  });

  beforeEach(function() {
    RequestMock.setup();
  });

  afterEach(function() {
    RequestMock.teardown();
  });

  describe('instance', function() {
    it('should create Auth instance with a token', function() {
      const auth = Auth.create('My Token');
      assert.ok(auth.hasToken());
      assert.strictEqual('My Token', auth.token);
      assert.strictEqual('My Token', auth.getToken());
    });

    it('should create Auth instance with email and password', function() {
      const auth = Auth.create('email', 'password');
      assert.ok(auth.hasEmail());
      assert.ok(auth.hasPassword());
      assert.strictEqual('email', auth.email);
      assert.strictEqual('email', auth.getEmail());
      assert.strictEqual('password', auth.password);
      assert.strictEqual('password', auth.getPassword());
    });

    it('should create Auth instance and set other fields', function() {
      const data = {token: 'token'};
      const auth = Auth.create();
      auth.setCreatedAt('createdAt');
      auth.setData(data);
      auth.setId('id');
      auth.setName('name');
      auth.setPassword('password');
      auth.setPhotoUrl('photoUrl');
      auth.setSupportedScopes(['admin']);
      assert.ok(auth.hasCreatedAt());
      assert.ok(auth.hasData());
      assert.ok(auth.hasId());
      assert.ok(auth.hasName());
      assert.ok(auth.hasPassword());
      assert.ok(auth.hasPhotoUrl());
      assert.ok(auth.hasSupportedScopes('admin'));
      assert.ok(auth.hasSupportedScopes(['admin']));
      assert.ok(!auth.hasSupportedScopes(['admin', 'invalid']));
      assert.strictEqual('createdAt', auth.createdAt);
      assert.strictEqual('id', auth.id);
      assert.strictEqual('name', auth.name);
      assert.strictEqual('password', auth.password);
      assert.strictEqual('photoUrl', auth.photoUrl);
      assert.strictEqual('createdAt', auth.getCreatedAt());
      assert.strictEqual(data, auth.getData());
      assert.strictEqual('id', auth.getId());
      assert.strictEqual('name', auth.getName());
      assert.strictEqual('password', auth.getPassword());
      assert.strictEqual('photoUrl', auth.getPhotoUrl());
      assert.deepEqual(['admin'], auth.getSupportedScopes());
    });
  });

  describe('Auth.hasSupportedScopes', function() {
    it('should return true only if user has all supported scopes in a given array', function() {
      const auth = Auth.create();
      auth.setSupportedScopes(['admin']);
      assert.ok(!auth.hasSupportedScopes(['admin', 'invalid']));
      assert.throws(() => auth.updateUser(), Error);
    });

    it('should return true if user has any supported scope in a given array', function() {
      const auth = Auth.create();
      auth.setSupportedScopes(['admin']);
      assert.ok(auth.hasSupportedScopes(['admin', 'invalid'], { match: 'any' }));
      assert.throws(() => auth.updateUser(), Error);
    });
  });

  describe('Auth.updateUser', function() {
    it('should throws exception when calling updateUser without data', function() {
      const auth = Auth.create();
      auth.setWedeployClient(WeDeploy, 'http://localhost');
      assert.throws(() => auth.updateUser(), Error);
    });

    it('should throws exception when calling updateUser without data', function() {
      const auth = Auth.create();
      auth.setWedeployClient(WeDeploy, 'http://localhost');
      assert.throws(() => auth.updateUser(), Error);
    });

    it('should call updateUser successfully', function(done) {
      const auth = Auth.create();
      auth.setId(3);

      auth.setWedeployClient(WeDeploy, 'http://localhost');
      RequestMock.intercept('PATCH', 'http://localhost/users/3').reply(200);
      auth.updateUser({}).then(() => done());
    });

    it('should call updateUser unsuccessfully', function(done) {
      const auth = Auth.create();
      auth.setId(3);

      auth.setWedeployClient(WeDeploy, 'http://localhost');
      RequestMock.intercept('PATCH', 'http://localhost/users/3').reply(400);
      auth.updateUser({}).catch(() => done());
    });

    it('should call updateUser unsuccessfully with error response as reason', function(done) {
      const auth = Auth.create();
      auth.setId(3);

      auth.setWedeployClient(WeDeploy, 'http://localhost');
      auth.currentUser = {};
      const responseErrorObject = {
        error: true,
      };
      RequestMock.intercept('PATCH', 'http://localhost/users/3').reply(
        400,
        JSON.stringify(responseErrorObject),
        {
          'content-type': 'application/json',
        }
      );

      auth.updateUser({}).catch(reason => {
        assert.deepEqual(responseErrorObject, reason);
        done();
      });
    });

    it('should set headers to updateUser', function(done) {
      const auth = Auth.create();
      auth.setId(3);
      auth.setHeaders({HostHeader: 'localhost'});

      auth.setWedeployClient(WeDeploy, 'http://localhost');
      RequestMock.intercept('PATCH', 'http://localhost/users/3').reply(200);
      auth.updateUser({}).then(function(response) {
        assert.strictEqual(getTestHostHeader_(), 'localhost');
        done();
      });
    });
  });

  describe('Auth.deleteUser', function() {
    it('should throws exception when calling deleteUser without user having id', function() {
      const auth = Auth.create();
      auth.setWedeployClient(WeDeploy, 'http://localhost');
      assert.throws(() => auth.deleteUser(), Error);
    });

    it('should call deleteUser successfully', function(done) {
      const auth = Auth.create();
      auth.setId('id');
      auth.setWedeployClient(WeDeploy, 'http://localhost');
      RequestMock.intercept('DELETE', 'http://localhost/users/id').reply(200);
      auth.deleteUser().then(() => done());
    });

    it('should call deleteUser unsuccessfully', function(done) {
      const auth = Auth.create();
      auth.setId('id');
      auth.setWedeployClient(WeDeploy, 'http://localhost');
      RequestMock.intercept('DELETE', 'http://localhost/users/id').reply(400);
      auth.deleteUser().catch(() => done());
    });

    it('should call deleteUser unsuccessfully with error response as reason', function(done) {
      const auth = Auth.create();
      auth.setId('id');
      auth.setWedeployClient(WeDeploy, 'http://localhost');
      const responseErrorObject = {
        error: true,
      };
      RequestMock.intercept('DELETE', 'http://localhost/users/id').reply(
        400,
        JSON.stringify(responseErrorObject),
        {
          'content-type': 'application/json',
        }
      );
      auth.deleteUser().catch(reason => {
        assert.deepEqual(responseErrorObject, reason);
        done();
      });
    });

    it('should set headers to deleteUser', function(done) {
      const auth = Auth.create();
      auth.setId('id');
      auth.setHeaders({HostHeader: 'localhost'});
      auth.setWedeployClient(WeDeploy, 'http://localhost');
      RequestMock.intercept('DELETE', 'http://localhost/users/id').reply(200);
      auth.deleteUser().then(function(response) {
        assert.strictEqual(getTestHostHeader_(), 'localhost');
        done();
      });
    });
  });
});

/**
 * Gets the "TestHost" header from the request object. Manages different
 * mock formats (browser vs node).
 * @return {?string}
 * @protected
 */
function getTestHostHeader_() {
  const request = RequestMock.get();
  const headers = request.requestHeaders || request.req.headers;
  return headers.HostHeader || headers.hostheader;
}
