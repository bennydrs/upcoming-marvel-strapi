"use strict";

/**
 * A set of functions called "actions" for `content-filter`
 */
const uniteReleaseDate = (dataDate) => {
  const date = dataDate.ReleaseDate?.date;
  const month = dataDate.ReleaseDate?.month;
  const year = dataDate.ReleaseDate?.year;

  return `${!date && year ? "31" : date} ${
    !month && year ? "December" : month
  } ${year}`;
};

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
          select: ["id", "title", "videoId"],
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
    const dateOffset = 24 * 60 * 60 * 1000 * 1; // offset 1 hari

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
      const AtoDateFormat = a.ReleaseDate?.year && uniteReleaseDate(a);
      const BtoDateFormat = b.ReleaseDate?.year && uniteReleaseDate(b);

      // konversi ke time dengan kondisi tertertu
      const secondReleaseDateA = a.ReleaseDate?.date
        ? new Date(AtoDateFormat).getTime()
        : a.ReleaseDate?.year
        ? new Date(`31 December ${a.ReleaseDate?.year}`).getTime()
        : 0;
      const secondReleaseDateB = b.ReleaseDate?.date
        ? new Date(BtoDateFormat).getTime()
        : b.ReleaseDate?.year
        ? new Date(`31 December ${b.ReleaseDate?.year}`).getTime()
        : 0;

      // equal items sort equally
      if (secondReleaseDateA === secondReleaseDateB) {
        return 0;
      } else if (!secondReleaseDateA) {
        return 1;
      } else if (!secondReleaseDateB) {
        return -1;
      } else {
        return secondReleaseDateA < secondReleaseDateB ? -1 : 1;
      }
    });

    ctx.body = dataSorted.filter((d) => d.categories.length !== 0);
  },
};
