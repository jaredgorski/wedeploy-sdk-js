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

/**
 * Class responsible for storing an object that will be printed as JSON
 * when the `toString` method is called.
 */
class Embodied {
  /**
   * Constructs a Embodied instance.
   * @constructor
   */
  constructor() {
    this.body_ = {};
  }

  /**
   * Gets the JSON object that represents this instance.
   * @return {!Object} Returns the JSON representing the current instance
   */
  body() {
    return this.body_;
  }

  /**
   * If the given object is an instance of Embodied, this will
   * return its body content. Otherwise this will return the
   * original object.
   * @param {*} obj An object or instance of {@link Embodied}
   * @return {*} If passed `obj` param was an instance of {@link Embodied},
   *  returns its JSON representation (the body content). Otherwise, it will
   *  return the original object.
   * @static
   */
  static toBody(obj) {
    return obj instanceof Embodied ? obj.body() : obj;
  }

  /**
   * Gets the JSON string that represents this instance.
   * @return {string} Returns the `body` of the current instance as a string
   */
  toString() {
    return JSON.stringify(this.body());
  }
}

export default Embodied;
