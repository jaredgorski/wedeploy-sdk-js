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

import AjaxTransport from '../../../src/api/browser/AjaxTransport';
import ClientRequest from '../../../src/api/ClientRequest';

describe('AjaxTransport', function() {
  beforeEach(RequestMock.setup);
  afterEach(RequestMock.teardown);

  it('should cancel send request to an url', function(done) {
    RequestMock.intercept().reply(200);
    const transport = new AjaxTransport();
    const clientRequest = new ClientRequest();
    clientRequest.url('/url');
    transport
      .send(clientRequest)
      .then(function() {
        assert.fail();
      })
      .catch(function() {
        assert.ok(RequestMock.get().aborted);
        done();
      })
      .cancel();
  });

  it('should fail on transport error', function(done) {
    RequestMock.intercept().reply(200);
    const transport = new AjaxTransport();
    const clientRequest = new ClientRequest();
    clientRequest.url('/url');
    transport.send(clientRequest).catch(function(reason) {
      assert.ok(reason instanceof Error);
      done();
    });
    RequestMock.get().abort();
  });

  it('should change the protocol to https in client uri when protocol was not set explicitly', function(done) {
    RequestMock.intercept().reply(200);
    const transport = new AjaxTransport();
    const clientRequest = new ClientRequest();
    clientRequest.url('example.com');
    transport.send(clientRequest).then(function(response) {
      assert.strictEqual(
        RequestMock.getUrl().indexOf('https://example.com'),
        0
      );
      done();
    });
  });
});
