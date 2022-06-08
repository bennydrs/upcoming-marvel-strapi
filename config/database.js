module.exports = ({ env }) => {
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
  // postgres://krhxzmcq:d9ER95GYvPNGkIzQEJ0rEBHn1nBE2ElN@rosie.db.elephantsql.com/krhxzmcq
  // postgres://vrqjohhmvvkmex:0bb4da251706bbaebc1c2f8e58e2fd2484ba583a097ce6e5203c8c3dc2897764@ec2-34-205-209-14.compute-1.amazonaws.com:5432/d9ejcpb8r6gm1p
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
