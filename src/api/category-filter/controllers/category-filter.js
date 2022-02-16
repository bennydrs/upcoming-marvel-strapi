"use strict";

/**
 * A set of functions called "actions" for `category-filter`
 */

module.exports = {
  index: async (ctx, next) => {
    try {
      const entries = await strapi.db.query("api::category.category").findMany({
        populate: {
          contents: {
            select: ["title"],
          },
        },
      });
      const numCategories = [];
      const strCategories = [];

      entries.forEach((d) => {
        if (isNaN(d.name)) {
          strCategories.push(d);
        } else if (d.name >= new Date().getFullYear()) {
          numCategories.push(d);
        }
      });

      const categories = strCategories.concat(
        numCategories.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        )
      );
      const data = categories.filter((c) => c.contents.length !== 0);
      ctx.body = data.map((d) => ({
        id: d.id,
        name: d.name,
      }));
    } catch (err) {
      ctx.body = err;
    }
  },
};
