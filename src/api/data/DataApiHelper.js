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

import ApiHelper from '../ApiHelper';
import Query from '../../api-query/Query';
import Filter from '../../api-query/Filter';
import {
  assertResponseSucceeded,
  assertValidFieldTypes,
  assertDefAndNotNull,
  assertObject,
} from '../assertions';
import {core} from 'metal';

/**
 * Class responsible for encapsulating data API calls.
 */
class DataApiHelper extends ApiHelper {
  /**
   * Constructs an {@link DataApiHelper} instance.
   * @param {!WeDeploy} wedeployClient {@link WeDeploy} client reference
   * @param {!string} dataUrl The Url to Data service
   * @constructor
   */
  constructor(wedeployClient, dataUrl) {
    super(wedeployClient);

    this.isSearch_ = false;
    this.dataUrl = dataUrl;
  }

  /**
   * Adds a filter to this request's {@link Query}.
   * @param {!Filter|string} fieldOrFilter Either a Filter instance or the
   *   name of the field to filter by.
   * @param {*=} opt_operatorOrValue Optionally set either the field's operator
   *   or its value
   * @param {*=} opt_value Optionally set the filter's value
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  where(fieldOrFilter, opt_operatorOrValue, opt_value) {
    this.getOrCreateFilter_().and(
      fieldOrFilter,
      opt_operatorOrValue,
      opt_value
    );
    return this;
  }

  /**
   * Adds a filter to be composed with this filter using the "or" operator.
   * @param {!Filter|string} fieldOrFilter Either a {@link Filter} instance or
   *   the name of the field to filter by
   * @param {*=} opt_operatorOrValue Optionally set either the field's operator
   *   or its value.
   * @param {*=} opt_value Optionally set the filter's value
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  or(fieldOrFilter, opt_operatorOrValue, opt_value) {
    if (this.getOrCreateFilter_().body().and.length === 0) {
      throw Error(
        'It\'s required to have a condition before using an \'or()\' ' +
          'for the first time.'
      );
    }
    this.getOrCreateFilter_().or(fieldOrFilter, opt_operatorOrValue, opt_value);
    return this;
  }

  /**
   * Adds a filter to be composed with this filter using "none" operator.
   * @param {string} field The name of the field to filter by
   * @param {!(Array|*)} args A variable amount of values to be used with
   * the "none" operator. Can be passed either as a single array or as
   * separate params
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  none(field, ...args) {
    return this.where(Filter.none(field, args));
  }

  /**
   * Adds a filter to be composed with this filter using "exists" operator.
   * @param {!string} field The name of the field to filter by
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  exists(field) {
    return this.where(Filter.exists(field));
  }

  /**
   * Adds a filter to be composed with this filter using "match" operator.
   * @param {string} field If no second string argument is given, this
   *   should be the query string, in which case all fields will be matched.
   *   Otherwise, this should be the name of the field to match.
   * @param {string=} opt_query The query string.
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  match(field, opt_query) {
    return this.where(Filter.match(field, opt_query));
  }

  /**
   * Adds a filter to be composed with this filter using "multi_match" operator.
   * @param {Array.<string>} fields If no second string argument is given, this
   *   should be the query string, in which case all fields will be matched.
   *   Otherwise, this should be the name of the field to match.
   * @param {string=} opt_query The query string.
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  multiMatch(fields, opt_query) {
    return this.where(Filter.multiMatch(fields, opt_query));
  }

  /**
   * Adds a filter to be composed with this filter using "phrase" operator.
   * @param {string} field The name of the field to filter by
   * @param {string=} opt_query The query string
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  phrase(field, opt_query) {
    return this.where(Filter.phrase(field, opt_query));
  }

  /**
   * Adds a filter to be composed with this filter using "prefix" operator.
   * @param {string} field The name of the field to filter by
   * @param {string=} opt_query The query string
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  prefix(field, opt_query) {
    return this.where(Filter.prefix(field, opt_query));
  }

  /**
   * Adds a filter to be composed with this filter using "similar" operator.
   * @param {string} fieldOrQuery If no second string argument is given, this
   *   should be the query string, in which case all fields will be matched.
   *   Otherwise, this should be the name of the field to match.
   * @param {?string} query The query string.
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  similar(fieldOrQuery, query) {
    return this.where(Filter.similar(fieldOrQuery, query));
  }

  /**
   * Returns a {@link Filter} instance that uses the "<" operator.
   * @param {string} field The name of the field to filter by
   * @param {*} value The filter's value
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  lt(field, value) {
    return this.where(Filter.lt(field, value));
  }

  /**
   * Returns a {@link Filter} instance that uses the "<=" operator.
   * @param {string} field The name of the field to filter by
   * @param {*} value The filter's value
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  lte(field, value) {
    return this.where(Filter.lte(field, value));
  }

  /**
   * Returns a {@link Filter} instance that uses the ">" operator.
   * @param {string} field The name of the field to filter by
   * @param {*} value The filter's value
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  gt(field, value) {
    return this.where(Filter.gt(field, value));
  }

  /**
   * Returns a {@link Filter} instance that uses the ">=" operator.
   * @param {string} field The name of the field to filter by
   * @param {*} value The filter's value
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  gte(field, value) {
    return this.where(Filter.gte(field, value));
  }

  /**
   * Adds a filter to be composed with this filter using "any" operator.
   * @param {string} field The name of the field to filter by
   * @param {!(Array|*)} args A variable amount of values to be used with
   *   the "none" operator. Can be passed either as a single array or as
   *   separate params.
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  any(field, ...args) {
    return this.where(Filter.any(field, args));
  }

  /**
   * Adds a filter to be composed with this filter using "gp" operator. This is
   * a special use case of `Filter.polygon` for bounding boxes.
   * @param {string} field The field's name
   * @param {*} boxOrUpperLeft Either a `Geo.BoundingBox` instance, or a
   *   bounding box's upper left coordinate
   * @param {*=} opt_lowerRight A bounding box's lower right coordinate.
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  boundingBox(field, boxOrUpperLeft, opt_lowerRight) {
    return this.where(
      Filter.boundingBox(field, boxOrUpperLeft, opt_lowerRight)
    );
  }

  /**
   * Adds a filter to be composed with this filter using "gd" operator.
   * @param {string} field The field's name
   * @param {*} locationOrCircle Either a `Geo.Circle` instance or a coordinate
   * @param {Range|string=} opt_rangeOrDistance Either a `Range` instance or
   *   the distance value.
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  distance(field, locationOrCircle, opt_rangeOrDistance) {
    return this.where(
      Filter.distance(field, locationOrCircle, opt_rangeOrDistance)
    );
  }

  /**
   * Adds a fields entry to this request's {@link Query} instance.
   * @param {string|Array} fields Single field name or an array of fields
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  fields(fields) {
    this.getOrCreateQuery_().fields(fields);
    return this;
  }

  /**
   * Adds a filter to be composed with this filter using "range" operator.
   * @param {string} field The field's name
   * @param {*} rangeOrMin Either a `Range` instance or a the range's min value
   * @param {*=} opt_max The range's max value
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  range(field, rangeOrMin, opt_max) {
    return this.where(Filter.range(field, rangeOrMin, opt_max));
  }

  /**
   * Sets the limit for this request's {@link Query}.
   * @param {number} limit The max amount of entries that this request should
   *   return
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  limit(limit) {
    this.getOrCreateQuery_().limit(limit);
    return this;
  }

  /**
   * Sets the offset for this request's {@link Query}.
   * @param {number} offset The index of the first entry that should be
   *    returned by this query
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  offset(offset) {
    this.getOrCreateQuery_().offset(offset);
    return this;
  }

  /**
   * Adds a highlight entry to this request's {@link Query} instance.
   * @param {string} field The field's name
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  highlight(field) {
    this.getOrCreateQuery_().highlight(field);
    return this;
  }

  /**
   * Adds an aggregation to this {@link Query} instance.
   * @param {string} name The aggregation name
   * @param {!Aggregation|string} aggregationOrField Either an
   *   {@link Aggregation} instance or the name of the aggregation field
   * @param {string=} opt_operator Optional aggregation operator.
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  aggregate(name, aggregationOrField, opt_operator = 'terms') {
    this.getOrCreateQuery_().aggregate(name, aggregationOrField, opt_operator);
    return this;
  }

  /**
   * Sets this request's query type to 'count'.
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  count() {
    this.getOrCreateQuery_().type('count');
    return this;
  }

  /**
   * Adds a sort query to this request's body.
   * @param {string} field The field that the query should be sorted by
   * @param {string=} opt_direction The direction the sort operation should
   *   use. If none is given, 'asc' is used by default
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   */
  orderBy(field, opt_direction) {
    this.getOrCreateQuery_().sort(field, opt_direction);
    return this;
  }

  /**
   * Creates an object (or multiple objects) and saves it to WeDeploy data. If
   * there's a validation registered in the collection and the request is
   * successful, the resulting object (or array of objects) is returned. The
   * data parameter can be either an object or an array of objects.
   * These Objects describe the attributes on the objects that are to be
   *   created.
   * ```javascript
   * var data = WeDeploy.data('http://demodata.wedeploy.io');
   *
   * data.create(
   *   'movies', {'title'=> 'Star Wars: Episode I – The Phantom Menace'})
   * 	 .then(function(movie){
   *     console.log(movie)
   *   });
   *
   * data.create(
   *   'movies', [{'title'=> 'Star Wars: Episode II – Attack of the Clones'},
   * 						  {'title'=> 'Star Wars: Episode III – Revenge of the Sith'})
   * 		 .then(function(movies){
   * 			 console.log(movies)
   *     });
   * ```
   * @param {string} collection Collection (key) used to create the new data
   * @param {Object|Array<Object>} data An object or an array of objects to be
   *   created
   * @return {!CancellablePromise} Resolves with server response. In case of
   *   single object, returns the created object. In case of multiple documents,
   *   returns an object with two properties:
   *   - hasFailures: <true or false>
   *   - results: <array of the created documents>
   */
  create(collection, data) {
    assertDefAndNotNull(collection, 'Collection key must be specified.');
    assertObject(data, 'Data can\'t be empty.');

    return this.buildUrl_()
      .path(collection)
      .post(data)
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body());
  }

  /**
   * Creates a collection and maps the field types.
   * @param {!string} collection The name of the collection
   * @param {!Object} fieldTypes Field types mappings of the collection
   * @return {!CancellablePromise} Resolves with response body
   */
  createCollection(collection, fieldTypes) {
    assertDefAndNotNull(collection, 'Collection key must be specified.');
    assertObject(fieldTypes, 'Field types mappings can\'t be empty.');
    assertValidFieldTypes(fieldTypes);

    return this.buildUrl_()
      .post({
        mappings: fieldTypes,
        name: collection,
      })
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body())
      .catch(error => {
        if (error.code === 400) {
          throw new Error(`Collection "${collection}" already exists.`);
        } else {
          throw error;
        }
      });
  }

  /**
   * Replaces the attributes of a document form the passed-in object and saves
   * the record. If the object is invalid, the saving will fail and an error
   * object will be returned.
   *
   * ```javascript
   * var data = WeDeploy.data('http://demodata.wedeploy.io');
   *
   * data.replace('movies/1019112353', {'title'=> 'Star Wars: Episode I'})
   * 		 .then(function(movie){
   * 			 console.log(movie)
   *     });
   * ```
   * @param {string} doc Key used to update the document.
   * @param {Object} data Attributes on the object that is to be updated.
   * @return {!CancellablePromise} Resolves with response body
   */
  replace(doc, data) {
    assertDefAndNotNull(doc, 'Document key must be specified.');
    assertObject(data, 'Data must be specified.');

    return this.buildUrl_()
      .path(doc)
      .put(data)
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body());
  }

  /**
   * Update the attributes of a document form the passed-in object and saves
   * the record. If the object is invalid, the saving will fail and an error
   * object will be returned.
   *
   * ```javascript
   * var data = WeDeploy.data('http://demodata.wedeploy.io');
   *
   * data.update('movies/1019112353', {'title'=> 'Star Wars: Episode I'})
   * 		 .then(function(movie){
   * 			 console.log(movie)
   *     });
   * ```
   * @param {string} doc Key used to update the document.
   * @param {Object} data Attributes on the object that is to be updated.
   * @return {!CancellablePromise} Resolves with response body
   */
  update(doc, data) {
    assertDefAndNotNull(doc, 'Document key must be specified.');
    assertObject(data, 'Data must be specified.');

    return this.buildUrl_()
      .path(doc)
      .patch(data)
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body());
  }

  /**
   * Deletes a [document/field/collection].
   * @param {string} key Key used to delete the document/field/collection
   * @return {!CancellablePromise} Resolves when delete request finishes
   */
  delete(key) {
    assertDefAndNotNull(key, 'Document/Field/Collection key must be specified');

    return this.buildUrl_()
      .path(key)
      .delete()
      .then(response => assertResponseSucceeded(response))
      .then(() => undefined);
  }

  /**
   * Retrieve data from a [document/field/collection].
   * @param {string} key Key used to delete the document/field/collection
   * @return {!CancellablePromise} Resolves with response body
   */
  get(key) {
    assertDefAndNotNull(key, 'Document/Field/Collection key must be specified');

    return this.buildUrl_()
      .path(key)
      .get(this.processAndResetQueryState())
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body());
  }

  /**
   * Retrieve data from a [document/field/collection] and put it in a search
   * format.
   * @param {string} key Key used to delete the document/field/collection
   * @return {!CancellablePromise} Resolves with response body
   */
  search(key) {
    assertDefAndNotNull(key, 'Document/Field/Collection key must be specified');

    this.isSearch_ = true;

    return this.buildUrl_()
      .path(key)
      .get(this.processAndResetQueryState())
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body());
  }

  /**
   * Updates the mapped field types of a collection.
   * @param {!string} collection The name of the collection
   * @param {!Object} fieldTypes Field types mappings of the collection
   * @return {!CancellablePromise} Resolves with response body
   */
  updateCollection(collection, fieldTypes) {
    assertDefAndNotNull(collection, 'Collection key must be specified.');
    assertObject(fieldTypes, 'Field types mappings can\'t be empty.');
    assertValidFieldTypes(fieldTypes);

    return this.buildUrl_()
      .patch({
        mappings: fieldTypes,
        name: collection,
      })
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body())
      .catch(error => {
        if (error.code === 404) {
          throw new Error(`Collection "${collection}" does not exist.`);
        } else if (error.code === 400) {
          throw new Error(
            'Existing fields cannot be remapped to a ' + 'different type.'
          );
        } else {
          throw error;
        }
      });
  }

  /**
   * Creates new socket.io instance. Monitor the arrival of new broadcasted
   * data.
   * @param  {string} collection key/collection used to find organized data
   * @param  {Object=} opt_options Object with Socket IO options
   * @return {!io} Returns an Socket IO reference so server events can be
   *   listened
   * @example
   * WeDeploy
   *   .data('https://<serviceID>-<projectID>.wedeploy.io')
   *   .watch('movies')
   *   .on('changes', function(data) {
   *     console.log(data);
   *   })
   *   .on('fail', function(error) {
   *     console.log(error);
   *   });
   */
  watch(collection, opt_options) {
    assertDefAndNotNull(collection, 'Collection key must be specified');

    return this.buildUrl_()
      .path(collection)
      .watch(this.processAndResetQueryState(), opt_options);
  }

  /**
   * Returns a {@link Filter} instance that uses the "wildcard" operator.
   * @param {string} field The name of the field to filter by
   * @param {*} value The filter's value
   * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
   *   calls can be chained
   * @since 4.5.0
   */
  wildcard(field, value) {
    return this.where(Filter.wildcard(field, value));
  }

  /**
   * Builds Url by joining headers, auth and withCredentials.
   * @return {WeDeploy} Returns the {@link WeDeploy} object itself, so calls can
   *   be chained
   * @protected
   */
  buildUrl_() {
    return this.wedeployClient
      .url(this.dataUrl)
      .headers(this.headers_)
      .withCredentials(this.withCredentials_)
      .auth(this.helperAuthScope);
  }

  /**
   * Gets the currently used main {@link Filter} object. If none exists yet, a
   * new one is created.
   * @return {!Query} Returns an instance of {@link Query}
   * @protected
   */
  getOrCreateFilter_() {
    if (!this.filter_) {
      this.filter_ = new Filter();
    }
    return this.filter_;
  }

  /**
   * Gets the currently used {@link Query} object. If none exists yet,
   * a new one is created.
   * @return {!Query} Returns an instance of {@link Query}
   * @protected
   */
  getOrCreateQuery_() {
    if (!this.query_) {
      this.query_ = new Query();
    }
    return this.query_;
  }

  /**
   * Aggregate filters into query and return its latest value. Query and
   * filters are cleaned after aggregation.
   * @return {Query} Returns an instance of {@link Query}
   * @protected
   */
  processAndResetQueryState() {
    let filter;

    if (core.isDefAndNotNull(this.filter_)) {
      filter = this.getOrCreateFilter_();
    }

    if (this.isSearch_) {
      this.getOrCreateQuery_().search(filter);
    } else if (filter) {
      this.getOrCreateQuery_().filter(filter);
    }

    const query = this.query_;
    this.headers_.clear();
    this.filter_ = null;
    this.isSearch_ = false;
    this.query_ = null;
    this.withCredentials_ = false;
    return query;
  }
}

/**
 * Watches for newly created or updated documents. Returns list of previous 500
 * changed documents.
 * @event changes
 * @memberof DataApiHelper
 * @instance
 */

/**
 * Watches for newly created documents. Returns most recently created document.
 * @event create
 * @memberof DataApiHelper
 * @instance
 */

/**
 * Watches for newly deleted documents. Returns most recently deleted document.
 * @event delete
 * @memberof DataApiHelper
 * @instance
 */

/**
 * Watches for newly updated. Returns most recently updated document.
 * @event update
 * @memberof DataApiHelper
 * @instance
 */

export default DataApiHelper;
