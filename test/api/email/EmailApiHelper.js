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

import Auth from '../../../src/api/auth/Auth';
import WeDeploy from '../../../src/api/WeDeploy';

describe('EmailApiHelper', function() {
  afterEach(function() {
    RequestMock.teardown();
  });

  beforeEach(function() {
    RequestMock.setup();
    WeDeploy.email('http://localhost');
  });

  describe('WeDeploy.email()', function() {
    it('should not return the same instance', function() {
      let email = WeDeploy.email('http://localhost');
      assert.notStrictEqual(email, WeDeploy.email('http://localhost'));
    });

    it('should raise an error if the email url has a path', function() {
      assert.throws(function() {
        WeDeploy.email('http://email.project.wedeploy.me/extrapath');
      }, Error);
    });

    it('should return the instance of scoped auth', function() {
      const auth = Auth.create('token');
      const emailClient = WeDeploy.email('http://localhost').auth(auth);
      assert.strictEqual(auth, emailClient.helperAuthScope);
    });
  });

  describe('.from()', function() {
    it('should add "from" param into post form', function() {
      const email = WeDeploy.email('http://localhost').from('test@test.com');
      assert.deepEqual(['from'], email.params.names());

      assert.deepEqual(['test@test.com'], email.params.getAll('from'));
    });

    it('should accept single value only in "from" param into post form', function() {
      const email = WeDeploy.email('http://localhost')
        .from('test@test.com')
        .from('test2@test2.com');
      assert.deepEqual(['from'], email.params.names());

      assert.deepEqual(['test2@test2.com'], email.params.getAll('from'));
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email('http://localhost');
      assert.throws(function() {
        email.from(null);
      }, Error);
    });
  });

  describe('.bcc()', function() {
    it('should add "bcc" param into post form', function() {
      const email = WeDeploy.email('http://localhost').bcc('test@test.com');
      assert.deepEqual(['bcc'], email.params.names());

      assert.deepEqual(['test@test.com'], email.params.getAll('bcc'));
    });

    it('should accept multiple values in "bcc" param into post form', function() {
      const email = WeDeploy.email('http://localhost')
        .bcc('test@test.com')
        .bcc('test2@test2.com');
      assert.deepEqual(['bcc'], email.params.names());

      assert.deepEqual(
        ['test@test.com', 'test2@test2.com'],
        email.params.getAll('bcc')
      );
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email('http://localhost');
      assert.throws(function() {
        email.bcc(null);
      }, Error);
    });
  });

  describe('.cc()', function() {
    it('should add "cc" param into post form', function() {
      const email = WeDeploy.email('http://localhost').cc('test@test.com');
      assert.deepEqual(['cc'], email.params.names());

      assert.deepEqual(['test@test.com'], email.params.getAll('cc'));
    });

    it('should accept multiple values in "cc" param into post form', function() {
      const email = WeDeploy.email('http://localhost')
        .cc('test@test.com')
        .cc('test2@test2.com');
      assert.deepEqual(['cc'], email.params.names());

      assert.deepEqual(
        ['test@test.com', 'test2@test2.com'],
        email.params.getAll('cc')
      );
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email('http://localhost');
      assert.throws(function() {
        email.cc(null);
      }, Error);
    });
  });

  describe('.message()', function() {
    it('should add "message" param into post form', function() {
      const email = WeDeploy.email('http://localhost').message('message');
      assert.deepEqual(['message'], email.params.names());
    });

    it('should accept single value only in "message" param into post form', function() {
      const email = WeDeploy.email('http://localhost')
        .message('test@test.com')
        .message('test2@test2.com');
      assert.deepEqual(['message'], email.params.names());

      assert.deepEqual(['test2@test2.com'], email.params.getAll('message'));
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email('http://localhost');
      assert.throws(function() {
        email.message(null);
      }, Error);
    });
  });

  describe('.priority()', function() {
    it('should add "priority" param into post form', function() {
      const email = WeDeploy.email('http://localhost').priority('1');
      assert.deepEqual(['priority'], email.params.names());

      assert.deepEqual(['1'], email.params.getAll('priority'));
    });

    it('should accept single value only in "priority" param into post form', function() {
      const email = WeDeploy.email('http://localhost')
        .priority('1')
        .priority('2');
      assert.deepEqual(['priority'], email.params.names());

      assert.deepEqual(['2'], email.params.getAll('priority'));
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email('http://localhost');
      assert.throws(function() {
        email.priority(null);
      }, Error);
    });
  });

  describe('.replyTo()', function() {
    it('should add "replyTo" param into post form', function() {
      const email = WeDeploy.email('http://localhost').replyTo('test@test.com');
      assert.deepEqual(['replyTo'], email.params.names());

      assert.deepEqual(['test@test.com'], email.params.getAll('replyTo'));
    });

    it('should accept single value only in "replyTo" param into post form', function() {
      const email = WeDeploy.email('http://localhost')
        .replyTo('test@test.com')
        .replyTo('test2@test2.com');
      assert.deepEqual(['replyTo'], email.params.names());

      assert.deepEqual(['test2@test2.com'], email.params.getAll('replyTo'));
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email('http://localhost');
      assert.throws(function() {
        email.replyTo(null);
      }, Error);
    });
  });

  describe('.to()', function() {
    it('should add "to" param into post form', function() {
      const email = WeDeploy.email('http://localhost').to('test@test.com');
      assert.deepEqual(['to'], email.params.names());

      assert.deepEqual(['test@test.com'], email.params.getAll('to'));
    });

    it('should accept multiple values in "to" param into post form', function() {
      const email = WeDeploy.email('http://localhost')
        .to('test@test.com')
        .to('test2@test2.com');
      assert.deepEqual(['to'], email.params.names());

      assert.deepEqual(
        ['test@test.com', 'test2@test2.com'],
        email.params.getAll('to')
      );
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email('http://localhost');
      assert.throws(function() {
        email.to(null);
      }, Error);
    });
  });

  describe('.subject()', function() {
    it('should add subject param into post form', function() {
      const email = WeDeploy.email('http://localhost').subject('subject');
      assert.deepEqual(['subject'], email.params.names());

      assert.deepEqual(['subject'], email.params.getAll('subject'));
    });

    it('should accept single value only in "subject" param into post form', function() {
      const email = WeDeploy.email('http://localhost')
        .subject('subject')
        .subject('subject2');
      assert.deepEqual(['subject'], email.params.names());

      assert.deepEqual(['subject2'], email.params.getAll('subject'));
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email('http://localhost');
      assert.throws(function() {
        email.subject(null);
      }, Error);
    });
  });

  describe('.send()', function() {
    it('should send an http request to the email path', function(done) {
      RequestMock.intercept('POST', 'http://localhost/emails').reply(
        200,
        '{"sent": "ok"}'
      );

      WeDeploy.email('http://localhost')
        .from('test@test.com')
        .send()
        .then(result => {
          assert.equal('{"sent": "ok"}', result);
          done();
        });
    });

    it('should clear the params after sending the email', function(done) {
      RequestMock.intercept('POST', 'http://localhost/emails').reply(
        200,
        '{"sent": "ok"}'
      );

      const email = WeDeploy.email('http://localhost').from('test@test.com');

      email.send().then(result => {
        assert.strictEqual(true, email.params.isEmpty());
        done();
      });
    });

    it('should set headers on send', function(done) {
      RequestMock.intercept('POST', 'http://localhost/emails').reply(
        200,
        '{"sent": "ok"}'
      );

      WeDeploy.email('http://localhost')
        .header('TestHost', 'localhost')
        .from('test@test.com')
        .send()
        .then(result => {
          assert.strictEqual(getTestHostHeader_(), 'localhost');
          done();
        });
    });
  });

  describe('.status()', function() {
    it('should send an http request to check the status of an email', function(done) {
      RequestMock.intercept('GET', 'http://localhost/emails/xyz/status').reply(
        200,
        '{"sent": "ok"}'
      );

      WeDeploy.email('http://localhost')
        .status('xyz')
        .then(result => {
          assert.equal('{"sent": "ok"}', result);
          done();
        });
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email('http://localhost');
      assert.throws(function() {
        email.status(null);
      }, Error);
    });

    it('should set headers on status', function(done) {
      RequestMock.intercept('GET', 'http://localhost/emails/xyz/status').reply(
        200,
        '{"sent": "ok"}'
      );

      WeDeploy.email('http://localhost')
        .header('TestHost', 'localhost')
        .status('xyz')
        .then(result => {
          assert.strictEqual(getTestHostHeader_(), 'localhost');
          done();
        });
    });
  });

  describe('.withCredentials()', function() {
    it('ensures the default to be false when no param is specified', function() {
      const email = WeDeploy.email('http://localhost').withCredentials();

      assert.strictEqual(email.withCredentials_, false);
    });

    it('ensures to be true', function() {
      const email = WeDeploy.email('http://localhost').withCredentials(true);

      assert.strictEqual(email.withCredentials_, true);
    });

    it('ensures to be false', function() {
      const email = WeDeploy.email('http://localhost').withCredentials(false);

      assert.strictEqual(email.withCredentials_, false);
    });

    it('ensures to be truthy', function() {
      const email = WeDeploy.email('http://localhost').withCredentials(1);
      assert.strictEqual(email.withCredentials_, true);
    });

    it('should restore withCredentials after sending request', function(done) {
      RequestMock.intercept('POST', 'http://localhost/emails').reply(
        200,
        '{"sent": "ok"}'
      );

      const email = WeDeploy.email('http://localhost')
        .header('TestHost', 'localhost')
        .from('test@test.com')
        .withCredentials(true);
      assert.strictEqual(email.withCredentials_, true);

      email.send().then(result => {
        assert.strictEqual(email.withCredentials_, false);
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
  return headers.TestHost || headers.testhost;
}
