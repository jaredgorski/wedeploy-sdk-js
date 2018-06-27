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

import http from 'http';
import request from 'request';
import CancellablePromise from 'metal-promise';
import ClientResponse from '../ClientResponse';
import Transport from '../Transport';
import Uri from 'metal-uri';
import FormData from 'form-data';

/**
 * The implementation of Node transport to be used with {@link WeDeploy}.
 * @implements {Transport}
 */
class NodeTransport extends Transport {
  /**
   * @override
   */
  send(clientRequest) {
    let deferred = this.request(
      clientRequest.url(),
      clientRequest.method(),
      clientRequest.body(),
      clientRequest.headers(),
      clientRequest.params(),
      null,
      clientRequest.followRedirect()
    );

    return deferred.then(function(response) {
      let clientResponse = new ClientResponse(clientRequest);
      clientResponse.body(response.body);
      clientResponse.statusCode(response.statusCode);
      clientResponse.statusText(http.STATUS_CODES[response.statusCode]);

      Object.keys(response.headers).forEach(function(name) {
        clientResponse.header(name, response.headers[name]);
      });

      return clientResponse;
    });
  }

  /**
   * Requests the Url and resolves with server response.
   * @param {!string} url The Url to which request should be sent
   * @param {!string} method The request method
   * @param {?string} body The request body
   * @param {MultiMap} opt_headers Optional headers to be sent with the request
   * @param {MultiMap} opt_params Optional params to be sent with the request
   * @param {number=} opt_timeout Optional request timeout. This is the number
   *   of milliseconds to wait for a server to send response headers
   * @param {boolean} opt_follow_redirect Optionally set if redirect responses
   *   should be followed. By default HTTP 3xx responses will be followed.
   * @return {CancellablePromise} Deferred request, resolves with server
   *   response.
   * @protected
   */
  request(
    url,
    method,
    body,
    opt_headers,
    opt_params,
    opt_timeout,
    opt_follow_redirect
  ) {
    url = new Uri(url);

    if (url.isUsingDefaultProtocol()) {
      url.setProtocol('https:');
    }

    if (opt_params) {
      url.addParametersFromMultiMap(opt_params);
    }

    url = url.toString();

    let options = {
      method: method,
      uri: url,
    };

    if (opt_headers) {
      let headers = {};
      opt_headers.names().forEach(function(name) {
        headers[name] = opt_headers.getAll(name).join(', ');
      });

      options.headers = headers;
    }

    let isFormData = false;
    if (body) {
      if (body instanceof FormData) {
        isFormData = true;
      } else {
        options.body = body;
      }
    }

    if (opt_timeout) {
      options.timeout = opt_timeout;
    }

    if (!opt_follow_redirect) {
      options.followRedirect = false;
      options.simple = false;
    }

    let connection;

    return new CancellablePromise((resolve, reject) => {
      connection = request(options, (error, response) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response);
      });

      // TODO: Request doesn't handle multipart/form-data very well.
      // So the function .form() or the param formData doesn't work as expected.
      // That's a path to overwrite the private attribute _form to bind the
      // FormData to the request
      // (https://github.com/request/request/blob/master/request.js#L1269)
      // by default the package request uses `multipart` in a different function
      // and scope, instead using FormData package by default.
      if (isFormData) {
        connection._form = body;
      }
    }).thenCatch(reason => {
      connection.abort();
      throw reason;
    });
  }
}

export default NodeTransport;
