const {createClass} = require('../services/classesService');
const { InputError } = require('../exceptions/InputError');

const addClass = async (request, h) => {
  const { studentId, teacherUsername, subject, className } = request.payload;

  try {
    if (!studentId || !teacherUsername || !subject || !className) {
      throw new InputError('Missing required fields');
    }

    const result = await createClass(studentId, teacherUsername, subject, className);

    return h.response({
      status: 'success',
      message: 'Class created successfully',
      data: result,
    }).code(201);
  } catch (error) {
    console.error('Error creating class:', error);
    return h.response({
      status: 'fail',
      message: error.message,
    }).code(500);
  }
};

module.exports = { addClass };
