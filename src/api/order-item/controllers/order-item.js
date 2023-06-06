"use strict";

/**
 * order-item controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order-item.order-item");
//   ,
//   ({ strapi }) => ({
//     async findOne(ctx) {
//       try {
//         const user = ctx.state.user;
//         const { id } = ctx.params;
//         // if orderId belongs to user
//         // const order = await strapi.db.query("api::order.order").findOne({
//         //   where: {
//         //     owner: {
//         //       id: user.id,
//         //     },
//         //   },
//         // });
//         const experienceData = await strapi.entityService.findMany(
//           "api::order-item.order-item",
//           {
//             filters: {
//               cart: {
//                 id: order.id,
//               },
//               id: id,
//             },
//           }
//         );
//         if (experienceData.length === 0) {
//           return {
//             data: null,
//             error: {
//               message: "",
//             },
//           };
//         }
//         const result = await strapi.db
//           .query("api::cart-item.cart-item")
//           .findOne({
//             where: { id: id },
//             populate: { product: true },
//           });
//         return result;
//       } catch (err) {
//         ctx.body = err;
//       }
//     },
//     async find(ctx) {
//       try {
//         const user = ctx.state.user;
//         // if orderId belongs to user
//         // const cart = await strapi.db.query("api::cart.cart").findOne({
//         //   where: {
//         //     owner: {
//         //       id: user.id,
//         //     },
//         //   },
//         // });
//         const result = await strapi.db
//           .query("api::cart-item.cart-item")
//           .findMany({
//             where: {
//               cart: {
//                 id: cart.id,
//               },
//             },
//             populate: {
//               product: true,
//             },
//           });
//         return result;
//       } catch (err) {
//         ctx.body = err;
//       }
//     },
//   })
// );
