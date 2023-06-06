"use strict";

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  // bootstrap(/*{ strapi }*/) {},
  bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ["plugin::users-permissions.user"],
      async afterCreate(event, ctx) {
        const { result } = event;
        try {
          await strapi.entityService.create("api::cart.cart", {
            data: {
              owner: {
                disconnect: [],
                connect: [{ id: result.id, position: { end: true } }],
              },
            },
          });
          await strapi.entityService.create("api::wish-list.wish-list", {
            data: {
              owner: {
                disconnect: [],
                connect: [{ id: result.id, position: { end: true } }],
              },
            },
          });
        } catch (error) {
          ctx.body = error;
        }

        console.log("register function called");
      },
    });
  },
};
