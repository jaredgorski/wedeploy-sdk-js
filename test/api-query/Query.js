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

import Filter from '../../src/api-query/Filter';
import Query from '../../src/api-query/Query';
import Aggregation from '../../src/api-query/Aggregation';

describe('Query', function() {
  describe('Query.filter', function() {
    it('should be chainnable', function() {
      const query = Query.filter();
      assert.strictEqual(query, query.filter(Filter.gt('age', 12)));
    });

    it('should add an existing filter', function() {
      const query = Query.filter(Filter.gt('age', 12));
      const body = {
        filter: [
          {
            age: {
              operator: '>',
              value: 12,
            },
          },
        ],
      };
      assert.deepEqual(body, query.body());
      assert.strictEqual(
        '{"filter":[{"age":{"operator":">","value":12}}]}',
        query.toString()
      );
    });

    it('should add filter from field/operator/value', function() {
      const query = Query.filter('age', '>', 12);
      const body = {
        filter: [
          {
            age: {
              operator: '>',
              value: 12,
            },
          },
        ],
      };
      assert.deepEqual(body, query.body());
      assert.strictEqual(
        '{"filter":[{"age":{"operator":">","value":12}}]}',
        query.toString()
      );
    });

    it('should add filter from field/value', function() {
      const query = Query.filter('age', 12);
      const body = {
        filter: [
          {
            age: {
              operator: '=',
              value: 12,
            },
          },
        ],
      };
      assert.deepEqual(body, query.body());
      assert.strictEqual(
        '{"filter":[{"age":{"operator":"=","value":12}}]}',
        query.toString()
      );
    });

    it('should add multiple filters', function() {
      const query = Query.filter(Filter.gt('age', 12))
        .filter('age', '<', 15)
        .filter('name', 'Foo');

      const bodyStr =
				'{"filter":[{"age":{"operator":">","value":12}},' +
				'{"age":{"operator":"<","value":15}},' +
				'{"name":{"operator":"=","value":"Foo"}}]}';
      assert.strictEqual(bodyStr, query.toString());
    });
  });

  describe('Query.search', function() {
    it('should be chainnable', function() {
      const query = Query.search();
      assert.strictEqual(query, query.search(Query.search()));
    });

    it('should set the search entry from text', function() {
      const query = Query.search('foo');
      const body = {
        filter: [
          {
            '*': {
              operator: 'match',
              value: 'foo',
            },
          },
        ],
        type: 'search',
      };
      assert.deepEqual(body, query.body());

      const bodyStr =
				'{"type":"search","filter":[{"*":{"operator":"match","value":"foo"}}]}';
      assert.strictEqual(bodyStr, query.toString());
    });

    it('should set the search entry from field and text', function() {
      const query = Query.search('name', 'foo');
      const body = {
        filter: [
          {
            name: {
              operator: 'match',
              value: 'foo',
            },
          },
        ],
        type: 'search',
      };
      assert.deepEqual(body, query.body());

      const bodyStr =
				'{"type":"search","filter":[{"name":{"operator":"match","value":"foo"}}]}';
      assert.strictEqual(bodyStr, query.toString());
    });

    it('should set the search entry from field, operator and text', function() {
      const query = Query.search('age', '<', 12);
      const body = {
        filter: [
          {
            age: {
              operator: '<',
              value: 12,
            },
          },
        ],
        type: 'search',
      };
      assert.deepEqual(body, query.body());

      const bodyStr =
				'{"type":"search","filter":[{"age":{"operator":"<","value":12}}]}';
      assert.strictEqual(bodyStr, query.toString());
    });

    it('should be chainnable', function() {
      const query = Query.search();
      assert.strictEqual(query, query.search(Filter.gt('age', 12)));
    });

    it('should add an existing filter', function() {
      const query = Query.search(Filter.gt('age', 12));
      const bodyStr =
				'{"type":"search","filter":[{"age":{"operator":">","value":12}}]}';
      assert.strictEqual(bodyStr, query.toString());
    });

    it('should add filter from text', function() {
      const query = Query.search('foo');
      const bodyStr =
				'{"type":"search","filter":[{"*":{"operator":"match","value":"foo"}}]}';
      assert.strictEqual(bodyStr, query.toString());
    });

    it('should add filter from field and text', function() {
      const query = Query.search('name', 'foo');
      const bodyStr =
				'{"type":"search","filter":[{"name":{"operator":"match","value":"foo"}}]}';
      assert.strictEqual(bodyStr, query.toString());
    });

    it('should add filter from field, operator and text', function() {
      const query = Query.search('age', '<', 12);
      const bodyStr =
				'{"type":"search","filter":[{"age":{"operator":"<","value":12}}]}';
      assert.strictEqual(bodyStr, query.toString());
    });

    it('should add multiple filters', function() {
      const query = Query.search(Filter.gt('age', 12))
        .search('foo')
        .search('name', 'foo')
        .search('age', '<', 12);

      const bodyStr =
				'{"type":"search","filter":[' +
				'{"age":{"operator":">","value":12}},' +
				'{"*":{"operator":"match","value":"foo"}},' +
				'{"name":{"operator":"match","value":"foo"}},' +
				'{"age":{"operator":"<","value":12}}' +
				']}';
      assert.strictEqual(bodyStr, query.toString());
    });
  });

  describe('Query.sort', function() {
    it('should be chainnable', function() {
      const query = Query.sort();
      assert.strictEqual(query, query.sort('age'));
    });

    it('should add a sort entry for the given field', function() {
      const query = Query.sort('age');
      const body = {
        sort: [
          {
            age: 'asc',
          },
        ],
      };
      assert.deepEqual(body, query.body());
      assert.strictEqual('{"sort":[{"age":"asc"}]}', query.toString());
    });

    it('should add a sort entry for the given field and direction', function() {
      const query = Query.sort('age', 'desc');
      const body = {
        sort: [
          {
            age: 'desc',
          },
        ],
      };
      assert.deepEqual(body, query.body());
      assert.strictEqual('{"sort":[{"age":"desc"}]}', query.toString());
    });

    it('should add multiple sort entries', function() {
      const query = Query.sort('age', 'desc').sort('name');
      assert.strictEqual(
        '{"sort":[{"age":"desc"},{"name":"asc"}]}',
        query.toString()
      );
    });
  });

  describe('Query.type', function() {
    it('should be chainnable', function() {
      const query = Query.type();
      assert.strictEqual(query, query.type('count'));
    });

    it('should set the query type to the given value', function() {
      const query = Query.type('customType');
      const body = {
        type: 'customType',
      };
      assert.deepEqual(body, query.body());
      assert.strictEqual('{"type":"customType"}', query.toString());
    });

    it('should set the query type to "count"', function() {
      const query = Query.count();
      const body = {
        type: 'count',
      };
      assert.deepEqual(body, query.body());
      assert.strictEqual('{"type":"count"}', query.toString());
    });

    it('should set the query type to "fetch"', function() {
      const query = Query.fetch();
      const body = {
        type: 'fetch',
      };
      assert.deepEqual(body, query.body());
      assert.strictEqual('{"type":"fetch"}', query.toString());
    });

    it('should set the query type to last selected option', function() {
      const query = Query.fetch().count();
      const body = {
        type: 'count',
      };
      assert.deepEqual(body, query.body());
      assert.strictEqual('{"type":"count"}', query.toString());
    });
  });

  describe('Query.offset', function() {
    it('should be chainnable', function() {
      const query = Query.offset();
      assert.strictEqual(query, query.offset(10));
    });

    it('should set the query type to the given value', function() {
      const query = Query.offset(10);
      const body = {
        offset: 10,
      };
      assert.deepEqual(body, query.body());
      assert.strictEqual('{"offset":10}', query.toString());
    });
  });

  describe('Query.limit', function() {
    it('should be chainnable', function() {
      const query = Query.limit();
      assert.strictEqual(query, query.limit(10));
    });

    it('should set the query type to the given value', function() {
      const query = Query.limit(10);
      const body = {
        limit: 10,
      };
      assert.deepEqual(body, query.body());
      assert.strictEqual('{"limit":10}', query.toString());
    });
  });

  describe('Query.all', function() {
    it('should create complex query with many different keys', function() {
      const query = Query.filter(Filter.gt('age', 12))
        .sort('age', 'desc')
        .sort('name')
        .offset(5)
        .limit(10)
        .fetch();
      const bodyStr =
				'{' +
				'"filter":[{"age":{"operator":">","value":12}}],' +
				'"sort":[{"age":"desc"},{"name":"asc"}],' +
				'"offset":5,' +
				'"limit":10,' +
				'"type":"fetch"' +
				'}';
      assert.strictEqual(bodyStr, query.toString());
    });
  });

  describe('Query.aggregate', function() {
    it('should be chainnable', function() {
      const query = Query.aggregate();
      assert.strictEqual(query, query.aggregate('aggr', 'name', 'count'));
    });

    it('should add an existing aggregation', function() {
      const query = Query.aggregate('aggr', Aggregation.histogram('age', 100));
      const bodyStr =
				'{"aggregation":[{"age":{"name":"aggr","operator":"histogram","value":100}}]}';
      assert.strictEqual(bodyStr, query.toString());
    });

    it('should add an aggregation from the given field and operator', function() {
      const query = Query.aggregate('aggr', 'foo', 'count');
      const bodyStr =
				'{"aggregation":[{"foo":{"name":"aggr","operator":"count"}}]}';
      assert.strictEqual(bodyStr, query.toString());
    });

    it('should add multiple aggregations', function() {
      const query = Query.aggregate(
        'aggr',
        Aggregation.histogram('age', 100)
      ).aggregate('aggr', 'foo', 'count');
      const bodyStr =
				'{"aggregation":[' +
				'{"age":{"name":"aggr","operator":"histogram","value":100}},' +
				'{"foo":{"name":"aggr","operator":"count"}}' +
				']}';
      assert.strictEqual(bodyStr, query.toString());
    });
  });

  describe('Query.highlight', function() {
    it('should be chainnable', function() {
      const query = Query.highlight();
      assert.strictEqual(query, query.highlight('name'));
    });

    it('should add a highlight entry for a field', function() {
      const query = Query.highlight('name');
      assert.strictEqual('{"highlight":["name"]}', query.toString());
    });

    it('should add multiple highlights', function() {
      const query = Query.highlight('address')
        .highlight('name', 10)
        .highlight('lastName', 10, 5);
      const bodyStr = '{"highlight":["address","name","lastName"]}';
      assert.strictEqual(bodyStr, query.toString());
    });
  });
});
