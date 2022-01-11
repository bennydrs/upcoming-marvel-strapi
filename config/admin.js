module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '7f52092f75f37bc0b3d64b802cd8e3ad'),
  },
});
