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

import {core} from 'metal';
import BucketOrder from './BucketOrder';
import Embodied from './Embodied';
import Range from './Range';

/**
 * Class that represents a search aggregation.
 */
class Aggregation {
  /**
   * Constructs an {@link Aggregation} instance.
   * @param {string} field The aggregation field
   * @param {string} operator The aggregation operator
   * @param {*=} opt_value Optional aggregation value
   * @param {*=} opt_params Optional aggregation parameters
   * @constructor
   */
  constructor(field, operator, opt_value, opt_params) {
    this.field_ = field;
    this.nestedAggregations_ = null;
    this.operator_ = operator;
    this.params_ = opt_params;
    this.value_ = opt_value;
  }

  /**
   * Adds a new aggregation as nested to the current Aggregation instance.
   * @param {string} name The name of the nested aggregation
   * @param {Aggregation} aggregation The aggregation to be nested in current
   *   aggregation
   * @return {Aggregation} Returns the current {@link Aggregation} instance
   */
  addNestedAggregation(name, aggregation) {
    if (!core.isDefAndNotNull(this.nestedAggregations_)) {
      this.nestedAggregations_ = [];
    }
    this.nestedAggregations_.push({
      name,
      aggregation,
    });

    return this;
  }

  /**
   * Creates an {@link Aggregation} instance with the `avg` operator.
   * @param {string} field The aggregation field
   * @return {!Aggregation} Returns a new instance of {@link Aggregation}
   * @static
   */
  static avg(field) {
    return Aggregation.field(field, 'avg');
  }

  /**
   * Creates an {@link Aggregation} instance with the `cardinality` operator.
   * @param {string} field The aggregation field
   * @return {!Aggregation} Returns a new instance of {@link Aggregation}
   * @static
   */
  static cardinality(field) {
    return Aggregation.field(field, 'cardinality');
  }

  /**
   * Creates an {@link Aggregation} instance with the `count` operator.
   * @param {string} field The aggregation field
   * @return {!Aggregation} Returns a new instance of {@link Aggregation}
   * @static
   */
  static count(field) {
    return Aggregation.field(field, 'count');
  }

  /**
   * Creates an {@link DistanceAggregation} instance with the `geoDistance`
   * operator.
   * @param {string} field The aggregation field
   * @param {*} location The aggregation location
   * @param {...!Range} ranges The aggregation ranges
   * @return {!DistanceAggregation} Returns a new instance of
   *   {@link Aggregation.DistanceAggregation}
   * @static
   */
  static distance(field, location, ...ranges) {
    return new Aggregation.DistanceAggregation(field, location, ...ranges);
  }

  /**
   * Creates an {@link Aggregation} instance with the `extendedStats` operator.
   * @param {string} field The aggregation field
   * @return {!Aggregation} Returns a new instance of {@link Aggregation}
   * @static
   */
  static extendedStats(field) {
    return Aggregation.field(field, 'extendedStats');
  }

  /**
   * Gets current aggregation's field.
   * @return {string} Returns the field by which aggregation should be done
   */
  getField() {
    return this.field_;
  }

  /**
   * Gets nested aggregations in current Aggregation.
   * @return {Array.<Aggregation>} The nested aggregations
   */
  getNestedAggregations() {
    return this.nestedAggregations_;
  }

  /**
   * Gets current aggregation's operator.
   * @return {string} Returns the operator by which aggregation should be done
   */
  getOperator() {
    return this.operator_;
  }

  /**
   * Gets current aggregation's parameters.
   * @return {string} Returns aggregation parameters
   */
  getParams() {
    return this.params_;
  }

  /**
   * Gets current aggregation's value.
   * @return {*} Returns the value by which aggregation should be done
   */
  getValue() {
    return this.value_;
  }

  /**
   * Creates an {@link Aggregation} instance with the `histogram` operator.
   * @param {string} field The aggregation field
   * @param {number|string} interval The histogram's interval. If number is
   *   passed, and `opt_unit` param is not provided, an aggregation of type
   *   'histogram' will be performed. If string is passed, aggregation of type
   *   'date_histogram' will be performed. The supported types of `interval`
   *   param in this case are listed below and the value is assumed to be 1:
   *   - year
   *   - quarter
   *   - month
   *   - week
   *   - day
   *   - hour
   *   - minute
   *   - second
   * @example
   * // Performs `histogram` aggregation with interval of 100
   * Aggregation.histogram('time', 100);
   *
   * // Performs `histogram`  aggregation for 1 year on the field 'time'
   * Aggregation.histogram('time', 'year');
   * @param {string} opt_unit Optional time unit of the histogram aggregation.
   *   Supported values are:
   *   - d
   *   - h
   *   - m
   *   - s
   *   - ms
   *   - micros
   *   - nanos
   * @example
   * // Performs`date_histogram` aggregation for 5 days on the field 'time'
   * Aggregation.histogram('time', 5, 'd');
   * @return {!Aggregation} Returns a new instance of {@link Aggregation}
   * @static
   */
  static histogram(field, interval, opt_unit) {
    let aggregationType = 'histogram';
    let value = interval;

    if (core.isDefAndNotNull(opt_unit)) {
      aggregationType = 'date_histogram';
      value += opt_unit;
    } else if (core.isString(interval)) {
      aggregationType = 'date_histogram';
    }
    return new Aggregation(field, aggregationType, value);
  }

  /**
   * Creates an {@link Aggregation} instance with the `max` operator.
   * @param {string} field The aggregation field
   * @return {!Aggregation} Returns a new instance of {@link Aggregation}
   * @static
   */
  static max(field) {
    return Aggregation.field(field, 'max');
  }

  /**
   * Creates an {@link Aggregation} instance with the `min` operator.
   * @param {string} field The aggregation field
   * @return {!Aggregation} Returns a new instance of {@link Aggregation}
   * @static
   */
  static min(field) {
    return Aggregation.field(field, 'min');
  }

  /**
   * Creates an {@link Aggregation} instance with the `missing` operator.
   * @param {string} field The aggregation field
   * @return {!Aggregation} Returns a new instance of {@link Aggregation}
   * @static
   */
  static missing(field) {
    return Aggregation.field(field, 'missing');
  }

  /**
   * Creates a new {@link Aggregation} instance.
   * @param {string} field The aggregation field
   * @param {string} operator The aggregation operator
   * @return {!Aggregation} Returns a new instance of {@link Aggregation}
   * @static
   */
  static field(field, operator) {
    return new Aggregation(field, operator);
  }

  /**
   * Creates an {@link RangeAggregation} instance with the `range` operator.
   * @param {string} field The aggregation field
   * @param {...!Range} ranges The aggregation ranges
   * @return {!RangeAggregation} Returns a new instance of
   *   {@link Aggregation.RangeAggregation}
   * @static
   */
  static range(field, ...ranges) {
    return new Aggregation.RangeAggregation(field, ...ranges);
  }

  /**
   * Creates an {@link Aggregation} instance with the `script` operator.
   * @param {string|Array<string>} field The aggregation field
   * @param {string} script The aggregation script value
   * @return {!Aggregation} Returns a new instance of {@link Aggregation}
   * @example
   * const cities = new Aggregation('city', 'terms')
   *   .addNestedAggregation(
   *   'avg_fahrenheit',
   *   new Aggregation('temp', 'avg')
   * )
   * .addNestedAggregation(
   *   'max_fahrenheit',
   *   new Aggregation('temp', 'max')
   * )
   * .addNestedAggregation(
   *   'diff_temp',
   *   new Aggregation(
   *     ['max_fahrenheit', 'avg_fahrenheit'],
   *     'script',
   *     '(params.max_fahrenheit - params.avg_fahrenheit)'
   *   )
   * );
   * WeDeploy.data('<data-url>')
   *   .aggregate('cities', cities)
   *   .get('cities')
   *   .then(function(data) {
   *     console.log(data);
   *   })
   *   .catch(function(error) {
   *     console.error(error);
   *   });
   * @static
   */
  static script(field, script) {
    if (Array.isArray(field)) {
      field = field.join(',');
    }
    return new Aggregation(field, 'script', script);
  }

  /**
   * Creates an {@link Aggregation} instance with the `stats` operator.
   * @param {string} field The aggregation field
   * @return {!Aggregation} Returns a new instance of {@link Aggregation}
   * @static
   */
  static stats(field) {
    return Aggregation.field(field, 'stats');
  }

  /**
   * Creates an {@link Aggregation} instance with the `sum` operator.
   * @param {string} field The aggregation field
   * @return {!Aggregation} Returns a new instance of {@link Aggregation}
   * @static
   */
  static sum(field) {
    return Aggregation.field(field, 'sum');
  }

  /**
   * Creates an {@link Aggregation} instance with the `terms` operator.
   * @param {string} field The aggregation field
   * @return {!TermsAggregation} Returns a new instance of
   *   {@link TermsAggregation}
   * @static
   */
  static terms(field) {
    return new TermsAggregation(field);
  }

  /**
   * Sets current aggregation's params.
   * @param {object} params The aggregation params to be set
   * @return {Aggregation} Returns the {@link Aggregation} object itself, so
   *   calls can be chained
   */
  params(params) {
    this.params_ = params;
    return this;
  }
}

/**
 * Class that represents a distance aggregation.
 * @extends {Aggregation}
 */
class DistanceAggregation extends Aggregation {
  /**
   * Constructs an {@link DistanceAggregation} instance.
   * @param {string} field The aggregation field
   * @param {*} location The aggregation location
   * @param {...!Range} ranges The aggregation ranges
   * @constructor
   */
  constructor(field, location, ...ranges) {
    super(field, 'geoDistance', {});
    this.value_.location = Embodied.toBody(location);
    this.value_.ranges = ranges.map(range => range.body());
  }

  /**
   * Adds a range to current aggregation.
   * @param {*} rangeOrFrom Instance of {@link Range} or numeric value, which
   *   represents range `from`
   * @param {*=} opt_to Range `to` param. An optional parameter, which has to be
   *   set if `rangeOrFrom` parameter is a numeric value.
   * @return {Aggregation} Returns the {@link Aggregation} object itself, so
   *   calls can be chained
   */
  range(rangeOrFrom, opt_to) {
    let range = rangeOrFrom;
    if (!(range instanceof Range)) {
      range = Range.range(rangeOrFrom, opt_to);
    }
    this.value_.ranges.push(range.body());
    return this;
  }

  /**
   * Sets current aggregation's unit.
   * @param {string} unit The aggregation unit to be set
   * @return {Aggregation} Returns the {@link Aggregation} object itself, so
   *   calls can be chained
   */
  unit(unit) {
    this.value_.unit = unit;
    return this;
  }
}
Aggregation.DistanceAggregation = DistanceAggregation;

/**
 * Class that represents a range aggregation.
 * @extends {Aggregation}
 */
class RangeAggregation extends Aggregation {
  /**
   * Constructs an {@link RangeAggregation} instance.
   * @param {string} field The aggregation field
   * @param {...!Range} ranges The aggregation ranges
   * @constructor
   */
  constructor(field, ...ranges) {
    super(field, 'range');
    this.value_ = ranges.map(range => range.body());
  }

  /**
   * Adds a range to current aggregation.
   * @param {*} rangeOrFrom Instance of {@link Range} or numeric value, which
   *   represents range `from`
   * @param {*=} opt_to Range `to` param. An optional parameter, which has to be
   *   set if `rangeOrFrom` parameter is a numeric value
   * @return {Aggregation} Returns the {@link Aggregation} object itself, so
   *   calls can be chained
   */
  range(rangeOrFrom, opt_to) {
    let range = rangeOrFrom;
    if (!(range instanceof Range)) {
      range = Range.range(rangeOrFrom, opt_to);
    }
    this.value_.push(range.body());
    return this;
  }
}

Aggregation.RangeAggregation = RangeAggregation;

/**
 * Class that represents a terms aggregation.
 * @extends {Aggregation}
 */
class TermsAggregation extends Aggregation {
  /**
   * Constructs an {@link TermsAggregation} instance.
   * @param {string} field The aggregation field
   * @param {number} size The number of buckets which have to be returned
   * @param {BucketOrder|Array.<BucketOrder>} buckerOrder The order in which
   *   buckets should be returned
   * @constructor
   */
  constructor(field, size, buckerOrder) {
    super(field, 'terms');

    if (core.isDefAndNotNull(size)) {
      this.setSize(size);
    }

    if (core.isDefAndNotNull(buckerOrder)) {
      this.addBucketOrder(buckerOrder);
    }
  }

  /**
   * Adds {@link BucketOrder} instance to the current Aggregation.
   * @param {BucketOrder|Array.<BucketOrder>} bucketOrder The bucket order of
   *   this aggregation
   * @return {TermsAggregation} Returns the current {@link TermsAggregation}
   *   instance
   */
  addBucketOrder(bucketOrder) {
    if (!Array.isArray(bucketOrder)) {
      bucketOrder = [bucketOrder];
    }

    this.params_ = this.params_ || {};
    if (!core.isDefAndNotNull(this.params_.order)) {
      this.params_.order = [];
    }

    bucketOrder.forEach(bucket => {
      this.params_.order.push({
        asc: !!(bucket.getSortOrder() === 'asc'),
        key: bucket.getKey(),
      });
    });

    return this;
  }

  /**
   * Sets the number of buckets which have to be returned.
   * @param {number} size The number of buckets which have to be returned
   */
  setSize(size) {
    this.params_ = this.params_ || {};
    this.params_.size = size;
  }
}

TermsAggregation.BucketOrder = BucketOrder;
Aggregation.TermsAggregation = TermsAggregation;

export default Aggregation;
