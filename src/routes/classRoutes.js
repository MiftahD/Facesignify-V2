const classController = require('../controllers/classController');

module.exports = [
  {
    method: 'POST',
    path: '/classes',
    handler: classController.addClass,
    options: {
      auth: false, // Aktifkan autentikasi JWT jika diperlukan
    },
  },
];
