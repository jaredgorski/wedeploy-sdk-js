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

import Embodied from '../../src/api-query/Embodied';
import Filter from '../../src/api-query/Filter';
import FilterBody from '../../src/api-query/FilterBody';

/* eslint-disable max-len,require-jsdoc */
describe('FilterBody', function() {
  it('should return the filter\'s body object', function() {
    const filterBody = new FilterBody('age', '>', 0);
    const body = {
      age: {
        operator: '>',
        value: 0,
      },
    };
    assert.deepEqual(body, filterBody.getObject());
  });

  it('should assume "=" operator if none is given', function() {
    const filterBody = new FilterBody('age', 12);
    const body = {
      age: {
        operator: '=',
        value: 12,
      },
    };
    assert.deepEqual(body, filterBody.getObject());
  });

  it('should not set "value" key if null is given', function() {
    const filterBody = new FilterBody('age', null);
    const body = {
      age: {
        operator: '=',
      },
    };
    assert.deepEqual(body, filterBody.getObject());
  });

  it('should use return value of "body()" function of Embodied value', function() {
    class Test extends Embodied {
      constructor() {
        super();
        this.body_.foo = 'foo';
      }
    }
    const filterBody = new FilterBody('age', new Test());
    const body = {
      age: {
        operator: '=',
        value: {
          foo: 'foo',
        },
      },
    };
    assert.deepEqual(body, filterBody.getObject());
  });

  describe('Composition', function() {
    it('should compose filter with another with the given operator', function() {
      const filterBody = new FilterBody('age', '>', 12);
      filterBody.add('and', Filter.lt('age', 15));
      const body = {
        and: [
          {
            age: {
              operator: '>',
              value: 12,
            },
          },
          {
            age: {
              operator: '<',
              value: 15,
            },
          },
        ],
      };
      assert.deepEqual(body, filterBody.getObject());
    });

    it('should compose a empty filter with empty body to use ', function() {
      const filterBody = new FilterBody();

      const body = {
        and: [],
      };

      assert.deepEqual(body, filterBody.getObject());
    });

    it('should compose a empty Filter Body with a filter', function() {
      const filterBody = new FilterBody();
      filterBody.addMany('and', Filter.lt('age', 15));
      filterBody.addMany('or', Filter.lt('age', 16));

      const body = {
        or: [
          {
            and: [
              {
                age: {
                  operator: '<',
                  value: 15,
                },
              },
            ],
          },
          {
            age: {
              operator: '<',
              value: 16,
            },
          },
        ],
      };
      assert.deepEqual(body, filterBody.getObject());
    });

    it('should compose filter with multiple others with the given operator', function() {
      const filterBody = new FilterBody('age', '>', 12);
      filterBody.addMany(
        'and',
        Filter.lt('age', 15),
        Filter.equal('name', 'foo')
      );
      const body = {
        and: [
          {
            age: {
              operator: '>',
              value: 12,
            },
          },
          {
            age: {
              operator: '<',
              value: 15,
            },
          },
          {
            name: {
              operator: '=',
              value: 'foo',
            },
          },
        ],
      };
      assert.deepEqual(body, filterBody.getObject());
    });

    it('should compose filter with a unary operator', function() {
      const filterBody = new FilterBody('age', '>', 12);
      filterBody.add('not');
      const body = {
        not: {
          age: {
            operator: '>',
            value: 12,
          },
        },
      };
      assert.deepEqual(body, filterBody.getObject());
    });
  });
});
