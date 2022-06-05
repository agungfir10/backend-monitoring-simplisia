const Hapi = require('@hapi/hapi');
const { Timestamp } = require('firebase-admin/firestore');
const db = require('./firebase');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
  });

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: async (request, h) => {
        // Returns a random integer from 0 to 9:
        try {
          const timestamp = Timestamp.fromDate(new Date());
          const { type = 'Tidak Ada', temp = 0, humidity = 0 } = request.query;

          const docRef = await db.collection('results').add({
            type: 'Akar',
            temp,
            humidity,
            createdAt: timestamp,
          });
          return {
            status: 'success',
            message: 'success add datas',
          };
        } catch (error) {
          return {
            status: 'fail',
            message: 'fail add data',
          };
        }
      },
    },
    {
      method: 'GET',
      path: '/hello',
      handler: async (request, h) => {
        return 'world';
      },
    },
  ]);
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
