"use strict";

/**
 * address controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::address.address", ({ strapi }) => ({
  async create(ctx) {
    try {
      const user = ctx.state.user;
      // ctx.request.body.data.owner = user.id;
      const userAddressCount = await strapi.db
        .query("api::address.address")
        .count({
          where: {
            owner: { id: user.id },
          },
        });
      if (userAddressCount >= 3) {
        // return res.status(400).json({ error: 'Maximum address limit reached' });
        return { data: "Maximum address limit reached" };
      }
      const result = await strapi.entityService.create("api::address.address", {
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

      const experienceData = await strapi.entityService.findMany(
        "api::address.address",
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

      const result = await strapi.entityService.update(
        "api::address.address",
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

      const experienceData = await strapi.entityService.findMany(
        "api::address.address",
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

      const result = await strapi.entityService.delete(
        "api::address.address",
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

      const experienceData = await strapi.entityService.findMany(
        "api::address.address",
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

      const result = await strapi.entityService.findOne(
        "api::address.address",
        id
      );
      return result;
    } catch (err) {
      ctx.body = err;
    }
  },
  async find(ctx) {
    try {
      const user = ctx.state.user;
      const result = await strapi.entityService.findMany(
        "api::address.address",
        {
          filters: {
            owner: {
              id: user.id,
            },
          },
        }
      );
      return result;
    } catch (err) {
      ctx.body = err;
    }
  },
}));
