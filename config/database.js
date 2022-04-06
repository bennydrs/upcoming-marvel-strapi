const parse = require("pg-connection-string").parse;

module.exports = ({ env }) => {
  if (env("NODE_ENV") === "production") {
    const config = parse(process.env.DATABASE_URL);
    return {
      connection: {
        client: "postgres",
        connection: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          ssl: {
            rejectUnauthorized: env.bool("DATABASE_SSL_SELF", false), // For self-signed certificates
          },
        },
        debug: false,
      },
    };
  }
  return {
    connection: {
      client: "postgres",
      connection: {
        host: "localhost",
        port: 5432,
        database: "upcomingmarvel",
        user: "postgres",
        password: "postgres",
      },
      debug: false,
    },
  };
  // return {
  //   connection: {
  //     client: "sqlite",
  //     connection: {
  //       filename: path.join(
  //         __dirname,
  //         "..",
  //         env("DATABASE_FILENAME", ".tmp/data.db")
  //       ),
  //     },
  //     useNullAsDefault: true,
  //   },
  // };
};
