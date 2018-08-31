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

/**
 * Class that represents a BucketOrder.
 */
class BucketOrder {
  /**
   * Creates a new instance of BucketOrder.
   * @param {string} key The BucketOrder key
   * @param {string} sortOrder Sort order. Could be "asc" or "desc".
   */
  constructor(key, sortOrder) {
    this.key_ = key;
    this.sortOrder_ = sortOrder;
  }

  /**
   * Creates a new instance of BucketOrder and sets the path to be "_count".
   * @param {string} sortOrder Sort order. Could be "asc" or "desc".
   * @return {BucketOrder} Returns a new instance of BucketOrder
   * @static
   */
  static count(sortOrder) {
    return new BucketOrder('_count', sortOrder);
  }

  /**
   * Creates a new instance of BucketOrder and sets the path to be "_key".
   * @param {string} sortOrder Sort order. Could be "asc" or "desc".
   * @return {BucketOrder} Returns a new instance of BucketOrder
   * @static
   */
  static key(sortOrder) {
    return new BucketOrder('_key', sortOrder);
  }

  /**
   * Gets the key of this bucket order.
   * @return {string} Returns the current key of the bucket
   */
  getKey() {
    return this.key_;
  }

  /**
   * Gets the value of the sort order of this bucket order.
   * @return {string} Returns the current value of bucket sort order
   */
  getSortOrder() {
    return this.sortOrder_;
  }
}

export default BucketOrder;
