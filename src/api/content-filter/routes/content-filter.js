module.exports = {
  routes: [
    {
      method: "GET",
      path: "/content-filter",
      handler: "content-filter.index",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
