"use strict";

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async buyNow(ctx) {
    try {
      const user = ctx.state.user;
      // Create a new order
      const order = await strapi.entityService.create("api::order.order", {
        data: {
          ...ctx.request.body.data.order,
          owner: {
            disconnect: [],
            connect: [
              {
                id: user.id,
                position: {
                  end: true,
                },
              },
            ],
          },
        },
      });
      //Create order Items
      await strapi.entityService.create("api::order-item.order-item", {
        data: {
          ...ctx.request.body.data.orderItems,
          order: {
            disconnect: [],
            connect: [
              {
                id: order.id,
                position: {
                  end: true,
                },
              },
            ],
          },
        },
      });
      return order;
    } catch (err) {
      ctx.body = err;
    }
  },
  async create(ctx) {
    try {
      const user = ctx.state.user;
      // Get the current cart
      const cart = await strapi.db.query("api::cart.cart").findOne({
        where: {
          owner: {
            id: user.id,
          },
        },
        populate: ["cart_items.product", "cart_items.quantity"],
      });

      // Check if cartItems is empty
      if (!cart.cart_items || cart.cart_items.length === 0) {
        return ctx.throw(400, "Please add items to the cart first");
      }
      // Create a new order
      const order = await strapi.entityService.create("api::order.order", {
        data: {
          ...ctx.request.body.data,
          owner: {
            disconnect: [],
            connect: [
              {
                id: user.id,
                position: {
                  end: true,
                },
              },
            ],
          },
        },
      });
      // Copy cart items to order items
      for (const cartItem of cart.cart_items) {
        await strapi.entityService.create("api::order-item.order-item", {
          data: {
            product: {
              disconnect: [],
              connect: [
                {
                  id: cartItem.product.id,
                  position: {
                    end: true,
                  },
                },
              ],
            },
            order: {
              disconnect: [],
              connect: [
                {
                  id: order.id,
                  position: {
                    end: true,
                  },
                },
              ],
            },
            quantity: cartItem.quantity,
          },
        });
      }
      // Remove cart items
      for (const cartItem of cart.cart_items) {
        await strapi.entityService.delete(
          "api::cart-item.cart-item",
          cartItem.id
        );
      }
      return order;
    } catch (err) {
      ctx.body = err;
    }
  },
  async find(ctx) {
    try {
      const user = ctx.state.user;
      const result = await strapi.db.query("api::order.order").findMany({
        where: {
          owner: {
            id: user.id,
          },
        },
        populate: ["order_items.product"],
        // {
        //   order_items: true,
        // },
      });
      return result;
    } catch (err) {
      ctx.body = err;
    }
  },
  async findOne(ctx) {
    try {
      const user = ctx.state.user;
      const { id } = ctx.params;

      const experienceData = await strapi.entityService.findMany(
        "api::order.order",
        {
          filters: {
            owner: {
              id: user.id,
            },
            id: id,
          },
        }
      );

      if (experienceData.length === 0) {
        return {
          data: null,
          error: {
            message: "",
          },
        };
      }

      const result = await strapi.entityService.findOne("api::order.order", id);
      return result;
    } catch (err) {
      ctx.body = err;
    }
  },
}));
