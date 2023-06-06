"use strict";

/**
 * cart-item controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::cart-item.cart-item",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        const user = ctx.state.user;
        // ctx.request.body.data.owner = user.id;
        const cart = await strapi.db.query("api::cart.cart").findOne({
          where: {
            owner: {
              id: user.id,
            },
          },
        });
        const result = await strapi.entityService.create(
          "api::cart-item.cart-item",
          {
            data: {
              ...ctx.request.body.data,
              cart: {
                disconnect: [],
                connect: [
                  {
                    id: cart.id,
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
    async update(ctx) {
      try {
        const user = ctx.state.user;
        ctx.request.body.data.owner = user.id;
        const { id } = ctx.params;
        const cart = await strapi.db.query("api::cart.cart").findOne({
          where: {
            owner: {
              id: user.id,
            },
          },
        });

        const experienceData = await strapi.entityService.findMany(
          "api::cart-item.cart-item",
          {
            filters: {
              cart: {
                id: cart.id,
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

        const result = await strapi.entityService.update(
          "api::cart-item.cart-item",
          id,
          {
            ...ctx.request.body,
          }
        );
        return result;
      } catch (err) {
        ctx.body = err;
      }
    },
    async delete(ctx) {
      try {
        const user = ctx.state.user;
        const { id } = ctx.params;
        const cart = await strapi.db.query("api::cart.cart").findOne({
          where: {
            owner: {
              id: user.id,
            },
          },
        });

        const experienceData = await strapi.entityService.findMany(
          "api::cart-item.cart-item",
          {
            filters: {
              cart: {
                id: cart.id,
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

        const result = await strapi.entityService.delete(
          "api::cart-item.cart-item",
          id
        );
        return result;
      } catch (err) {
        ctx.body = err;
      }
    },
    async findOne(ctx) {
      try {
        const user = ctx.state.user;
        const { id } = ctx.params;
        const cart = await strapi.db.query("api::cart.cart").findOne({
          where: {
            owner: {
              id: user.id,
            },
          },
        });
        const experienceData = await strapi.entityService.findMany(
          "api::cart-item.cart-item",
          {
            filters: {
              cart: {
                id: cart.id,
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
        const result = await strapi.db
          .query("api::cart-item.cart-item")
          .findOne({
            where: { id: id },
            populate: { product: true },
          });
        return result;
      } catch (err) {
        ctx.body = err;
      }
    },
    async find(ctx) {
      try {
        const user = ctx.state.user;
        const cart = await strapi.db.query("api::cart.cart").findOne({
          where: {
            owner: {
              id: user.id,
            },
          },
        });
        const result = await strapi.db
          .query("api::cart-item.cart-item")
          .findMany({
            where: {
              cart: {
                id: cart.id,
              },
            },
            populate: {
              product: true,
            },
          });
        return result;
      } catch (err) {
        ctx.body = err;
      }
    },
  })
);
