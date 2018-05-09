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
import Filter from './Filter';
import Aggregation from './Aggregation';

/**
 * Class responsible for building queries.
 * @extends {Embodied}
 */
class Query extends Embodied {
  /**
	 * Adds an aggregation to this {@link Query} instance.
	 * @param {string} name The aggregation name.
	 * @param {!Aggregation|string} aggregationOrField Either an
	 *   {@link Aggregation} instance or the name of the aggregation field.
	 * @param {string=} opt_operator The aggregation operator.
	 * @return {!Query}
	 * @static
	 */
  static aggregate(name, aggregationOrField, opt_operator) {
    return new Query().aggregate(name, aggregationOrField, opt_operator);
  }

  /**
	 * Sets this query's type to "count".
	 * @return {!Query}
	 * @static
	 */
  static count() {
    return new Query().type('count');
  }

  /**
	 * Sets this query's type to "fetch".
	 * @return {!Query}
	 * @static
	 */
  static fetch() {
    return new Query().type('fetch');
  }

  /**
	 * Adds a filter to this Query.
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} or the
	 *   name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @return {!Query}
	 * @static
	 */
  static filter(fieldOrFilter, opt_operatorOrValue, opt_value) {
    return new Query().filter(fieldOrFilter, opt_operatorOrValue, opt_value);
  }

  /**
	 * Sets the query offset.
	 * @param {number} offset The index of the first entry that should be returned
	 *   by this query.
	 * @return {!Query}
	 * @static
	 */
  static offset(offset) {
    return new Query().offset(offset);
  }

  /**
	 * Adds a highlight entry to this {@link Query} instance.
	 * @param {string} field The field's name.
	 * @return {!Query}
	 * @static
	 */
  static highlight(field) {
    return new Query().highlight(field);
  }

  /**
	 * Sets the query limit.
	 * @param {number} limit The max amount of entries that this query should
	 *   return.
	 * @return {!Query}
	 * @static
	 */
  static limit(limit) {
    return new Query().limit(limit);
  }

  /**
	 * Adds a search to this {@link Query} instance.
	 * @param {!Filter|string} filterOrTextOrField If no other arguments
	 *   are passed to this function, this should be either a {@link Filter}
	 *   instance or a text to be used in a match filter. In both cases
	 *   the filter will be applied to all fields. Another option is to
	 *   pass this as a field name instead, together with other arguments
	 *   so the filter can be created.
	 * @param {string=} opt_textOrOperator Either a text to be used in a
	 *   match filter, or the operator that should be used.
	 * @param {*=} opt_value The value to be used by the filter. Should
	 *   only be passed if an operator was passed as the second argument.
	 * @return {!Query}
	 * @static
	 */
  static search(filterOrTextOrField, opt_textOrOperator, opt_value) {
    return new Query().search(
      filterOrTextOrField,
      opt_textOrOperator,
      opt_value
    );
  }

  /**
	 * Adds a sort entry to this query, specifying the field this query should be
	 * sorted by and, optionally, the sort direction.
	 * @param {string} field The field that the query should be sorted by.
	 * @param {string=} opt_direction The direction the sort operation should use.
	 *   If none is given, "asc" is used by default.
	 * @return {!Query}
	 * @static
	 */
  static sort(field, opt_direction) {
    return new Query().sort(field, opt_direction);
  }

  /**
	 * Sets the query type.
	 * @param {string} type The query's type. For example: "count", "fetch".
	 * @return {!Query}
	 * @static
	 */
  static type(type) {
    return new Query().type(type);
  }

  /**
	 * Adds an aggregation to this {@link Query} instance.
	 * @param {string} name The aggregation name.
	 * @param {!Aggregation|string} aggregationOrField Either an
	 *   {@link Aggregation} instance or the name of the aggregation field.
	 * @param {string=} opt_operator The aggregation operator.
	 * @return {Query} Returns the {@link Query} object itself, so calls can be
	 *   chained.
	 * @chainnable
	 */
  aggregate(name, aggregationOrField, opt_operator) {
    let aggregation = aggregationOrField;
    if (!(aggregation instanceof Aggregation)) {
      aggregation = Aggregation.field(aggregationOrField, opt_operator);
    }

    let field = aggregation.getField();
    let value = {};
    value[field] = {
      name: name,
      operator: aggregation.getOperator(),
    };
    if (core.isDefAndNotNull(aggregation.getValue())) {
      value[field].value = aggregation.getValue();
    }

    if (!this.body_.aggregation) {
      this.body_.aggregation = [];
    }
    this.body_.aggregation.push(value);
    return this;
  }

  /**
	 * Sets this query's type to "count".
	 * @return {Query} Returns the {@link Query} object itself, so calls can be
	 *   chained.
	 * @chainnable
	 */
  count() {
    return this.type('count');
  }

  /**
	 * Sets this query's type to "fetch".
	 * @return {Query} Returns the {@link Query} object itself, so calls can be
	 *   chained.
	 * @chainnable
	 */
  fetch() {
    return this.type('fetch');
  }

  /**
	 * Adds a filter to this Query.
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} or the
	 *   name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @return {Query} Returns the {@link Query} object itself, so calls can be
	 *   chained.
	 * @chainnable
	 */
  filter(fieldOrFilter, opt_operatorOrValue, opt_value) {
    let filter = Filter.toFilter(fieldOrFilter, opt_operatorOrValue, opt_value);
    if (!this.body_.filter) {
      this.body_.filter = [];
    }
    this.body_.filter.push(filter.body());
    return this;
  }

  /**
	 * Sets the query offset.
	 * @param {number} offset The index of the first entry that should be returned
	 *   by this query.
	 * @return {Query} Returns the {@link Query} object itself, so calls can be
	 *   chained.
	 * @chainnable
	 */
  offset(offset) {
    this.body_.offset = offset;
    return this;
  }

  /**
	 * Adds a highlight entry to this {@link Query} instance.
	 * @param {string} field The field's name.
	 * @return {Query} Returns the {@link Query} object itself, so calls can be
	 *   chained.
	 * @chainnable
	 */
  highlight(field) {
    if (!this.body_.highlight) {
      this.body_.highlight = [];
    }

    this.body_.highlight.push(field);
    return this;
  }

  /**
	 * Sets the query limit.
	 * @param {number} limit The max amount of entries that this query should
	 *   return.
	 * @return {Query} Returns the {@link Query} object itself, so calls can be
	 *   chained.
	 * @chainnable
	 */
  limit(limit) {
    this.body_.limit = limit;
    return this;
  }

  /**
	 * Adds a search to this {@link Query} instance.
	 * @param {!Filter|string=} filterOrTextOrField If no other arguments
	 *   are passed to this function, this should be either a {@link Filter}
	 *   instance or a text to be used in a match filter. In both cases
	 *   the filter will be applied to all fields. Another option is to
	 *   pass this as a field name instead, together with other arguments
	 *   so the filter can be created. If the value of this parameter is
	 *   undefined or null, no filter will be provided to the search query.
	 * @param {string=} opt_textOrOperator Either a text to be used in a
	 *   match filter, or the operator that should be used.
	 * @param {*=} opt_value The value to be used by the filter. Should
	 *   only be passed if an operator was passed as the second argument.
	 * @return {Query} Returns the {@link Query} object itself, so calls can be
	 *   chained.
	 * @chainnable
	 */
  search(filterOrTextOrField, opt_textOrOperator, opt_value) {
    let filter = filterOrTextOrField;

    if (opt_value) {
      filter = Filter.field(filterOrTextOrField, opt_textOrOperator, opt_value);
    } else if (opt_textOrOperator) {
      filter = Filter.match(filterOrTextOrField, opt_textOrOperator);
    } else if (filter && !(filter instanceof Filter)) {
      filter = Filter.match(filterOrTextOrField);
    }

    this.type('search');

    if (filter) {
      this.filter(filter);
    }

    return this;
  }

  /**
	 * Adds a sort entry to this query, specifying the field this query should be
	 * sorted by and, optionally, the sort direction.
	 * @param {string} field The field that the query should be sorted by.
	 * @param {string=} opt_direction The direction the sort operation should use.
	 *   If none is given, "asc" is used by default.
	 * @return {Query} Returns the {@link Query} object itself, so calls can be
	 *   chained.
	 * @chainnable
	 */
  sort(field, opt_direction) {
    if (!this.body_.sort) {
      this.body_.sort = [];
    }
    let sortEntry = {};
    sortEntry[field] = opt_direction || 'asc';
    this.body_.sort.push(sortEntry);
    return this;
  }

  /**
	 * Sets the query type.
	 * @param {string} type The query's type. For example: "count", "fetch".
	 * @return {Query} Returns the {@link Query} object itself, so calls can be
	 *   chained.
	 * @chainnable
	 */
  type(type) {
    this.body_.type = type;
    return this;
  }
}

export default Query;
