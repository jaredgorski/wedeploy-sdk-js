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

import Auth from '../../../src/api/auth/Auth';
import WeDeploy from '../../../src/api/WeDeploy';
import Geo from '../../../src/api-query/Geo';

/* eslint-disable max-len,require-jsdoc */
describe('DataApiHelper', function() {
  afterEach(function() {
    RequestMock.teardown();
  });

  beforeEach(function() {
    RequestMock.setup();
    WeDeploy.data('http://localhost');
  });

  describe('WeDeploy.data()', function() {
    it('should return different instances', function() {
      const data = WeDeploy.data('http://localhost');
      assert.notStrictEqual(data, WeDeploy.data('http://localhost'));
    });

    it('should return the instance with url filled but different object', function() {
      const data = WeDeploy.data('http://host');
      assert.deepEqual(data, WeDeploy.data('http://host'));
      assert.notStrictEqual(data, WeDeploy.data('http://host'));
    });

    it('should raise an error if the data url has a path', function() {
      assert.throws(function() {
        WeDeploy.data('http://data.project.wedeploy.me/extrapath');
      }, Error);
    });

    it('should return the instance of scoped auth', function() {
      const auth = Auth.create('token');
      const dataClient = WeDeploy.data('http://localhost').auth(auth);
      assert.strictEqual(auth, dataClient.helperAuthScope);
    });
  });

  describe('query formation', function() {
    it('should create a query and add virtual filters into the query', function() {
      const data = WeDeploy.data('http://localhost');

      data
        .where('age', '>', '18')
        .or('points', '>', '7')
        .orderBy('id', 'asc')
        .limit(10)
        .offset(2);

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          sort: [
            {
              id: 'asc',
            },
          ],
          limit: 10,
          offset: 2,
          filter: [
            {
              or: [
                {
                  and: [
                    {
                      age: {
                        operator: '>',
                        value: '18',
                      },
                    },
                  ],
                },
                {
                  points: {
                    operator: '>',
                    value: '7',
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.create()', function() {
    beforeEach(function() {
      RequestMock.setup('POST', 'http://localhost/collection');
    });

    context('when using invalid params', function() {
      it('should fail trying to create data without specifying the collection', function() {
        const data = WeDeploy.data('http://localhost');
        assert.throws(function() {
          data.create(null, {
            ping: 'pong',
          });
        }, Error);
      });

      it('should fail trying to create data without specifying the data param', function() {
        const data = WeDeploy.data('http://localhost');
        assert.throws(function() {
          data.create('collection', null);
        }, Error);
      });
    });

    context('when creating and it returns an error', function() {
      it('should fail updating because of a server error ', function(done) {
        RequestMock.intercept().reply(500, '{"error": "Error 500"}');

        WeDeploy.data('http://localhost')
          .create('collection', {
            ping: 'pong',
          })
          .catch(error => {
            assert.strictEqual('{"error": "Error 500"}', error);
            done();
          });
      });
    });

    context('when creating with one object', function() {
      it('should create new data', function(done) {
        RequestMock.intercept().reply(200, '{"id": 1, "ping": "pong"}');

        WeDeploy.data('http://localhost')
          .create('collection', {
            ping: 'pong',
          })
          .then(response => {
            assert.strictEqual('{"id": 1, "ping": "pong"}', response);
            done();
          });
      });
    });

    context('when creating with one array', function() {
      it('should create multiple data', function(done) {
        RequestMock.intercept().reply(
          200,
          '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]'
        );

        WeDeploy.data('http://localhost')
          .create('collection', [
            {
              ping: 'pong1',
            },
            {
              ping: 'pong2',
            },
          ])
          .then(response => {
            assert.strictEqual(
              '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]',
              response
            );
            done();
          });
      });
    });

    it('should set headers on create', function(done) {
      RequestMock.intercept().reply(200, '{"id": 1, "ping": "pong"}');

      WeDeploy.data('http://localhost')
        .header('TestHost', 'localhost')
        .create('collection', {
          ping: 'pong',
        })
        .then(response => {
          assert.strictEqual(getTestHostHeader_(), 'localhost');
          done();
        });
    });
  });

  describe('.update()', function() {
    beforeEach(function() {
      RequestMock.setup('PATCH', 'http://localhost/collection/1');
    });

    context('when using invalid params', function() {
      it('should fail trying to updating data without specifying the collection', function() {
        assert.throws(function() {
          WeDeploy.data('http://localhost').update(null, {
            ping: 'pong',
          });
        }, Error);
      });

      it('should fail trying to update data without specifying the data param', function() {
        assert.throws(function() {
          WeDeploy.data().update('collection', null);
        }, Error);
      });
    });

    context('when updating and it returns an error', function() {
      it('should fail updating because of an server error ', function(done) {
        RequestMock.intercept(
          'PATCH',
          'http://localhost/collection/242424'
        ).reply(500, '{"error": "Error 500"}');

        WeDeploy.data('http://localhost')
          .update('collection/242424', {
            ping: 'pong',
          })
          .catch(error => {
            assert.strictEqual('{"error": "Error 500"}', error);
            done();
          });
      });

      it('should fail updating because the row doesn\'t exist', function(done) {
        RequestMock.intercept(
          'PATCH',
          'http://localhost/collection/242424'
        ).reply(404, '{"error": "Error 404"}');

        WeDeploy.data('http://localhost')
          .update('collection/242424', {
            ping: 'pong',
          })
          .catch(error => {
            assert.strictEqual('{"error": "Error 404"}', error);
            done();
          });
      });
    });

    context('when updating with one object', function() {
      it('should update an object', function(done) {
        RequestMock.intercept().reply(200, '{"id": 1, "ping": "pongUpdated"}');

        WeDeploy.data('http://localhost')
          .update('collection/1', {
            ping: 'pongUpdated',
          })
          .then(response => {
            assert.strictEqual('{"id": 1, "ping": "pongUpdated"}', response);
            done();
          });
      });
    });

    context('when updating with one object and a new key', function() {
      it('should update a value and add the new key to the object', function(done) {
        RequestMock.intercept().reply(
          200,
          '{"id": 1, "ping": "pongUpdated", "newKey": "newValue"}'
        );

        WeDeploy.data('http://localhost')
          .update('collection/1', {
            ping: 'pongUpdated',
            newKey: 'newValue',
          })
          .then(response => {
            assert.strictEqual(
              '{"id": 1, "ping": "pongUpdated", "newKey": "newValue"}',
              response
            );
            done();
          });
      });
    });

    it('should set headers on update', function(done) {
      RequestMock.intercept().reply(200, '{"id": 1, "ping": "pongUpdated"}');

      WeDeploy.data('http://localhost')
        .header('TestHost', 'localhost')
        .update('collection/1', {
          ping: 'pongUpdated',
        })
        .then(response => {
          assert.strictEqual(getTestHostHeader_(), 'localhost');
          done();
        });
    });
  });

  describe('.replace()', function() {
    beforeEach(function() {
      RequestMock.setup('PUT', 'http://localhost/collection/1');
    });

    context('when using invalid params', function() {
      it('should fail trying to replacing data without specifying the collection', function() {
        assert.throws(function() {
          WeDeploy.data('http://localhost').replace(null, {
            ping: 'pong',
          });
        }, Error);
      });

      it('should fail trying to replace data without specifying the data param', function() {
        assert.throws(function() {
          WeDeploy.data().update('collection', null);
        }, Error);
      });
    });

    context('when replacing and it returns an error', function() {
      it('should fail replacing because of an server error ', function(done) {
        RequestMock.intercept(
          'PUT',
          'http://localhost/collection/242424'
        ).reply(500, '{"error": "Error 500"}');

        WeDeploy.data('http://localhost')
          .replace('collection/242424', {
            ping: 'pong',
          })
          .catch(error => {
            assert.strictEqual('{"error": "Error 500"}', error);
            done();
          });
      });

      it('should fail replacing because the row doesn\'t exist', function(done) {
        RequestMock.intercept(
          'PUT',
          'http://localhost/collection/242424'
        ).reply(404, '{"error": "Error 404"}');

        WeDeploy.data('http://localhost')
          .replace('collection/242424', {
            ping: 'pong',
          })
          .catch(error => {
            assert.strictEqual('{"error": "Error 404"}', error);
            done();
          });
      });
    });

    context('when replacing with one object', function() {
      it('should replace an object', function(done) {
        RequestMock.intercept().reply(200, '{"id": 1, "ping": "pongUpdated"}');

        WeDeploy.data('http://localhost')
          .replace('collection/1', {
            ping: 'pongUpdated',
          })
          .then(response => {
            assert.strictEqual('{"id": 1, "ping": "pongUpdated"}', response);
            done();
          });
      });
    });

    context('when replacing with one object and a new key', function() {
      it('should replace a value and add the new key to the object', function(done) {
        RequestMock.intercept().reply(
          200,
          '{"id": 1, "ping": "pongUpdated", "newKey": "newValue"}'
        );

        WeDeploy.data('http://localhost')
          .replace('collection/1', {
            ping: 'pongUpdated',
            newKey: 'newValue',
          })
          .then(response => {
            assert.strictEqual(
              '{"id": 1, "ping": "pongUpdated", "newKey": "newValue"}',
              response
            );
            done();
          });
      });
    });

    it('should set headers on replace', function(done) {
      RequestMock.intercept().reply(200, '{"id": 1, "ping": "pongUpdated"}');

      WeDeploy.data('http://localhost')
        .header('TestHost', 'localhost')
        .replace('collection/1', {
          ping: 'pongUpdated',
        })
        .then(response => {
          assert.strictEqual(getTestHostHeader_(), 'localhost');
          done();
        });
    });
  });

  describe('.delete()', function() {
    beforeEach(function() {
      RequestMock.setup('DELETE', 'http://localhost/collection/242424');
    });

    context('when using invalid params', function() {
      it('should fail trying to create data without specifying the collection', function() {
        assert.throws(function() {
          WeDeploy.data('http://localhost').delete(null);
        }, Error);
      });
    });

    context('when updating and it returns an error', function() {
      it('should fail updating because of an server error ', function(done) {
        RequestMock.intercept().reply(500, '{"error": "Error 500"}');

        WeDeploy.data('http://localhost')
          .delete('collection/242424', {
            ping: 'pong',
          })
          .catch(error => {
            assert.strictEqual('{"error": "Error 500"}', error);
            done();
          });
      });

      it('should fail updating because the row doesn\'t exist', function(done) {
        RequestMock.intercept().reply(404, '{"error": "Error 404"}');

        WeDeploy.data('http://localhost')
          .delete('collection/242424', {
            ping: 'pong',
          })
          .catch(error => {
            assert.strictEqual('{"error": "Error 404"}', error);
            done();
          });
      });
    });

    context('when successfully deletes data', function() {
      it('should delete a field', function(done) {
        RequestMock.intercept(
          'DELETE',
          'http://localhost/collection/1/title'
        ).reply(204);

        WeDeploy.data('http://localhost')
          .delete('collection/1/title')
          .then(response => {
            assert.strictEqual(undefined, response);
            done();
          });
      });

      it('should delete a data row', function(done) {
        RequestMock.intercept('DELETE', 'http://localhost/collection/1').reply(
          204
        );

        WeDeploy.data('http://localhost')
          .delete('collection/1')
          .then(response => {
            assert.strictEqual(undefined, response);
            done();
          });
      });

      it('should delete a collection', function(done) {
        RequestMock.intercept('DELETE', 'http://localhost/collection').reply(
          204
        );

        WeDeploy.data('http://localhost')
          .delete('collection')
          .then(response => {
            assert.strictEqual(undefined, response);
            done();
          });
      });
    });
  });

  describe('.limit()', function() {
    it('should send the request with query limit in the body', function(done) {
      RequestMock.intercept('GET', 'http://localhost/collection?limit=1').reply(
        200,
        '[{"id": 1, "ping": "pong1"}]'
      );

      WeDeploy.data('http://localhost')
        .limit(1)
        .get('collection')
        .then(response => {
          assert.strictEqual('[{"id": 1, "ping": "pong1"}]', response);
          done();
        });
    });

    it('should build the limit into the query body', function() {
      const data = WeDeploy.data('http://localhost').limit(99);
      assert.strictEqual(data.query_.body().limit, 99);
    });
  });

  describe('.count()', function() {
    it('should send request with query count in the body', function(done) {
      RequestMock.intercept('GET', 'http://localhost/food?type=count').reply(
        200,
        '5'
      );

      WeDeploy.data('http://localhost')
        .count()
        .get('food')
        .then(function(response) {
          assert.strictEqual('5', response);
          done();
        });
    });

    it('should build the count type into the query body', function() {
      const data = WeDeploy.data('http://localhost').count();

      assert.strictEqual(data.query_.body().type, 'count');
    });
  });

  describe('.offset()', function() {
    it('should send request with query offset in the body', function(done) {
      RequestMock.intercept('GET', 'http://localhost/food?offset=2').reply(
        200,
        '[{"id": 1, "ping": "pong1"}]'
      );

      WeDeploy.data('http://localhost')
        .offset(2)
        .get('food')
        .then(response => {
          assert.strictEqual('[{"id": 1, "ping": "pong1"}]', response);
          done();
        });
    });

    it('should build the offset into the query body', function() {
      const data = WeDeploy.data('http://localhost').offset(2);

      assert.strictEqual(data.query_.body().offset, 2);
    });
  });

  describe('.highlight()', function() {
    it('should send request with query highlight in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/food?highlight=%5B%22field%22%5D'
      ).reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

      WeDeploy.data('http://localhost')
        .highlight('field')
        .get('food')
        .then(function(response) {
          assert.strictEqual(
            '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]',
            response
          );
          done();
        });
    });

    it('should build the highlight into the query body', function() {
      const data = WeDeploy.data('http://localhost').highlight('highlighted');

      assert.deepEqual(data.query_.body().highlight, ['highlighted']);
    });
  });

  describe('.orderBy()', function() {
    it('should send request with query sort in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/food?sort=%5B%7B%22id%22%3A%22asc%22%7D%5D'
      ).reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

      WeDeploy.data('http://localhost')
        .orderBy('id', 'asc')
        .get('food')
        .then(function(response) {
          assert.strictEqual(
            '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]',
            response
          );
          done();
        });
    });

    it('should build the orderBy into the query body', function() {
      const data = WeDeploy.data('http://localhost').orderBy('id', 'asc');

      assert.deepEqual(data.query_.body().sort, [
        {
          id: 'asc',
        },
      ]);
    });
  });

  describe('.none()', function() {
    it('should send request with query none in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/food?filter=' +
					'%5B%7B%22and%22%3A%5B%7B%22name%22%3A%7B%22operator%22%3A' +
					'%22none%22%2C%22value%22%3A%5B%22cuscuz%22%2C' +
					'%22tapioca%22%5D%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "name": "melancia"}]');

      WeDeploy.data('http://localhost')
        .none('name', 'cuscuz', 'tapioca')
        .get('food')
        .then(function(response) {
          assert.strictEqual('[{"id": 2, "name": "melancia"}]', response);
          done();
        });
    });

    it('should build the none query into the query body', function() {
      const data = WeDeploy.data('http://localhost').none(
        'name',
        'cuscuz',
        'tapioca'
      );

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          filter: [
            {
              and: [
                {
                  name: {
                    operator: 'none',
                    value: ['cuscuz', 'tapioca'],
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.exists()', function() {
    it('should send request with query exists in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/food?filter=%5B%7B%22and%22%3A%5B%7B%22size%22%3A%7B%22operator%22%3A%22exists%22%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "name": "cuscuz", "size": 10}]');

      WeDeploy.data('http://localhost')
        .exists('size')
        .get('food')
        .then(function(response) {
          assert.strictEqual(
            '[{"id": 2, "name": "cuscuz", "size": 10}]',
            response
          );
          done();
        });
    });

    it('should build the exists query into the query body', function() {
      const data = WeDeploy.data('http://localhost').exists('size');

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          filter: [
            {
              and: [
                {
                  size: {
                    operator: 'exists',
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.match()', function() {
    it('should send request with query match in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/food?filter=%5B%7B%22and%22%3A%5B%7B' +
					'%22name%22%3A%7B%22operator%22%3A%22match%22%2C%22value%22%3A' +
					'%22cuscuz%22%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "name": "cuscuz"}]');

      WeDeploy.data('http://localhost')
        .match('name', 'cuscuz')
        .get('food')
        .then(function(response) {
          assert.strictEqual('[{"id": 2, "name": "cuscuz"}]', response);
          done();
        });
    });

    it('should build the match query into the query body', function() {
      const data = WeDeploy.data('http://localhost').match('name', 'cuscuz');

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          filter: [
            {
              and: [
                {
                  name: {
                    operator: 'match',
                    value: 'cuscuz',
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.phrase()', function() {
    it('should send request with query phrase in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/books?filter=%5B%7B%22and%22%3A%5B%7B%22' +
					'title%22%3A%7B%22operator%22%3A%22phrase%22%2C%22value%22%' +
					'3A%22quick%20brown%20fox%22%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "title": "the quick brown fox"}]');

      WeDeploy.data('http://localhost')
        .phrase('title', 'quick brown fox')
        .get('books')
        .then(function(response) {
          assert.strictEqual(
            '[{"id": 2, "title": "the quick brown fox"}]',
            response
          );
          done();
        });
    });

    it('should build the phrase query into the query body', function() {
      const data = WeDeploy.data('http://localhost').phrase(
        'title',
        'quick brown fox'
      );

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          filter: [
            {
              and: [
                {
                  title: {
                    operator: 'phrase',
                    value: 'quick brown fox',
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.prefix()', function() {
    it('should send request with query prefix in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/food?filter=%5B%7B%22and%22%3A%5B%7B%22' +
					'name%22%3A%7B%22operator%22%3A%22prefix%22%2C%22value%22%' +
					'3A%22cus%22%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "name": "cuscuz"}]');

      WeDeploy.data('http://localhost')
        .prefix('name', 'cus')
        .get('food')
        .then(function(response) {
          assert.strictEqual('[{"id": 2, "name": "cuscuz"}]', response);
          done();
        });
    });

    it('should build the prefix query into the query body', function() {
      const data = WeDeploy.data('http://localhost').prefix('name', 'cus');

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          filter: [
            {
              and: [
                {
                  name: {
                    operator: 'prefix',
                    value: 'cus',
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.similar()', function() {
    it('should send request with query similar in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/food?filter=%5B%7B%22and%22%3A%5B%7B' +
					'%22name%22%3A%7B%22operator%22%3A%22similar%22%2C' +
					'%22value%22%3A%7B%22query%22%3A%22cusc%22%7D%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "name": "cuscuz"}]');

      WeDeploy.data('http://localhost')
        .similar('name', 'cusc')
        .get('food')
        .then(function(response) {
          assert.strictEqual('[{"id": 2, "name": "cuscuz"}]', response);
          done();
        });
    });

    it('should build the similar query into the query body', function() {
      const data = WeDeploy.data('http://localhost').similar('name', 'cusc');

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          filter: [
            {
              and: [
                {
                  name: {
                    operator: 'similar',
                    value: {
                      query: 'cusc',
                    },
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.lt()', function() {
    it('should send request with query lt in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/food?filter=%5B%7B%22and%22%3A%5B%7B' +
					'%22size%22%3A%7B%22operator%22%3A%22%3C%22%2C' +
					'%22value%22%3A30%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "name": "cuscuz", "size": 10}]');

      WeDeploy.data('http://localhost')
        .lt('size', 30)
        .get('food')
        .then(function(response) {
          assert.strictEqual(
            '[{"id": 2, "name": "cuscuz", "size": 10}]',
            response
          );
          done();
        });
    });

    it('should build the lt query into the query body', function() {
      const data = WeDeploy.data('http://localhost').lt('size', 30);

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          filter: [
            {
              and: [
                {
                  size: {
                    operator: '<',
                    value: 30,
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.lte()', function() {
    it('should send request with query lte in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/food?filter=%5B%7B%22and%22%3A%5B%7B' +
					'%22size%22%3A%7B%22operator%22%3A%22%3C%3D%22%2C' +
					'%22value%22%3A30%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "name": "cuscuz", "size": 10}]');

      WeDeploy.data('http://localhost')
        .lte('size', 30)
        .get('food')
        .then(function(response) {
          assert.strictEqual(
            '[{"id": 2, "name": "cuscuz", "size": 10}]',
            response
          );
          done();
        });
    });

    it('should build the lte query into the query body', function() {
      const data = WeDeploy.data('http://localhost').lte('size', 30);

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          filter: [
            {
              and: [
                {
                  size: {
                    operator: '<=',
                    value: 30,
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.gt()', function() {
    it('should send request with query gt in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/food?filter=%5B%7B%22and%22%3A%5B%7B' +
					'%22size%22%3A%7B%22operator%22%3A%22%3E%22%2C' +
					'%22value%22%3A30%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "name": "cuscuz", "size": 10}]');

      WeDeploy.data('http://localhost')
        .gt('size', 30)
        .get('food')
        .then(function(response) {
          assert.strictEqual(
            '[{"id": 2, "name": "cuscuz", "size": 10}]',
            response
          );
          done();
        });
    });

    it('should build the gt query into the query body', function() {
      const data = WeDeploy.data('http://localhost').gt('size', 30);

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          filter: [
            {
              and: [
                {
                  size: {
                    operator: '>',
                    value: 30,
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.gte()', function() {
    it('should send request with query gte in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/food?filter=%5B%7B%22and' +
					'%22%3A%5B%7B%22size%22%3A%7B%22operator%22%3A%22%3E%3' +
					'D%22%2C%22value%22%3A30%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "name": "cuscuz", "size": 10}]');

      WeDeploy.data('http://localhost')
        .gte('size', 30)
        .get('food')
        .then(function(response) {
          assert.strictEqual(
            '[{"id": 2, "name": "cuscuz", "size": 10}]',
            response
          );
          done();
        });
    });

    it('should build the gte query into the query body', function() {
      const data = WeDeploy.data('http://localhost').gte('size', 30);

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          filter: [
            {
              and: [
                {
                  size: {
                    operator: '>=',
                    value: 30,
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.any()', function() {
    it('should send request with query any in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/food?filter=%5B%7B%22and%22%3A%5B%7B' +
					'%22name%22%3A%7B%22operator%22%3A%22any%22%2C' +
					'%22value%22%3A%5B%22cuscuz%22%2C%22tapioca%22%5D%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "name": "cuscuz"}]');

      WeDeploy.data('http://localhost')
        .any('name', 'cuscuz', 'tapioca')
        .get('food')
        .then(function(response) {
          assert.strictEqual('[{"id": 2, "name": "cuscuz"}]', response);
          done();
        });
    });

    it('should build the any query into the query body', function() {
      const data = WeDeploy.data('http://localhost').any(
        'name',
        'cuscuz',
        'tapioca'
      );

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          filter: [
            {
              and: [
                {
                  name: {
                    operator: 'any',
                    value: ['cuscuz', 'tapioca'],
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.boundingBox()', function() {
    it('should send request with query boundingBox in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/restaurants?filter=%5B%7B%22and%22%3A%5B%7B' +
					'%22shape%22%3A%7B%22operator%22%3A%22gp%22%2C' +
					'%22value%22%3A%5B%2220%2C0%22%2C%5B0%2C20%5D%5D%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "name": "cuscuzeria"}]');

      WeDeploy.data('http://localhost')
        .boundingBox('shape', Geo.boundingBox('20,0', [0, 20]))
        .get('restaurants')
        .then(function(response) {
          assert.strictEqual('[{"id": 2, "name": "cuscuzeria"}]', response);
          done();
        });
    });

    it('should build the boundingBox query into the query body', function() {
      const data = WeDeploy.data('http://localhost').boundingBox(
        'shape',
        Geo.boundingBox('20,0', [0, 20])
      );

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          filter: [
            {
              and: [
                {
                  shape: {
                    operator: 'gp',
                    value: ['20,0', [0, 20]],
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.distance()', function() {
    it('should send request with query distance in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/restaurants?filter=%5B%7B%22and%22%3A%5B%7B' +
					'%22point%22%3A%7B%22operator%22%3A%22gd%22%2C%22value%22%3A%7B' +
					'%22location%22%3A%5B0%2C0%5D%2C%22max%22%3A2%7D%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "name": "cuscuzeria"}]');

      WeDeploy.data('http://localhost')
        .distance('point', Geo.circle([0, 0], 2))
        .get('restaurants')
        .then(function(response) {
          assert.strictEqual('[{"id": 2, "name": "cuscuzeria"}]', response);
          done();
        });
    });

    it('should build the distance query into the query body', function() {
      const data = WeDeploy.data('http://localhost').distance(
        'point',
        Geo.circle([0, 0], 2)
      );

      const query = data.processAndResetQueryState();

      const body = {
        body_: {
          filter: [
            {
              and: [
                {
                  point: {
                    operator: 'gd',
                    value: {
                      location: [0, 0],
                      max: 2,
                    },
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(query, body);
    });
  });

  describe('.range()', function() {
    it('should send request with query distance in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/restaurants?filter=%5B%7B%22and%22%3A%5B%7B' +
					'%22points%22%3A%7B%22operator%22%3A%22range%22%2C' +
					'%22value%22%3A%7B%22from%22%3A12%2C%22to%22%3A15%7D%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "name": "cuscuzeria", "points": 13}]');

      WeDeploy.data('http://localhost')
        .range('points', 12, 15)
        .get('restaurants')
        .then(function(response) {
          assert.strictEqual(
            '[{"id": 2, "name": "cuscuzeria", "points": 13}]',
            response
          );
          done();
        });
    });

    it('should build the range query into the query body', function() {
      const data = WeDeploy.data('http://localhost').range('points', 12, 15);

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          filter: [
            {
              and: [
                {
                  points: {
                    operator: 'range',
                    value: {
                      from: 12,
                      to: 15,
                    },
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.where()', function() {
    it('should send request with query where in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/food?filter=%5B%7B%22and%22%3A%5B%7B' +
					'%22name%22%3A%7B%22operator%22%3A%22%3D%22%2C' +
					'%22value%22%3A%22foo%22%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

      WeDeploy.data('http://localhost')
        .where('name', '=', 'foo')
        .get('food')
        .then(function(response) {
          assert.strictEqual(
            '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]',
            response
          );
          done();
        });
    });

    it('should build the filter query into the query body', function() {
      const data = WeDeploy.data('http://localhost').where('name', '=', 'foo');

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          filter: [
            {
              and: [
                {
                  name: {
                    operator: '=',
                    value: 'foo',
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.or()', function() {
    it('should thrown an error when using or without any conditional before', function() {
      assert.throws(function() {
        WeDeploy.data('http://localhost').or('name', '!=', 'bar');
      }, Error);
    });
    it('should send request with query or in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/food?filter=%5B%7B%22or%22%3A%5B%7B' +
					'%22and%22%3A%5B%7B%22name%22%3A%7B%22operator%22%3A%22%3D%22%2C' +
					'%22value%22%3A%22foo%22%7D%7D%5D%7D%2C%7B%22name%22%3A%7B' +
					'%22operator%22%3A%22!%3D%22%2C%22value%22%3A%22bar%22%7D%7D%5D%7D%5D'
      ).reply(200, '[{"id": 2, "name": "foo"}]');
      WeDeploy.data('http://localhost')
        .where('name', '=', 'foo')
        .or('name', '!=', 'bar')
        .get('food')
        .then(function(response) {
          assert.strictEqual('[{"id": 2, "name": "foo"}]', response);
          done();
        });
    });

    it('should build the or query into the query body', function() {
      const data = WeDeploy.data('http://localhost')
        .where('name', '=', 'foo')
        .or('name', '!=', 'bar');

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          filter: [
            {
              or: [
                {
                  and: [
                    {
                      name: {
                        operator: '=',
                        value: 'foo',
                      },
                    },
                  ],
                },
                {
                  name: {
                    operator: '!=',
                    value: 'bar',
                  },
                },
              ],
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.aggregate()', function() {
    it('should send request with query aggregate in the body', function(done) {
      RequestMock.intercept(
        'GET',
        'http://localhost/food?aggregation=%5B%7B%22field%22%3A%7B%22' +
					'name%22%3A%22name%22%2C%22operator%22%3A%22terms%22%7D%7D%5D'
      ).reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

      WeDeploy.data('http://localhost')
        .aggregate('name', 'field')
        .get('food')
        .then(function(response) {
          assert.strictEqual(
            '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]',
            response
          );
          done();
        });
    });

    it('should build the aggregate query into the query body', function() {
      const data = WeDeploy.data('http://localhost').aggregate(
        'name',
        'field',
        '='
      );

      const query = data.processAndResetQueryState();

      const queryBody = {
        body_: {
          aggregation: [
            {
              field: {
                name: 'name',
                operator: '=',
              },
            },
          ],
        },
      };

      assert.deepEqual(queryBody, query);
    });
  });

  describe('.search()', function() {
    context('when using invalid params', function() {
      it('should fail trying to search data without specifying the collection', function() {
        WeDeploy.socket();
        const data = WeDeploy.data('http://localhost');
        assert.throws(function() {
          data.search(null);
        }, Error);
      });
    });

    context('when using valid params', function() {
      it('should set headers on search', function(done) {
        RequestMock.intercept('GET', 'http://localhost/food?type=search').reply(
          200,
          '{"total":1}'
        );

        WeDeploy.data('http://localhost')
          .header('TestHost', 'localhost')
          .search('food')
          .then(function(response) {
            assert.strictEqual(getTestHostHeader_(), 'localhost');
            done();
          });
      });

      it('should send search request when no filters are provided', function(done) {
        RequestMock.intercept('GET', 'http://localhost/food?type=search').reply(
          200,
          '{"total":1,"highlights":{"2":{}},"documents":[{"id":2,"ping":"pong1"}],"scores":{"2":0.13102644681930542},"queryTime":1}'
        );

        WeDeploy.data('http://localhost')
          .search('food')
          .then(function(response) {
            assert.strictEqual(
              '{"total":1,"highlights":{"2":{}},"documents":[{"id":2,"ping":"pong1"}],"scores":{"2":0.13102644681930542},"queryTime":1}',
              response
            );
            done();
          });
      });

      it('should send request with query search in the body', function(done) {
        RequestMock.intercept(
          'GET',
          'http://localhost/food?type=search&filter=%5B%7B%22and%22%3A%5B%7B' +
						'%22name%22%3A%7B%22operator%22%3A%22%3D%22%2C%22value%22%3A' +
						'%22foo%22%7D%7D%2C%7B%22name%22%3A%7B%22operator%22%3A%22%3D%22%2C' +
						'%22value%22%3A%22bar%22%7D%7D%5D%7D%5D'
        ).reply(
          200,
          '{"total":1,"documents":[{"id":2,"ping":"pong1"}],"scores":{"2":0.13102644681930542},"queryTime":1}'
        );

        WeDeploy.data('http://localhost')
          .where('name', '=', 'foo')
          .where('name', '=', 'bar')
          .search('food')
          .then(function(response) {
            assert.strictEqual(
              '{"total":1,"documents":[{"id":2,"ping":"pong1"}],"scores":{"2":0.13102644681930542},"queryTime":1}',
              response
            );
            done();
          });
      });

      it('should build the query as search type', function() {
        const data = WeDeploy.data('http://localhost')
          .where('name', '=', 'foo')
          .where('name', '=', 'bar');
        data.isSearch_ = true;
        const query = data.processAndResetQueryState();

        const queryBody = {
          body_: {
            filter: [
              {
                and: [
                  {
                    name: {
                      operator: '=',
                      value: 'foo',
                    },
                  },
                  {
                    name: {
                      operator: '=',
                      value: 'bar',
                    },
                  },
                ],
              },
            ],
            type: 'search',
          },
        };
        assert.deepEqual(queryBody, query);
      });
    });

    context(
      'when using multiple searches with the same data client',
      function() {
        it('should not aggregate the previous query into the next fetch', function(done) {
          const data = WeDeploy.data('http://localhost');

          RequestMock.intercept(
            'GET',
            'http://localhost/food?type=search&filter=%5B%7B%22and%22%3A%5B%7B%22type%22%3A%7B%22operator%22%3A%22%3D%22%2C%22value%22%3A%22fruit%22%7D%7D%5D%7D%5D'
          ).reply(200);

          data
            .where('type', 'fruit')
            .search('food')
            .then(() => {
              RequestMock.teardown();
              RequestMock.setup();

              const requestUrlWithNoQuery = 'http://localhost/food?type=search';

              RequestMock.intercept('GET', requestUrlWithNoQuery).reply(200);

              data.search('food').then(() => {
                assert.strictEqual(requestUrlWithNoQuery, RequestMock.getUrl());
                done();
              });
            });
        });
      }
    );

    context(
      'when using multiple searches with different data clients',
      function() {
        it('should not aggregate the previous query into the next fetch', function(done) {
          RequestMock.intercept(
            'GET',
            'http://localhost/food?type=search&filter=%5B%7B%22and%22%3A%5B%7B%22type%22%3A%7B%22operator%22%3A%22%3D%22%2C%22value%22%3A%22fruit%22%7D%7D%5D%7D%5D'
          ).reply(200);

          WeDeploy.data('http://localhost')
            .where('type', 'fruit')
            .search('food')
            .then(() => {
              RequestMock.teardown();
              RequestMock.setup();

              const requestUrlWithNoQuery = 'http://localhost/food?type=search';

              RequestMock.intercept('GET', requestUrlWithNoQuery).reply(200);

              WeDeploy.data('http://localhost')
                .search('food')
                .then(() => {
                  assert.strictEqual(
                    requestUrlWithNoQuery,
                    RequestMock.getUrl()
                  );
                  done();
                });
            });
        });
      }
    );
  });

  describe('.get()', function() {
    context('when using invalid params', function() {
      it('should fail trying to retrieve data without specifying the collection', function() {
        const data = WeDeploy.data('http://localhost');
        assert.throws(function() {
          data.get(null);
        }, Error);
      });
    });

    context('when using valid params', function() {
      it('should set headers on get', function(done) {
        RequestMock.intercept('GET', 'http://localhost/food').reply(
          200,
          '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]'
        );

        WeDeploy.data('http://localhost')
          .header('TestHost', 'localhost')
          .get('food')
          .then(response => {
            assert.strictEqual(getTestHostHeader_(), 'localhost');
            done();
          });
      });

      it('should return all data of a collection', function(done) {
        RequestMock.intercept('GET', 'http://localhost/food').reply(
          200,
          '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]'
        );

        WeDeploy.data('http://localhost')
          .get('food')
          .then(response => {
            assert.strictEqual(
              '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]',
              response
            );
            done();
          });
      });
    });

    context('when using multiple gets with the same data client', function() {
      it('should not aggregate the previous query into the next fetch', function(done) {
        const data = WeDeploy.data('http://localhost');

        RequestMock.intercept(
          'GET',
          'http://localhost/food?filter=%5B%7B%22and%22%3A%5B%7B%22type%22%3A%7B%22operator%22%3A%22%3D%22%2C%22value%22%3A%22fruit%22%7D%7D%5D%7D%5D'
        ).reply(200);

        data
          .where('type', 'fruit')
          .get('food')
          .then(() => {
            RequestMock.teardown();
            RequestMock.setup();

            const requestUrlWithNoQuery = 'http://localhost/food';

            RequestMock.intercept('GET', requestUrlWithNoQuery).reply(200);

            data.get('food').then(() => {
              assert.strictEqual(requestUrlWithNoQuery, RequestMock.getUrl());
              done();
            });
          });
      });
    });

    context('when using multiple gets with different data clients', function() {
      it('should not aggregate the previous query into the next fetch', function(done) {
        RequestMock.intercept(
          'GET',
          'http://localhost/food?filter=%5B%7B%22and%22%3A%5B%7B%22type%22%3A%7B%22operator%22%3A%22%3D%22%2C%22value%22%3A%22fruit%22%7D%7D%5D%7D%5D'
        ).reply(200);

        WeDeploy.data('http://localhost')
          .where('type', 'fruit')
          .get('food')
          .then(() => {
            RequestMock.teardown();
            RequestMock.setup();

            const requestUrlWithNoQuery = 'http://localhost/food';

            RequestMock.intercept('GET', requestUrlWithNoQuery).reply(200);

            WeDeploy.data('http://localhost')
              .get('food')
              .then(() => {
                assert.strictEqual(requestUrlWithNoQuery, RequestMock.getUrl());
                done();
              });
          });
      });
    });
  });

  describe('.createCollection()', function() {
    context('when using invalid params', function() {
      it('should fail if the collection is not specified', function() {
        const data = WeDeploy.data('http://localhost');
        assert.throws(function() {
          data.createCollection(null);
        }, Error);
      });

      it('should fail if mappings are not specified', function() {
        const data = WeDeploy.data('http://localhost');
        assert.throws(function() {
          data.createCollection('collection1');
        }, Error);
      });

      it('should fail if there are invalid types mappings', function() {
        const data = WeDeploy.data('http://localhost');
        assert.throws(function() {
          data.createCollection('collection1', {
            field1: 'string',
            field2: {
              field1: {
                field1: 'fake',
              },
            },
          });
        }, Error);
      });

      it('should fail if function is passed as mapping', function() {
        const data = WeDeploy.data('http://localhost');
        assert.throws(function() {
          data.createCollection('collection1', {
            field1: 'string',
            field2: {
              field1: {
                field1: function a() {},
              },
            },
          });
        }, Error);
      });

      it('should fail if an array is passed as mapping', function() {
        const data = WeDeploy.data('http://localhost');
        assert.throws(function() {
          data.createCollection('collection1', {
            field1: 'string',
            field2: {
              field1: {
                field1: ['one', 'two', 'three'],
              },
            },
          });
        }, Error);
      });
    });

    context('when creating mappings', function() {
      beforeEach(function() {
        RequestMock.setup('POST', 'http://localhost');
      });

      it('should create mappings for the field types', function(done) {
        RequestMock.intercept().reply(
          200,
          '{"mappings":{"field1":"string"},"size":130,"documents":0,"name":"collection1"}'
        );

        WeDeploy.data('http://localhost')
          .createCollection('collection', {
            field1: 'string',
          })
          .then(response => {
            assert.strictEqual(
              '{"mappings":{"field1":"string"},"size":130,"documents":0,"name":"collection1"}',
              response
            );
            done();
          });
      });
    });
  });

  describe('.updateCollection', function() {
    context('when using invalid params', function() {
      it('should fail if the collection is not specified', function() {
        const data = WeDeploy.data('http://localhost');
        assert.throws(function() {
          data.updateCollection(null);
        }, Error);
      });

      it('should fail if mappings are not specified', function() {
        const data = WeDeploy.data('http://localhost');
        assert.throws(function() {
          data.updateCollection('collection1');
        }, Error);
      });

      it('should fail if there are invalid types mappings', function() {
        const data = WeDeploy.data('http://localhost');
        assert.throws(function() {
          data.updateCollection('collection1', {
            field1: 'string',
            field2: {
              field1: {
                field1: 'fake',
              },
            },
          });
        }, Error);
      });

      it('should fail if function is passed as mapping', function() {
        const data = WeDeploy.data('http://localhost');
        assert.throws(function() {
          data.createCollection('collection1', {
            field1: 'string',
            field2: {
              field1: {
                field1: function a() {},
              },
            },
          });
        }, Error);
      });

      it('should fail if an array is passed as mapping', function() {
        const data = WeDeploy.data('http://localhost');
        assert.throws(function() {
          data.createCollection('collection1', {
            field1: 'string',
            field2: {
              field1: {
                field1: ['one', 'two', 'three'],
              },
            },
          });
        }, Error);
      });
    });

    context('when updating mappings', function() {
      beforeEach(function() {
        RequestMock.setup('PATCH', 'http://localhost');
      });

      it('should update mappings for the field types', function(done) {
        RequestMock.intercept().reply(200, '');

        WeDeploy.data('http://localhost')
          .updateCollection('collection', {
            field1: 'string',
            field2: 'string',
          })
          .then(response => {
            assert.strictEqual('', response);
            done();
          });
      });
    });
  });

  describe('.watch()', function() {
    context('when using invalid params', function() {
      it('should fail trying to watch data without specifying the collection', function() {
        WeDeploy.socket();
        const data = WeDeploy.data('http://localhost');
        assert.throws(function() {
          data.watch(null);
        }, Error);
      });
    });

    context('when using valid params', function() {
      it('should return all data of a collection', function(done) {
        WeDeploy.socket(function(url, opts) {
          assert.deepEqual(
            {
              forceNew: true,
              jsonp: true,
              path: '/fruits',
              query: 'url=' + encodeURIComponent('/fruits'),
            },
            opts
          );
          done();
        });
        WeDeploy.data('http://localhost').watch('fruits');
        WeDeploy.socket();
      });

      context('when using authentication', function() {
        it('should add Authentication header using token', function(done) {
          WeDeploy.socket(function(url, opts) {
            assert.deepEqual(
              {
                forceNew: true,
                jsonp: true,
                transportOptions: {
                  polling: {extraHeaders: {Authorization: 'Bearer token'}},
                },
                query: 'url=%2Ffruits',
                path: '/fruits',
              },
              opts
            );
            done();
          });
          WeDeploy.data('http://localhost')
            .auth(Auth.create('token'))
            .watch('fruits');
          WeDeploy.socket();
        });

        it('should add Authentication header using email and password', function(done) {
          WeDeploy.socket(function(url, opts) {
            assert.deepEqual(
              {
                forceNew: true,
                jsonp: true,
                transportOptions: {
                  polling: {
                    extraHeaders: {
                      Authorization: 'Basic dGVzdEB3ZWRlcGxveS5jb206cGFzcw==',
                    },
                  },
                },
                query: 'url=%2Ffruits',
                path: '/fruits',
              },
              opts
            );
            done();
          });

          WeDeploy.data('http://localhost')
            .auth(Auth.create('test@wedeploy.com', 'pass'))
            .watch('fruits');
          WeDeploy.socket();
        });
      });
    });

    context(
      'when using multiple watches with the same data client',
      function() {
        it('should not aggregate the previous query into the next fetch', function(done) {
          const data = WeDeploy.data('http://localhost');

          WeDeploy.socket(function() {
            WeDeploy.socket(function(url, opts) {
              const requestUrlWithNoQuery = 'url=%2Ffood';
              assert.strictEqual(requestUrlWithNoQuery, opts.query);
              done();
            });
            data.watch('food');
          });

          data.where('type', 'fruit').watch('food');
        });
      }
    );

    context(
      'when using multiple watches with different data clients',
      function() {
        it('should not aggregate the previous query into the next fetch', function(done) {
          WeDeploy.socket(function() {
            WeDeploy.socket(function(url, opts) {
              const requestUrlWithNoQuery = 'url=%2Ffood';
              assert.strictEqual(requestUrlWithNoQuery, opts.query);
              done();
            });
            WeDeploy.data('http://localhost').watch('food');
          });

          WeDeploy.data('http://localhost')
            .where('type', 'fruit')
            .watch('food');
        });
      }
    );
  });

  describe('.withCredentials()', function() {
    it('ensures the default to be false when no param is specified', function() {
      const data = WeDeploy.data('http://localhost').withCredentials();

      assert.strictEqual(data.withCredentials_, false);
    });

    it('ensures to be true', function() {
      const data = WeDeploy.data('http://localhost').withCredentials(true);

      assert.strictEqual(data.withCredentials_, true);
    });

    it('ensures to be false', function() {
      const data = WeDeploy.data('http://localhost').withCredentials(false);

      assert.strictEqual(data.withCredentials_, false);
    });

    it('ensures to be truthy', function() {
      const data = WeDeploy.data('http://localhost').withCredentials(1);
      assert.strictEqual(data.withCredentials_, true);
    });

    it('should restore withCredentials after sending request', function(done) {
      RequestMock.intercept('GET', 'http://localhost/food').reply(
        200,
        '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]'
      );

      const data = WeDeploy.data('http://localhost').withCredentials(true);
      assert.strictEqual(data.withCredentials_, true);

      data.get('food').then(response => {
        assert.strictEqual(data.withCredentials_, false);
        done();
      });
    });
  });
});

/**
 * Gets the "TestHost" header from the request object. Manages different
 * mock formats (browser vs node).
 * @return {?string}
 * @protected
 */
function getTestHostHeader_() {
  const request = RequestMock.get();
  const headers = request.requestHeaders || request.req.headers;
  return headers.TestHost || headers.testhost;
}
