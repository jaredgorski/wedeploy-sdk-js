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

import io from 'socket.io-client';
import Filter from '../api-query/Filter';
import Geo from '../api-query/Geo';
import Query from '../api-query/Query';
import WeDeploy from '../api/WeDeploy';
import NodeTransport from '../api/node/NodeTransport';
import Range from '../api-query/Range';
import TransportFactory from '../api/TransportFactory';
import FormData from 'form-data';

// The default transport is AjaxTransport which works in ReactNative
// environment, so in case of ReactNative we will stay with it, otherwise we
// will switch to NodeTransport.
if (typeof navigator === 'undefined' || navigator.product !== 'ReactNative') {
  TransportFactory[TransportFactory.DEFAULT_TRANSPORT_NAME] = NodeTransport;
}

WeDeploy.socket(io);
WeDeploy.formData(FormData);
WeDeploy.Filter = Filter;
WeDeploy.Geo = Geo;
WeDeploy.Query = Query;
WeDeploy.Range = Range;

// This is for backwards compatibility for previous versions that were using
// named exports.
WeDeploy.WeDeploy = WeDeploy;

module.exports = WeDeploy;
