"use strict";

/**
 * wish-list-item controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::wish-list-item.wish-list-item",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        const user = ctx.state.user;
        const requestBody = ctx.request.body;
        const wish_list = await strapi.db
          .query("api::wish-list.wish-list")
          .findOne({
            where: {
              owner: {
                id: user.id,
              },
            },
          });
        // Check if the wish list is less than 30 or not
        const userWishListCount = await strapi.db
          .query("api::wish-list-item.wish-list-item")
          .count({
            where: {
              wish_list: { id: wish_list.id },
            },
          });
        if (userWishListCount >= 30) {
          // return res.status(400).json({ error: 'Maximum address limit reached' });
          return { data: "Maximum wishlist limit reached" };
        }
        const productId = requestBody?.data?.product?.connect[0]?.id;
        // Check if the product already exists in the wish-list-item
        const existingItem = await strapi.db
          .query("api::wish-list-item.wish-list-item")
          .findOne({
            where: {
              product: {
                id: productId,
              },
            },
          });
        console.log("existingItem: ", existingItem);
        if (existingItem) {
          return ctx.throw(
            400,
            "Product already exists in the wish-list-item."
          );
        }
        const result = await strapi.entityService.create(
          "api::wish-list-item.wish-list-item",
          {
            data: {
              ...ctx.request.body.data,
              wish_list: {
                disconnect: [],
                connect: [
                  {
                    id: wish_list.id,
                    position: {
                      end: true,
                    },
                  },
                ],
              },
            },
          }
        );
        return result;
      } catch (err) {
        ctx.body = err;
      }
    },
    // async update(ctx) {
    //   try {
    //     const user = ctx.state.user;
    //     ctx.request.body.data.owner = user.id;
    //     const { id } = ctx.params;
    //     const cart = await strapi.db.query("api::cart.cart").findOne({
    //       where: {
    //         owner: {
    //           id: user.id,
    //         },
    //       },
    //     });

    //     const experienceData = await strapi.entityService.findMany(
    //       "api::cart-item.cart-item",
    //       {
    //         filters: {
    //           cart: {
    //             id: cart.id,
    //           },
    //           id: id,
    //         },
    //       }
    //     );

    //     if (experienceData.length === 0) {
    //       return {
    //         data: null,
    //         error: {
    //           message: "",
    //         },
    //       };
    //     }

    //     const result = await strapi.entityService.update(
    //       "api::cart-item.cart-item",
    //       id,
    //       {
    //         ...ctx.request.body,
    //       }
    //     );
    //     return result;
    //   } catch (err) {
    //     ctx.body = err;
    //   }
    // },
    // async delete(ctx) {
    //   try {
    //     const user = ctx.state.user;
    //     const { id } = ctx.params;
    //     const cart = await strapi.db.query("api::cart.cart").findOne({
    //       where: {
    //         owner: {
    //           id: user.id,
    //         },
    //       },
    //     });

    //     const experienceData = await strapi.entityService.findMany(
    //       "api::cart-item.cart-item",
    //       {
    //         filters: {
    //           cart: {
    //             id: cart.id,
    //           },
    //           id: id,
    //         },
    //       }
    //     );

    //     if (experienceData.length === 0) {
    //       return {
    //         data: null,
    //         error: {
    //           message: "",
    //         },
    //       };
    //     }

    //     const result = await strapi.entityService.delete(
    //       "api::cart-item.cart-item",
    //       id
    //     );
    //     return result;
    //   } catch (err) {
    //     ctx.body = err;
    //   }
    // },
    // async findOne(ctx) {
    //   try {
    //     const user = ctx.state.user;
    //     const { id } = ctx.params;
    //     const cart = await strapi.db
    //       .query("api::wish-list-item.wish-list-item")
    //       .findOne({
    //         where: {
    //           owner: {
    //             id: user.id,
    //           },
    //         },
    //       });
    //     const experienceData = await strapi.entityService.findMany(
    //       "api::cart-item.cart-item",
    //       {
    //         filters: {
    //           cart: {
    //             id: cart.id,
    //           },
    //           id: id,
    //         },
    //       }
    //     );
    //     if (experienceData.length === 0) {
    //       return {
    //         data: null,
    //         error: {
    //           message: "",
    //         },
    //       };
    //     }
    //     const result = await strapi.db
    //       .query("api::cart-item.cart-item")
    //       .findOne({
    //         where: { id: id },
    //         populate: { product: true },
    //       });
    //     return result;
    //   } catch (err) {
    //     ctx.body = err;
    //   }
    // },
    // async find(ctx) {
    //   try {
    //     const user = ctx.state.user;
    //     const cart = await strapi.db.query("api::cart.cart").findOne({
    //       where: {
    //         owner: {
    //           id: user.id,
    //         },
    //       },
    //     });
    //     const result = await strapi.db
    //       .query("api::cart-item.cart-item")
    //       .findMany({
    //         where: {
    //           cart: {
    //             id: cart.id,
    //           },
    //         },
    //         populate: {
    //           product: true,
    //         },
    //       });
    //     return result;
    //   } catch (err) {
    //     ctx.body = err;
    //   }
    // },
  })
);
