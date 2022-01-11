module.exports = {
  routes: [
    {
      method: "GET",
      path: "/category-filter",
      handler: "category-filter.index",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
