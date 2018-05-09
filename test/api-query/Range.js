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

import Range from '../../src/api-query/Range';

describe('Range', function() {
  describe('Range.range', function() {
    it('should create instance with both from/to values', function() {
      const range = Range.range(10, 20);
      const body = {
        from: 10,
        to: 20,
      };
      assert.deepEqual(body, range.body());
      assert.deepEqual('{"from":10,"to":20}', range.toString());
    });
  });
  describe('Range.from', function() {
    it('should create instance with just the "from" value', function() {
      const range = Range.from(10);
      const body = {
        from: 10,
      };
      assert.deepEqual(body, range.body());
      assert.deepEqual('{"from":10}', range.toString());
    });
  });
  describe('Range.to', function() {
    it('should create instance with just the "to" value', function() {
      const range = Range.to(20);
      const body = {
        to: 20,
      };
      assert.deepEqual(body, range.body());
      assert.deepEqual('{"to":20}', range.toString());
    });
  });
});
