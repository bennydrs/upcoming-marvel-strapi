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
          select: ["id", "name"],
          filters: category && { name: category },
        },
        image: true,
        ReleaseDate: true,
        videos: {
          select: ["id", "videoId"],
        },
        genres: {
          select: ["id", "name"],
        },
      },
      where: {
        title: search
          ? {
              $contains: search,
            }
          : {
              $notNull: true,
            },
        publishedAt: {
          $notNull: true,
        },
      },
    });

    const currentdate = new Date().toISOString().slice(0, 10);
    const dateOffset = 24 * 60 * 60 * 1000 * 1;

    // filter content yang belum tayang
    const data = entries.filter((item) =>
      item.ReleaseDate && item.ReleaseDate?.date
        ? new Date(
            new Date(uniteReleaseDate(item)).toISOString().slice(0, 10)
          ).getTime() +
            dateOffset >=
          new Date(currentdate).getTime()
        : item
    );

    // sorting berdasarkan tanggal rilis
    const dataSorted = data.sort((a, b) => {
      const AtoDateFormat = uniteReleaseDate(a);
      const BtoDateFormat = uniteReleaseDate(b);

      const secondReleaseDate = a.ReleaseDate?.date
        ? new Date(AtoDateFormat).getTime() / 1000 - Date.now() / 1000
        : 0;
      const secondReleaseDateB = b.ReleaseDate?.date
        ? new Date(BtoDateFormat).getTime() / 1000 - Date.now() / 1000
        : 0;

      // equal items sort equally
      if (secondReleaseDate === secondReleaseDateB) {
        return 0;
      } else if (!a.ReleaseDate?.date) {
        return 1;
      } else if (!b.ReleaseDate?.date) {
        return -1;
      } else {
        return secondReleaseDate < secondReleaseDateB ? -1 : 1;
      }
    });

    ctx.body = dataSorted.filter((d) => d.categories.length !== 0);
  },
};
