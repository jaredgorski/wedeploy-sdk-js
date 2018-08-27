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

import Filter from '../../src/api-query/Filter';
import Geo from '../../src/api-query/Geo';
import Range from '../../src/api-query/Range';

describe('Filter', function() {
  describe('Filter.field', function() {
    it('should create Filter for a custom operator', function() {
      let filter = Filter.field('age', '>', 12);
      let body = {
        age: {
          operator: '>',
          value: 12,
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"age":{"operator":">","value":12}}',
        filter.toString()
      );

      filter = Filter.field('number', '<', 0);
      body = {
        number: {
          operator: '<',
          value: 0,
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"number":{"operator":"<","value":0}}',
        filter.toString()
      );
    });

    it('should assume "=" operator if none is given', function() {
      const filter = Filter.field('age', 12);
      const body = {
        age: {
          operator: '=',
          value: 12,
        },
      };
      assert.deepEqual(body, filter.body());
    });
  });

  describe('Filter.any', function() {
    it('should create Filter for "any" operator form multiple params', function() {
      const filter = Filter.any('age', 12, 21, 25);
      const body = {
        age: {
          operator: 'any',
          value: [12, 21, 25],
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"age":{"operator":"any","value":[12,21,25]}}',
        filter.toString()
      );
    });

    it('should create Filter for "any" operator from array', function() {
      const filter = Filter.any('age', [12, 21, 25]);
      const body = {
        age: {
          operator: 'any',
          value: [12, 21, 25],
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"age":{"operator":"any","value":[12,21,25]}}',
        filter.toString()
      );
    });
  });

  describe('Filter.equal', function() {
    it('should create Filter for "=" operator', function() {
      const filter = Filter.equal('age', 12);
      const body = {
        age: {
          operator: '=',
          value: 12,
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"age":{"operator":"=","value":12}}',
        filter.toString()
      );
    });
  });

  describe('Filter.gt', function() {
    it('should create Filter for ">" operator', function() {
      const filter = Filter.gt('age', 12);
      const body = {
        age: {
          operator: '>',
          value: 12,
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"age":{"operator":">","value":12}}',
        filter.toString()
      );
    });
  });

  describe('Filter.gte', function() {
    it('should create Filter for ">=" operator', function() {
      const filter = Filter.gte('age', 12);
      const body = {
        age: {
          operator: '>=',
          value: 12,
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"age":{"operator":">=","value":12}}',
        filter.toString()
      );
    });
  });

  describe('Filter.regex', function() {
    it('should create Filter for "~" operator', function() {
      const filter = Filter.regex('age', 12);
      const body = {
        age: {
          operator: '~',
          value: 12,
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"age":{"operator":"~","value":12}}',
        filter.toString()
      );
    });
  });

  describe('Filter.lt', function() {
    it('should create Filter for "<" operator', function() {
      const filter = Filter.lt('age', 12);
      const body = {
        age: {
          operator: '<',
          value: 12,
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"age":{"operator":"<","value":12}}',
        filter.toString()
      );
    });
  });

  describe('Filter.lte', function() {
    it('should create Filter for "<=" operator', function() {
      const filter = Filter.lte('age', 12);
      const body = {
        age: {
          operator: '<=',
          value: 12,
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"age":{"operator":"<=","value":12}}',
        filter.toString()
      );
    });
  });

  describe('Filter.none', function() {
    it('should create Filter for "none" operator from multiple values', function() {
      const filter = Filter.none('age', 12, 21, 25);
      const body = {
        age: {
          operator: 'none',
          value: [12, 21, 25],
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"age":{"operator":"none","value":[12,21,25]}}',
        filter.toString()
      );
    });

    it('should create Filter for "none" operator from array', function() {
      const filter = Filter.none('age', [12, 21, 25]);
      const body = {
        age: {
          operator: 'none',
          value: [12, 21, 25],
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"age":{"operator":"none","value":[12,21,25]}}',
        filter.toString()
      );
    });
  });

  describe('Filter.notEqual', function() {
    it('should create Filter for "!=" operator', function() {
      const filter = Filter.notEqual('age', 12);
      const body = {
        age: {
          operator: '!=',
          value: 12,
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"age":{"operator":"!=","value":12}}',
        filter.toString()
      );
    });
  });

  describe('Filter.not', function() {
    it('should negate an existing filter', function() {
      const filter = Filter.not(Filter.field('age', '>', 12));
      const body = {
        not: {
          age: {
            operator: '>',
            value: 12,
          },
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"not":{"age":{"operator":">","value":12}}}',
        filter.toString()
      );
    });

    it('should negate a filter created from field/operator/value params', function() {
      const filter = Filter.not('age', '>', 12);
      const body = {
        not: {
          age: {
            operator: '>',
            value: 12,
          },
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"not":{"age":{"operator":">","value":12}}}',
        filter.toString()
      );
    });

    it('should negate a filter created from field/value params', function() {
      const filter = Filter.not('age', 12);
      const body = {
        not: {
          age: {
            operator: '=',
            value: 12,
          },
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"not":{"age":{"operator":"=","value":12}}}',
        filter.toString()
      );
    });
  });

  describe('Composition', function() {
    it('should compose current filter with another using the "add" method', function() {
      let filter = Filter.gt('age', 12).add('and', Filter.lt('age', 15));
      const bodyStr =
        '{"and":[{"age":{"operator":">","value":12}},' +
        '{"age":{"operator":"<","value":15}}]}';
      assert.strictEqual(bodyStr, filter.toString());

      filter = Filter.gt('age', 12).add('and', 'age', '<', 15);
      assert.strictEqual(bodyStr, filter.toString());
    });

    it('should compose current filter with another using the "and" operator', function() {
      let filter = Filter.gt('age', 12).and(Filter.lt('age', 15));
      const bodyStr =
        '{"and":[{"age":{"operator":">","value":12}},' +
        '{"age":{"operator":"<","value":15}}]}';
      assert.strictEqual(bodyStr, filter.toString());

      filter = Filter.gt('age', 12).and('age', '<', 15);
      assert.strictEqual(bodyStr, filter.toString());
    });

    it('should compose current filter with another using the "or" operator', function() {
      let filter = Filter.gt('age', 12).or(Filter.lt('age', 15));
      const bodyStr =
        '{"or":[{"age":{"operator":">","value":12}},' +
        '{"age":{"operator":"<","value":15}}]}';
      assert.strictEqual(bodyStr, filter.toString());

      filter = Filter.gt('age', 12).or('age', '<', 15);
      assert.strictEqual(bodyStr, filter.toString());
    });

    it('should compose current filter with multiple anothers using the "addMany" method', function() {
      const filter = Filter.gt('age', 12).addMany(
        'and',
        Filter.lt('age', 15),
        Filter.equal('age', 13)
      );
      const bodyStr =
        '{"and":[{"age":{"operator":">","value":12}},' +
        '{"age":{"operator":"<","value":15}},' +
        '{"age":{"operator":"=","value":13}}]}';
      assert.strictEqual(bodyStr, filter.toString());
    });
  });

  describe('Filter.boundingBox', function() {
    it('should create Filter with "gp" operator for bounding box', function() {
      const filter = Filter.boundingBox(
        'shape',
        Geo.boundingBox('20,0', [0, 20])
      );
      const body = {
        shape: {
          operator: 'gp',
          value: ['20,0', [0, 20]],
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"shape":{"operator":"gp","value":["20,0",[0,20]]}}',
        filter.toString()
      );
    });

    it('should create Filter with "gp" operator for bounding box points', function() {
      const filter = Filter.boundingBox('shape', '20,0', Geo.point(0, 20));
      const body = {
        shape: {
          operator: 'gp',
          value: ['20,0', [0, 20]],
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"shape":{"operator":"gp","value":["20,0",[0,20]]}}',
        filter.toString()
      );
    });
  });

  describe('Filter.distance', function() {
    it('should create Filter with "gp" operator from Circle', function() {
      const filter = Filter.distance('point', Geo.circle([0, 0], 2));

      const body = {
        point: {
          operator: 'gd',
          value: {
            location: [0, 0],
            max: 2,
          },
        },
      };
      assert.deepEqual(body, filter.body());

      const bodyStr =
        '{"point":{"operator":"gd","value":{"location":[0,0],"max":2}}}';
      assert.strictEqual(bodyStr, filter.toString());
    });

    it('should create Filter with "gd" operator from location and distance', function() {
      const filter = Filter.distance('point', Geo.point(0, 0), 2);

      const body = {
        point: {
          operator: 'gd',
          value: {
            location: [0, 0],
            max: 2,
          },
        },
      };
      assert.deepEqual(body, filter.body());

      const bodyStr =
        '{"point":{"operator":"gd","value":{"location":[0,0],"max":2}}}';
      assert.strictEqual(bodyStr, filter.toString());
    });

    it('should create Filter with "gd" operator from location and full range', function() {
      const filter = Filter.distance('point', [0, 0], Range.range(1, 2));

      const body = {
        point: {
          operator: 'gd',
          value: {
            location: [0, 0],
            min: 1,
            max: 2,
          },
        },
      };
      assert.deepEqual(body, filter.body());

      const bodyStr =
        '{"point":{"operator":"gd","value":{"location":[0,0],"min":1,"max":2}}}';
      assert.strictEqual(bodyStr, filter.toString());
    });

    it('should create Filter with "gd" operator from location and min range', function() {
      const filter = Filter.distance('point', [0, 0], Range.from(1));

      const body = {
        point: {
          operator: 'gd',
          value: {
            location: [0, 0],
            min: 1,
          },
        },
      };
      assert.deepEqual(body, filter.body());

      const bodyStr =
        '{"point":{"operator":"gd","value":{"location":[0,0],"min":1}}}';
      assert.strictEqual(bodyStr, filter.toString());
    });
  });

  describe('Filter.exists', function() {
    it('should create Filter with "exists" operator', function() {
      const filter = Filter.exists('age');
      const body = {
        age: {
          operator: 'exists',
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual('{"age":{"operator":"exists"}}', filter.toString());
    });
  });

  describe('Filter.fuzzy', function() {
    it('should create Filter with "fuzzy" operator from just the query', function() {
      const filter = Filter.fuzzy('foo');
      const body = {
        '*': {
          operator: 'fuzzy',
          value: {
            query: 'foo',
          },
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"*":{"operator":"fuzzy","value":{"query":"foo"}}}',
        filter.toString()
      );
    });

    it('should create Filter with "fuzzy" operator from both field and query', function() {
      const filter = Filter.fuzzy('name', 'foo');
      const body = {
        name: {
          operator: 'fuzzy',
          value: {
            query: 'foo',
          },
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"name":{"operator":"fuzzy","value":{"query":"foo"}}}',
        filter.toString()
      );
    });

    it('should create Filter with "fuzzy" operator from query and fuzziness', function() {
      const filter = Filter.fuzzy('foo', 0.8);
      const body = {
        '*': {
          operator: 'fuzzy',
          value: {
            query: 'foo',
            fuzziness: 0.8,
          },
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"*":{"operator":"fuzzy","value":{"query":"foo","fuzziness":0.8}}}',
        filter.toString()
      );
    });

    it('should create Filter with "fuzzy" operator from field, query and fuzziness', function() {
      const filter = Filter.fuzzy('name', 'foo', 0.8);
      const body = {
        name: {
          operator: 'fuzzy',
          value: {
            query: 'foo',
            fuzziness: 0.8,
          },
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"name":{"operator":"fuzzy","value":{"query":"foo","fuzziness":0.8}}}',
        filter.toString()
      );
    });
  });

  describe('Filter.match', function() {
    it('should create Filter with "match" operator from just the query', function() {
      const filter = Filter.match('foo');
      const body = {
        '*': {
          operator: 'match',
          value: 'foo',
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"*":{"operator":"match","value":"foo"}}',
        filter.toString()
      );
    });

    it('should create Filter with "match" operator from field and query', function() {
      const filter = Filter.match('name', 'foo');
      const body = {
        name: {
          operator: 'match',
          value: 'foo',
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"name":{"operator":"match","value":"foo"}}',
        filter.toString()
      );
    });
  });

  describe('Filter.multiMatch', function() {
    it('should create Filter with "multiMatch" operator from just the query', function() {
      const filter = Filter.multiMatch('foo');
      const body = {
        '*': {
          operator: 'multi_match',
          value: 'foo',
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"*":{"operator":"multi_match","value":"foo"}}',
        filter.toString()
      );
    });

    it('should create Filter with "multiMatch" operator from field and query', function() {
      const filter = Filter.multiMatch(['fist_name', 'last_name'], 'foo');
      const body = {
        'fist_name,last_name': {
          operator: 'multi_match',
          value: 'foo',
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"fist_name,last_name":{"operator":"multi_match","value":"foo"}}',
        filter.toString()
      );
    });
  });

  describe('Filter.missing', function() {
    it('should create Filter with "missing" operator', function() {
      const filter = Filter.missing('age');
      const body = {
        age: {
          operator: 'missing',
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual('{"age":{"operator":"missing"}}', filter.toString());
    });
  });

  describe('Filter.similar', function() {
    it('should create Filter with "similar" operator from just the query', function() {
      const filter = Filter.similar('foo');
      const body = {
        '*': {
          operator: 'similar',
          value: {
            query: 'foo',
          },
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"*":{"operator":"similar","value":{"query":"foo"}}}',
        filter.toString()
      );
    });

    it('should create Filter with "similar" operator from field and query', function() {
      const filter = Filter.similar('name', 'foo');
      const body = {
        name: {
          operator: 'similar',
          value: {
            query: 'foo',
          },
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"name":{"operator":"similar","value":{"query":"foo"}}}',
        filter.toString()
      );
    });
  });

  describe('Filter.phrase', function() {
    it('should create Filter with phrase "match" operator from just the query', function() {
      const filter = Filter.phrase('foo');
      const body = {
        '*': {
          operator: 'phrase',
          value: 'foo',
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"*":{"operator":"phrase","value":"foo"}}',
        filter.toString()
      );
    });

    it('should create Filter with phrase "match" operator from field and query', function() {
      const filter = Filter.phrase('name', 'foo');
      const body = {
        name: {
          operator: 'phrase',
          value: 'foo',
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"name":{"operator":"phrase","value":"foo"}}',
        filter.toString()
      );
    });
  });

  describe('Filter.polygon', function() {
    it('should create Filter with "gp" operator', function() {
      const filter = Filter.polygon(
        'shape',
        '10,0',
        [20, 0],
        Geo.point(15, 10)
      );
      const body = {
        shape: {
          operator: 'gp',
          value: ['10,0', [20, 0], [15, 10]],
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"shape":{"operator":"gp","value":["10,0",[20,0],[15,10]]}}',
        filter.toString()
      );
    });
  });

  describe('Filter.prefix', function() {
    it('should create Filter with "prefix" operator on all fields for given query', function() {
      const filter = Filter.prefix('myPrefix');
      const body = {
        '*': {
          operator: 'prefix',
          value: 'myPrefix',
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"*":{"operator":"prefix","value":"myPrefix"}}',
        filter.toString()
      );
    });

    it('should create Filter with "prefix" operator for given field and query', function() {
      const filter = Filter.prefix('name', 'myPrefix');
      const body = {
        name: {
          operator: 'prefix',
          value: 'myPrefix',
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"name":{"operator":"prefix","value":"myPrefix"}}',
        filter.toString()
      );
    });

    it('should create Filter with "prefix" operator treating empty string as a valid query', function() {
      const filter = Filter.prefix('myPrefix', '');

      const body = {
        myPrefix: {
          operator: 'prefix',
          value: '',
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"myPrefix":{"operator":"prefix","value":""}}',
        filter.toString()
      );
    });
  });

  describe('Filter.range', function() {
    it('should create Filter with "range" operator', function() {
      const filter = Filter.range('age', 12, 15);
      const body = {
        age: {
          operator: 'range',
          value: {
            from: 12,
            to: 15,
          },
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"age":{"operator":"range","value":{"from":12,"to":15}}}',
        filter.toString()
      );
    });

    it('should create Filter with "range" operator through Range instance', function() {
      const filter = Filter.range('age', Range.range(12, 15));
      const body = {
        age: {
          operator: 'range',
          value: {
            from: 12,
            to: 15,
          },
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"age":{"operator":"range","value":{"from":12,"to":15}}}',
        filter.toString()
      );
    });
  });

  describe('Filter.shape', function() {
    it('should create Filter with "gs" operator', function() {
      const filter = Filter.shape(
        'shape',
        Geo.circle([0, 0], '2km'),
        Geo.boundingBox([20, 0], [0, 20])
      );
      const body = {
        shape: {
          operator: 'gs',
          value: {
            type: 'geometrycollection',
            geometries: [
              {
                type: 'circle',
                coordinates: [0, 0],
                radius: '2km',
              },
              {
                type: 'envelope',
                coordinates: [[20, 0], [0, 20]],
              },
            ],
          },
        },
      };
      assert.deepEqual(body, filter.body());

      const bodyStr =
        '{"shape":{"operator":"gs","value":{"type":"geometrycollection",' +
        '"geometries":[{"type":"circle","coordinates":[0,0],"radius":"2km"},' +
        '{"type":"envelope","coordinates":[[20,0],[0,20]]}]}}}';
      assert.strictEqual(bodyStr, filter.toString());
    });
  });

  describe('Filter.wildcard', function() {
    it('should create Filter for "wildcard" operator', function() {
      const filter = Filter.wildcard('name', '*ae*');
      const body = {
        name: {
          operator: 'wildcard',
          value: '*ae*',
        },
      };
      assert.deepEqual(body, filter.body());
      assert.strictEqual(
        '{"name":{"operator":"wildcard","value":"*ae*"}}',
        filter.toString()
      );
    });
  });
});
