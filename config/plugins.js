module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  redis: {
    config: {
      connections: {
        default: {
          connection: {
            host: env("REDIS_HOST", "127.0.0.1"),
            port: env("REDIS_PORT", 6379),
            name: env("REDIS_NAME"),
            password: env("REDIS_PASSWORD"),
            db: 0,
          },
          settings: {
            debug: false,
          },
        },
      },
    },
  },
  // Configure the redis cache plugin
  "rest-cache": {
    config: {
      provider: {
        name: "redis",
        options: {
          max: 32767,
          connection: "default",
        },
      },
      strategy: {
        contentTypes: [
          // list of Content-Types UID to cache
          "api::category.category",
          "api::content.content",
          "api::genre.genre",
        ],
      },
    },
  },
});
