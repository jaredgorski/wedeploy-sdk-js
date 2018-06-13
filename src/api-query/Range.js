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

import {core} from 'metal';
import Embodied from './Embodied';

/**
 * Class responsible for building range objects to be used by `Filter`.
 * @extends {Embodied}
 */
class Range extends Embodied {
  /**
   * Constructs a {@link Range} instance.
   * @param {*} from Range's `from` value
   * @param {*} opt_to Optional param, representing the `to` value of the range
   * @constructor
   */
  constructor(from, opt_to) {
    super();
    if (core.isDefAndNotNull(from)) {
      this.body_.from = from;
    }
    if (core.isDefAndNotNull(opt_to)) {
      this.body_.to = opt_to;
    }
  }

  /**
   * Constructs a {@link Range} instance.
   * @param {*} from Range's `from` value
   * @return {!Range} Returns a new instance of {@link Range}
   * @static
   */
  static from(from) {
    return new Range(from);
  }

  /**
   * Constructs a {@link Range} instance.
   * @param {*} from Range's `from` value
   * @param {*} to Range's `to` value
   * @return {!Range} Returns a new instance of {@link Range}
   * @static
   */
  static range(from, to) {
    return new Range(from, to);
  }

  /**
   * Constructs a {@link Range} instance.
   * @param {*} to Range's `to` value
   * @return {!Range} Returns a new instance of {@link Range}
   * @static
   */
  static to(to) {
    return new Range(null, to);
  }
}

export default Range;
