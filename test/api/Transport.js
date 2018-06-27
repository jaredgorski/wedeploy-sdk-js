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

import ClientRequest from '../../src/api/ClientRequest';
import TransportFactory from '../../src/api/TransportFactory';

describe('Transport Tests', function() {
  beforeEach(function() {
    RequestMock.setup('GET', 'http://localhost/url');
  });
  afterEach(RequestMock.teardown);

  it('should send request to an url', function(done) {
    RequestMock.intercept().reply(200);
    const transport = TransportFactory.instance().getDefault();
    const clientRequest = new ClientRequest();
    clientRequest.url('http://localhost/url');
    transport.send(clientRequest).then(function(response) {
      assert.strictEqual('http://localhost/url', response.request().url());
      done();
    });
  });

  it('should send request with different http method', function(done) {
    RequestMock.intercept('POST', 'http://localhost/url').reply(200);
    const transport = TransportFactory.instance().getDefault();
    const clientRequest = new ClientRequest();
    clientRequest.url('http://localhost/url');
    clientRequest.method('POST');
    transport.send(clientRequest).then(function(response) {
      assert.strictEqual('POST', response.request().method());
      done();
    });
  });

  it('should send request with body', function(done) {
    RequestMock.intercept().reply(200, 'responseBody');
    const transport = TransportFactory.instance().getDefault();
    const clientRequest = new ClientRequest();
    clientRequest.url('http://localhost/url');
    clientRequest.body('requestBody');
    transport.send(clientRequest).then(function(response) {
      assert.strictEqual('requestBody', response.request().body());
      assert.strictEqual('responseBody', response.body());
      done();
    });
  });

  it('should send request with query string', function(done) {
    RequestMock.intercept('GET', 'http://localhost/url?query=1').reply(200);
    const transport = TransportFactory.instance().getDefault();
    const clientRequest = new ClientRequest();
    clientRequest.url('http://localhost/url');
    clientRequest.param('query', 1);
    transport.send(clientRequest).then(function(response) {
      assert.strictEqual(
        '{"query":[1]}',
        response
          .request()
          .params()
          .toString()
      );
      done();
    });
  });

  it('should send request with header', function(done) {
    RequestMock.intercept().reply(200);
    const transport = TransportFactory.instance().getDefault();
    const clientRequest = new ClientRequest();
    clientRequest.url('http://localhost/url');
    clientRequest.header('content-type', 'application/json');
    transport.send(clientRequest).then(function(response) {
      assert.strictEqual(
        '{"content-type":["application/json"]}',
        response
          .request()
          .headers()
          .toString()
      );
      done();
    });
  });

  it('should send request with multiple header of same name', function(done) {
    RequestMock.intercept().reply(200);
    const transport = TransportFactory.instance().getDefault();
    const clientRequest = new ClientRequest();
    clientRequest.url('http://localhost/url');
    const headers = clientRequest.headers();
    headers.add('content-type', 'application/json');
    headers.add('content-type', 'text/html');
    transport.send(clientRequest).then(function(response) {
      assert.strictEqual(
        '{"content-type":["application/json","text/html"]}',
        response
          .request()
          .headers()
          .toString()
      );
      done();
    });
  });

  it('should response with headers', function(done) {
    RequestMock.intercept().reply(200, undefined, {
      'content-type': 'application/json',
    });
    const transport = TransportFactory.instance().getDefault();
    const clientRequest = new ClientRequest();
    clientRequest.url('http://localhost/url');
    transport.send(clientRequest).then(function(response) {
      assert.strictEqual(
        '{"content-type":["application/json"]}',
        response.headers().toString()
      );
      done();
    });
  });

  it('should response success with any status code', function(done) {
    RequestMock.intercept().reply(500);
    const transport = TransportFactory.instance().getDefault();
    const clientRequest = new ClientRequest();
    clientRequest.url('http://localhost/url');
    transport.send(clientRequest).then(function(response) {
      assert.strictEqual(500, response.statusCode());
      assert.strictEqual('Internal Server Error', response.statusText());
      done();
    });
  });
});
