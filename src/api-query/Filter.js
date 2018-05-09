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
import FilterBody from './FilterBody';
import Geo from './Geo';
import Range from './Range';

/**
 * Class responsible for building filters.
 * @extends {Embodied}
 */
class Filter extends Embodied {
  /**
	 * Constructs a {@link Filter} instance.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} operatorOrValue If a third param is given, this should
	 *   be the filter's operator (like ">="). Otherwise, this will be
	 *   used as the filter's value, and the filter's operator will be "=".
	 * @param {*=} opt_value The filter's value.
	 * @constructor
	 */
  constructor(field, operatorOrValue, opt_value) {
    super();
    this.body_ = new FilterBody(field, operatorOrValue, opt_value);
  }

  /**
	 * Adds a filter to be composed with this filter using the given operator.
	 * @param {string} operator
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} instance or
	 *   the name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @return {Filter} Returns the {@link Filter} object itself, so calls can be
	 *   chained.
	 * @chainable
	 */
  add(operator, fieldOrFilter, opt_operatorOrValue, opt_value) {
    let filter = fieldOrFilter
      ? Filter.toFilter(fieldOrFilter, opt_operatorOrValue, opt_value)
      : null;
    this.body_.add(operator, filter);
    return this;
  }

  /**
	 * Adds filters to be composed with this filter using the given operator.
	 * @param {string} operator
	 * @param {...*} filters A variable amount of filters to be composed.
	 * @return {Filter} Returns the {@link Filter} object itself, so calls can be
	 *   chained.
	 * @chainable
	 */
  addMany(operator, ...filters) {
    this.body_.addMany(operator, ...filters);
    return this;
  }

  /**
	 * Adds a filter to be composed with this filter using the "and" operator.
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} instance or
	 *   the name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @return {Filter} Returns the {@link Filter} object itself, so calls can be
	 *   chained.
	 * @chainable
	 */
  and(fieldOrFilter, opt_operatorOrValue, opt_value) {
    return this.add('and', fieldOrFilter, opt_operatorOrValue, opt_value);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "any" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {Array|*} values A variable amount of values to be used with
	 *   the "any" operator. Can be passed either as a single array or as
	 *   separate params.
	 * @return {!Filter}
	 * @static
	 */
  static any(field, ...values) {
    if (values.length === 1 && Array.isArray(values[0])) {
      values = values[0];
    }
    return new Filter(field, 'any', values);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "gp" operator.
	 * This is a special use case of `Filter.polygon` for bounding
	 * boxes.
	 * @param {string} field The field's name.
	 * @param {*} boxOrUpperLeft Either a `Geo.BoundingBox` instance, or
	 *   a bounding box's upper left coordinate.
	 * @param {*=} opt_lowerRight A bounding box's lower right coordinate.
	 * @return {!Filter}
	 * @static
	 */
  static boundingBox(field, boxOrUpperLeft, opt_lowerRight) {
    if (boxOrUpperLeft instanceof Geo.BoundingBox) {
      return Filter.polygon(field, ...boxOrUpperLeft.getPoints());
    } else {
      return Filter.polygon(field, boxOrUpperLeft, opt_lowerRight);
    }
  }

  /**
	 * Gets the json object that represents this filter.
	 * @return {!Object}
	 */
  body() {
    return this.body_.getObject();
  }

  /**
	 * Returns a {@link Filter} instance that uses the "gd" operator.
	 * @param {string} field The field's name.
	 * @param {*} locationOrCircle Either a `Geo.Circle` instance or a coordinate.
	 * @param {Range|string=} opt_rangeOrDistance Either a `Range` instance or
	 *   the distance value.
	 * @return {!Filter}
	 * @static
	 */
  static distance(field, locationOrCircle, opt_rangeOrDistance) {
    let location = locationOrCircle;
    let range = opt_rangeOrDistance;
    if (locationOrCircle instanceof Geo.Circle) {
      location = locationOrCircle.getCenter();
      range = Range.to(locationOrCircle.getRadius());
    } else if (!(opt_rangeOrDistance instanceof Range)) {
      range = Range.to(opt_rangeOrDistance);
    }
    return Filter.distanceInternal_(field, location, range);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "gd" operator. This
	 * is just an internal helper used by `Filter.distance`.
	 * @param {string} field The field's name.
	 * @param {*} location A location coordinate.
	 * @param {Range} range A `Range` instance.
	 * @return {!Filter}
	 * @protected
	 * @static
	 */
  static distanceInternal_(field, location, range) {
    let value = {
      location: Embodied.toBody(location),
    };
    range = range.body();
    if (range.from) {
      value.min = range.from;
    }
    if (range.to) {
      value.max = range.to;
    }
    return Filter.field(field, 'gd', value);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
	 * @static
	 */
  static equal(field, value) {
    return new Filter(field, '=', value);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "exists" operator.
	 * @param {string} field The field's name.
	 * @return {!Filter}
	 * @static
	 */
  static exists(field) {
    return Filter.field(field, 'exists', null);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "fuzzy" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {string|number=} opt_queryOrFuzziness If this is a string, it should
	 *   be the query, otherwise it should be the fuzziness value.
	 * @param {number=} opt_fuzziness The fuzziness value.
	 * @return {!Filter}
	 * @static
	 */
  static fuzzy(fieldOrQuery, opt_queryOrFuzziness, opt_fuzziness) {
    return Filter.fuzzyInternal_(
      'fuzzy',
      fieldOrQuery,
      opt_queryOrFuzziness,
      opt_fuzziness
    );
  }

  /**
	 * Returns a {@link Filter} instance that uses the given fuzzy operator. This
	 * is an internal implementation used by the `Filter.fuzzy` method.
	 * @param {string} operator The fuzzy operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {string|number=} opt_queryOrFuzziness If this is a string, it should
	 *   be the query, otherwise it should be the fuzziness value.
	 * @param {number=} opt_fuzziness The fuzziness value.
	 * @return {!Filter}
	 * @protected
	 * @static
	 */
  static fuzzyInternal_(
    operator,
    fieldOrQuery,
    opt_queryOrFuzziness,
    opt_fuzziness
  ) {
    let arg2IsString = core.isString(opt_queryOrFuzziness);

    let value = {
      query: arg2IsString ? opt_queryOrFuzziness : fieldOrQuery,
    };
    let fuzziness = arg2IsString ? opt_fuzziness : opt_queryOrFuzziness;
    if (fuzziness) {
      value.fuzziness = fuzziness;
    }

    let field = arg2IsString ? fieldOrQuery : Filter.ALL;
    return Filter.field(field, operator, value);
  }

  /**
	 * Returns a {@link Filter} instance that uses the ">" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
	 * @static
	 */
  static gt(field, value) {
    return new Filter(field, '>', value);
  }

  /**
	 * Returns a {@link Filter} instance that uses the ">=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
	 * @static
	 */
  static gte(field, value) {
    return new Filter(field, '>=', value);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "match" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {string=} opt_query The query string.
	 * @return {!Filter}
	 * @static
	 */
  static match(fieldOrQuery, opt_query) {
    let field = core.isString(opt_query) ? fieldOrQuery : Filter.ALL;
    let query = core.isString(opt_query) ? opt_query : fieldOrQuery;
    return Filter.field(field, 'match', query);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "missing" operator.
	 * @param {string} field The field's name.
	 * @return {!Filter}
	 * @static
	 */
  static missing(field) {
    return Filter.field(field, 'missing', null);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "phrase" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {string=} opt_query The query string.
	 * @return {!Filter}
	 * @static
	 */
  static phrase(fieldOrQuery, opt_query) {
    let field = core.isString(opt_query) ? fieldOrQuery : Filter.ALL;
    let query = core.isString(opt_query) ? opt_query : fieldOrQuery;
    return Filter.field(field, 'phrase', query);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "gp" operator.
	 * @param {string} field The name of the field.
	 * @param {...!Object} points Objects representing points in the polygon.
	 * @return {!Filter}
	 * @static
	 */
  static polygon(field, ...points) {
    points = points.map(point => Embodied.toBody(point));
    return Filter.field(field, 'gp', points);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "prefix" operator.
	 * @param {string} fieldOrQuery If no second argument is given, this should
	 *   be the query string, in which case all fields will be matched. Otherwise,
	 *   this should be the name of the field to match.
	 * @param {string=} opt_query The query string.
	 * @return {!Filter}
	 * @static
	 */
  static prefix(fieldOrQuery, opt_query) {
    let field = core.isDefAndNotNull(opt_query) ? fieldOrQuery : Filter.ALL;
    let query = core.isDefAndNotNull(opt_query) ? opt_query : fieldOrQuery;
    return Filter.field(field, 'prefix', query);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "range" operator.
	 * @param {string} field The field's name.
	 * @param {*} rangeOrMin Either a `Range` instance or a the range's min value.
	 * @param {*=} opt_max The range's max value.
	 * @return {!Filter}
	 * @static
	 */
  static range(field, rangeOrMin, opt_max) {
    let range = rangeOrMin;
    if (!(range instanceof Range)) {
      range = Range.range(rangeOrMin, opt_max);
    }
    return Filter.field(field, 'range', range);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "~" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
	 * @static
	 */
  static regex(field, value) {
    return new Filter(field, '~', value);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "gs" operator.
	 * @param {string} field The field's name.
	 * @param {...!Object} shapes Objects representing shapes.
	 * @return {!Filter}
	 * @static
	 */
  static shape(field, ...shapes) {
    shapes = shapes.map(shape => Embodied.toBody(shape));
    let value = {
      type: 'geometrycollection',
      geometries: shapes,
    };
    return Filter.field(field, 'gs', value);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "similar" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {?string} query The query string.
	 * @return {!Filter}
	 * @static
	 */
  static similar(fieldOrQuery, query) {
    let field = core.isString(query) ? fieldOrQuery : Filter.ALL;
    let value = {
      query: core.isString(query) ? query : fieldOrQuery,
    };
    return Filter.field(field, 'similar', value);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "<" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
	 * @static
	 */
  static lt(field, value) {
    return new Filter(field, '<', value);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "<=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
	 * @static
	 */
  static lte(field, value) {
    return new Filter(field, '<=', value);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "none" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {!(Array|*)} value A variable amount of values to be used with
	 * the "none" operator. Can be passed either as a single array or as
	 * separate params.
	 * @return {!Filter}
	 * @static
	 */
  static none(field, ...values) {
    if (values.length === 1 && Array.isArray(values[0])) {
      values = values[0];
    }
    return new Filter(field, 'none', values);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "!=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
	 * @static
	 */
  static notEqual(field, value) {
    return new Filter(field, '!=', value);
  }

  /**
	 * Returns a {@link Filter} instance that uses the "not" operator.
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} instance or
	 * the name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @return {!Filter}
	 * @static
	 */
  static not(fieldOrFilter, opt_operatorOrValue, opt_value) {
    return Filter.toFilter(fieldOrFilter, opt_operatorOrValue, opt_value).add(
      'not'
    );
  }

  /**
	 * Returns a {@link Filter} instance.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} operatorOrValue If a third param is given, this should be the
	 * filter's operator (like ">="). Otherwise, this will be used as the
	 * filter's value, and the filter's operator will be "=".
	 * @param {*=} opt_value The filter's value.
	 * @return {!Filter}
	 * @static
	 */
  static field(field, operatorOrValue, opt_value) {
    return new Filter(field, operatorOrValue, opt_value);
  }

  /**
	 * Adds a filter to be composed with this filter using the "or" operator.
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} instance or
	 * the name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @return {Filter} Returns the {@link Filter} object itself, so calls can be
	 *   chained.
	 * @chainable
	 */
  or(fieldOrFilter, opt_operatorOrValue, opt_value) {
    return this.add('or', fieldOrFilter, opt_operatorOrValue, opt_value);
  }

  /**
	 * Converts the given arguments into a {@link Filter} instance.
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} instance or
	 * the name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @return {!Filter}
	 */
  static toFilter(fieldOrFilter, opt_operatorOrValue, opt_value) {
    let filter = fieldOrFilter;
    if (!(filter instanceof Filter)) {
      filter = Filter.field(fieldOrFilter, opt_operatorOrValue, opt_value);
    }
    return filter;
  }
}

/**
 * String constant that represents all fields.
 * @type {string}
 * @static
 */
Filter.ALL = '*';

export default Filter;
