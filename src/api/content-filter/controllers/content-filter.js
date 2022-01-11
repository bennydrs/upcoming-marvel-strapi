"use strict";

/**
 * A set of functions called "actions" for `content-filter`
 */
const uniteReleaseDate = (dataDate) =>
  `${dataDate.ReleaseDate?.date} ${dataDate.ReleaseDate?.month} ${dataDate.ReleaseDate?.year}`;

module.exports = {
  index: async (ctx, next) => {
    const { category, search } = ctx.query;
    const entries = await strapi.db.query("api::content.content").findMany({
      populate: {
        categories: {
          filters: category && { name: category },
        },
        image: true,
        ReleaseDate: true,
      },
      where: search && {
        title: {
          $contains: search,
        },
      },
    });

    const currentdate = new Date().toISOString().slice(0, 10);
    const dateOffset = 24 * 60 * 60 * 1000 * 1;

    const data = entries
      .filter((data) =>
        data.ReleaseDate && data.ReleaseDate.date
          ? new Date(
              new Date(uniteReleaseDate(data)).toISOString().slice(0, 10)
            ).getTime() +
              dateOffset >=
            new Date(currentdate).getTime()
          : data
      )
      .sort((a, b) => {
        let AtoDateFormat = uniteReleaseDate(a);
        let BtoDateFormat = uniteReleaseDate(b);

        let secondReleaseDate = a?.ReleaseDate?.date
          ? new Date(AtoDateFormat).getTime() / 1000 - Date.now() / 1000
          : 0;
        let secondReleaseDateB = b?.ReleaseDate?.date
          ? new Date(BtoDateFormat).getTime() / 1000 - Date.now() / 1000
          : 0;

        // equal items sort equally
        if (secondReleaseDate === secondReleaseDateB) {
          return 0;
        } else if (!a?.ReleaseDate?.date) {
          return 1;
        } else if (!b?.ReleaseDate?.date) {
          return -1;
        } else {
          return secondReleaseDate < secondReleaseDateB ? -1 : 1;
        }
      });

    ctx.body = data.filter((d) => d.categories.length !== 0);
  },
};
