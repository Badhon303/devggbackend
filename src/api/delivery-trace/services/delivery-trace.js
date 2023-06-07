'use strict';

/**
 * delivery-trace service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::delivery-trace.delivery-trace');
