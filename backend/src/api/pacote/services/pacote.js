'use strict';

/**
 * pacote service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::pacote.pacote');
