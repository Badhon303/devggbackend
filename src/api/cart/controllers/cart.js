"use strict";

/**
 * cart controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::cart.cart");
// , ({ strapi }) => ({
//   async find(ctx) {
//     try {
//       const user = ctx.state.user;
//       const result = await strapi.db.query("api::cart.cart").findMany({
//         where: {
//           owner: {
//             id: user.id,
//           },
//         },
//         populate: {
//           cart_items: true,
//         },
//       });
//       return result;
//     } catch (err) {
//       ctx.body = err;
//     }
//   },
// }));
