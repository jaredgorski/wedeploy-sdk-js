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

import Aggregation from '../../src/api-query/Aggregation';
import Geo from '../../src/api-query/Geo';
import Range from '../../src/api-query/Range';

describe('Aggregation', function() {
  it('should get field, operator and value', function() {
    const aggregation = new Aggregation('myField', 'myOperator', 'myValue');
    assert.strictEqual('myField', aggregation.getField());
    assert.strictEqual('myOperator', aggregation.getOperator());
    assert.strictEqual('myValue', aggregation.getValue());
  });

  it('should get field, operator and value', function() {
    const aggregation = new Aggregation('myField', 'myOperator', 'myValue');
    const nestedAggregation = new Aggregation(
      'myField',
      'myOperator',
      'myValue'
    );
    aggregation.addNestedAggregation('test', nestedAggregation);

    assert.strictEqual(
      true,
      Array.isArray(aggregation.getNestedAggregations())
    );
    assert.strictEqual(1, aggregation.getNestedAggregations().length);
  });

  describe('Aggregation.avg', function() {
    it('should create an aggregation with the "avg" operator', function() {
      const aggregation = Aggregation.avg('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('avg', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.cardinality', function() {
    it('should create an aggregation with the "cardinality" operator', function() {
      const aggregation = Aggregation.cardinality('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('cardinality', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.count', function() {
    it('should create an aggregation with the "count" operator', function() {
      const aggregation = Aggregation.count('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('count', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.distance', function() {
    it('should create an aggregation with the "geoDistance" operator from location and ranges', function() {
      const aggregation = Aggregation.distance(
        'myField',
        Geo.point(10, 10),
        Range.range(0, 100),
        Range.from(200)
      );

      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('geoDistance', aggregation.getOperator());

      const value = {
        location: [10, 10],
        ranges: [
          {
            from: 0,
            to: 100,
          },
          {
            from: 200,
          },
        ],
      };
      assert.deepEqual(value, aggregation.getValue());
    });

    it('should add ranges through the "range" function', function() {
      const aggregation = Aggregation.distance(
        'myField',
        Geo.point(10, 10),
        Range.range(0, 100)
      );
      aggregation.range(Range.from(200)).range(-200, -100);

      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('geoDistance', aggregation.getOperator());

      const value = {
        location: [10, 10],
        ranges: [
          {
            from: 0,
            to: 100,
          },
          {
            from: 200,
          },
          {
            from: -200,
            to: -100,
          },
        ],
      };
      assert.deepEqual(value, aggregation.getValue());
    });

    it('should set the aggregation unit through the "unit" function', function() {
      const aggregation = Aggregation.distance(
        'myField',
        Geo.point(10, 10),
        Range.range(0, 100)
      );
      aggregation.unit('km');

      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('geoDistance', aggregation.getOperator());

      const value = {
        location: [10, 10],
        ranges: [
          {
            from: 0,
            to: 100,
          },
        ],
        unit: 'km',
      };
      assert.deepEqual(value, aggregation.getValue());
    });
  });

  describe('Aggregation.extendedStats', function() {
    it('should create an aggregation with the "extendedStats" operator', function() {
      const aggregation = Aggregation.extendedStats('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('extendedStats', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.histogram', function() {
    it('should create an aggregation with the "histogram" operator', function() {
      const aggregation = Aggregation.histogram('myField', 10);
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('histogram', aggregation.getOperator());
      assert.strictEqual(10, aggregation.getValue());
    });
  });

  describe('Aggregation.max', function() {
    it('should create an aggregation with the "max" operator', function() {
      const aggregation = Aggregation.max('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('max', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.min', function() {
    it('should create an aggregation with the "min" operator', function() {
      const aggregation = Aggregation.min('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('min', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.missing', function() {
    it('should create an aggregation with the "missing" operator', function() {
      const aggregation = Aggregation.missing('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('missing', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.range', function() {
    it('should create an aggregation with the "range" operator from ranges', function() {
      const aggregation = Aggregation.range(
        'myField',
        Range.range(0, 100),
        Range.from(200)
      );

      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('range', aggregation.getOperator());

      const value = [
        {
          from: 0,
          to: 100,
        },
        {
          from: 200,
        },
      ];
      assert.deepEqual(value, aggregation.getValue());
    });

    it('should add ranges through the "range" function', function() {
      const aggregation = Aggregation.range('myField', Range.range(0, 100))
        .range(Range.from(200))
        .range(-200, -100);

      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('range', aggregation.getOperator());

      const value = [
        {
          from: 0,
          to: 100,
        },
        {
          from: 200,
        },
        {
          from: -200,
          to: -100,
        },
      ];
      assert.deepEqual(value, aggregation.getValue());
    });
  });

  describe('Aggregation.stats', function() {
    it('should create an aggregation with the "stats" operator', function() {
      const aggregation = Aggregation.stats('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('stats', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.sum', function() {
    it('should create an aggregation with the "sum" operator', function() {
      const aggregation = Aggregation.sum('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('sum', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.terms', function() {
    it('should create an aggregation with the "terms" operator', function() {
      const aggregation = Aggregation.terms('myField');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('terms', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });

  describe('Aggregation.field', function() {
    it('should create an aggregation', function() {
      const aggregation = Aggregation.field('myField', 'myOperator');
      assert.strictEqual('myField', aggregation.getField());
      assert.strictEqual('myOperator', aggregation.getOperator());
      assert.ok(!aggregation.getValue());
    });
  });
});
