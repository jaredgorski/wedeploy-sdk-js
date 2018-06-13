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
 * Class responsible for storing and handling the body contents
 * of a Filter instance.
 */
class FilterBody {
  /**
   * Constructs a {@link FilterBody} instance.
   * @param {string} field The name of the field to filter by
   * @param {*} operatorOrValue If a third param is given, this should
   *   be the filter's operator (like ">="). Otherwise, this will be
   *   used as the filter's value, and the filter's operator will be "=".
   * @param {*=} opt_value The filter's value
   * @constructor
   */
  constructor(field, operatorOrValue, opt_value) {
    let obj = {
      operator: core.isDef(opt_value) ? operatorOrValue : '=',
    };

    let value = core.isDef(opt_value) ? opt_value : operatorOrValue;

    if (core.isDefAndNotNull(value)) {
      if (value instanceof Embodied) {
        value = value.body();
      }
      obj.value = value;
    }

    if (core.isDefAndNotNull(field)) {
      this.createBody_(field, obj);
    } else {
      this.createBody_('and', []);
    }
  }

  /**
   * Composes the current filter with the given operator.
   * @param {string} operator The filter's operator, like ">=")
   * @param {Filter=} opt_filter Another filter to compose this filter with,
   *   if the operator is not unary
   */
  add(operator, opt_filter) {
    if (opt_filter) {
      this.addArrayOperator_(operator, opt_filter);
    } else {
      this.createBody_(operator, this.body_);
    }
  }

  /**
   * Composes the current filter with an operator that stores its values in an
   * array.
   * @param {string} operator The filter's operator, like ">=")
   * @param {!Filter} filter Instance of {@link Filter}
   * @protected
   */
  addArrayOperator_(operator, filter) {
    if (!(this.body_[operator] instanceof Array)) {
      this.createBody_(operator, [this.body_]);
    }
    this.body_[operator].push(filter.body());
  }

  /**
   * Adds filters to be composed with this filter body using the given operator.
   * @param {string} operator The filter's operator, like ">=")
   * @param {...*} filters A variable amount of filters to be composed
   */
  addMany(operator, ...filters) {
    for (let i = 0; i < filters.length; i++) {
      this.add(operator, filters[i]);
    }
  }

  /**
   * Creates a new body object, setting the requested key to the given value.
   * @param {string} key The key to set in the new body object
   * @param {*} value The value the requested key should have in the new body
   *   object
   * @protected
   */
  createBody_(key, value) {
    this.body_ = {};
    this.body_[key] = value;
  }

  /**
   * Gets the JSON object that represents this filter's body.
   * @return {!Object} Returns the JSON representation of current filter's body
   */
  getObject() {
    return this.body_;
  }
}

export default FilterBody;
