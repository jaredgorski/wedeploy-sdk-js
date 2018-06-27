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

import {async} from 'metal';

/* eslint-disable max-len,require-jsdoc */
class AjaxRequestMock {
  static intercept() {
    return this;
  }

  static reply(status, body, headers) {
    AjaxRequestMock.status = status;
    AjaxRequestMock.headers = headers;
    AjaxRequestMock.body = body;
  }

  static get() {
    if (AjaxRequestMock.fakeServer.requests) {
      let request = AjaxRequestMock.fakeServer.requests[0];
      convertEvents_(request);
      return request;
    }
  }

  static getUrl() {
    return AjaxRequestMock.get().url;
  }

  static setup() {
    AjaxRequestMock.fakeServer = sinon.fakeServer.create();
    AjaxRequestMock.addedEvents = false;
    async.nextTick(() => {
      convertEvents_(AjaxRequestMock.get());
      AjaxRequestMock.fakeServer.respondWith([
        AjaxRequestMock.status,
        AjaxRequestMock.headers,
        AjaxRequestMock.body || '',
      ]);
      AjaxRequestMock.fakeServer.respond();
    });
  }

  static teardown() {
    AjaxRequestMock.fakeServer.restore();
  }
}

/**
 * The most recent version of sinon is dealing with XMLHttpRequest events in a
 * very weird way. They fire `error` or status codes that the browser fires
 * `load` for, and fire `abort` for cases where the browser fires `error`.
 * This is a simple hack converting the events to the ones expected as coming
 * from the browser.
 */

function convertEvents_(request) {
  if (!AjaxRequestMock.addedEvents && request) {
    AjaxRequestMock.addedEvents = true;
    request.addEventListener('error', function(event) {
      event.stopPropagation();
      request.dispatchEvent(new sinon.ProgressEvent('load', event, request));
    });
    request.addEventListener('abort', function(event) {
      event.stopPropagation();
      request.dispatchEvent(new sinon.ProgressEvent('error', event, request));
    });
  }
}

export default AjaxRequestMock;
