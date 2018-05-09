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

import AjaxTransport from './browser/AjaxTransport';

/**
 * Provides a factory for data transport.
 */
class TransportFactory {
  /**
	 * Constructs an {@link TransportFactory} instance.
	 * @constructor
	 */
  constructor() {
    this.transports = {};
    this.transports[TransportFactory.DEFAULT_TRANSPORT_NAME] =
			TransportFactory[TransportFactory.DEFAULT_TRANSPORT_NAME];
  }

  /**
	 * Returns {@link TransportFactory} instance.
	 * @return {!TransportFactory} Instance of TransportFactory
	 */
  static instance() {
    if (!TransportFactory.instance_) {
      TransportFactory.instance_ = new TransportFactory();
    }
    return TransportFactory.instance_;
  }

  /**
	 * Gets an instance of the transport implementation with the given name.
	 * @param {string} implementationName
	 * @return {!Transport}
	 */
  get(implementationName) {
    let TransportClass = this.transports[implementationName];

    if (!TransportClass) {
      throw new Error('Invalid transport name: ' + implementationName);
    }

    try {
      return new TransportClass();
    } catch (err) {
      throw new Error('Can not create transport', err);
    }
  }

  /**
	 * Returns the default transport implementation.
	 * @return {!Transport}
	 */
  getDefault() {
    return this.get(TransportFactory.DEFAULT_TRANSPORT_NAME);
  }
}

TransportFactory.DEFAULT_TRANSPORT_NAME = 'default';

TransportFactory[TransportFactory.DEFAULT_TRANSPORT_NAME] = AjaxTransport;

export default TransportFactory;
