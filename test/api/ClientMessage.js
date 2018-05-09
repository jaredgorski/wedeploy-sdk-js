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

import ClientMessage from '../../src/api/ClientMessage';
import ClientRequest from '../../src/api/ClientRequest';
import ClientResponse from '../../src/api/ClientResponse';

describe('ClientMessage', function() {
  it('should set/get body', function() {
    const clientMessage = new ClientMessage();
    assert.strictEqual(undefined, clientMessage.body());
    clientMessage.body('body');
    assert.strictEqual('body', clientMessage.body());
  });

  it('should remove body', function() {
    const clientMessage = new ClientMessage();
    clientMessage.body('body');
    clientMessage.removeBody();
    assert.strictEqual(undefined, clientMessage.body());
  });

  it('should set/get header', function() {
    const clientMessage = new ClientMessage();
    clientMessage.header('name', '');
    clientMessage.header('name', 'value');
    assert.strictEqual(
      '{"name":["value"]}',
      clientMessage.headers().toString()
    );
  });

  it('should set/get headers', function() {
    const clientMessage = new ClientMessage();
    clientMessage.headers({
      name: ['value', 'value'],
    });
    assert.strictEqual(
      '{"name":["value","value"]}',
      clientMessage.headers().toString()
    );
  });

  it('should throws exception for invalid header arguments', function() {
    assert.throws(function() {
      const clientMessage = new ClientMessage();
      clientMessage.header();
    }, Error);

    assert.throws(function() {
      const clientMessage = new ClientMessage();
      clientMessage.header('name');
    }, Error);
  });
});

describe('ClientRequest', function() {
  it('should set/get url', function() {
    const clientRequest = new ClientRequest();
    assert.strictEqual(undefined, clientRequest.url());
    clientRequest.url('/url');
    assert.strictEqual('/url', clientRequest.url());
  });

  it('should set/get method', function() {
    const clientRequest = new ClientRequest();
    assert.strictEqual(ClientRequest.DEFAULT_METHOD, clientRequest.method());
    clientRequest.method('POST');
    assert.strictEqual('POST', clientRequest.method());
  });

  it('should set/get query', function() {
    const clientRequest = new ClientRequest();
    clientRequest.param('name', 'value');
    clientRequest.param('name', 'value');
    assert.strictEqual('{"name":["value"]}', clientRequest.params().toString());
  });

  it('should set/get headers', function() {
    const clientRequest = new ClientRequest();
    clientRequest.params({
      name: ['value', 'value'],
    });
    assert.strictEqual(
      '{"name":["value","value"]}',
      clientRequest.params().toString()
    );
  });

  it('should throws exception for invalid query arguments', function() {
    assert.throws(function() {
      const clientRequest = new ClientRequest();
      clientRequest.param();
    }, Error);

    assert.throws(function() {
      const clientRequest = new ClientRequest();
      clientRequest.param('name');
    }, Error);
  });
});

describe('ClientResponse', function() {
  it('should set/get status code', function() {
    const clientResponse = new ClientResponse(new ClientRequest());
    assert.strictEqual(undefined, clientResponse.statusCode());
    clientResponse.statusCode(200);
    assert.strictEqual(200, clientResponse.statusCode());
  });

  it('should set/get client request', function() {
    const clientRequest = new ClientRequest();
    const clientResponse = new ClientResponse(clientRequest);
    assert.strictEqual(clientRequest, clientResponse.request());
  });

  it('should throws exception for empty constructor', function() {
    assert.throws(function() {
      new ClientResponse();
    }, Error);
  });

  it('should check response succeeded', function() {
    const clientRequest = new ClientRequest();
    const clientResponse = new ClientResponse(clientRequest);
    clientResponse.statusCode(0);
    assert.ok(!clientResponse.succeeded());
    clientResponse.statusCode(200);
    assert.ok(clientResponse.succeeded());
    clientResponse.statusCode(399);
    assert.ok(clientResponse.succeeded());
    clientResponse.statusCode(400);
    assert.ok(!clientResponse.succeeded());
  });
});
