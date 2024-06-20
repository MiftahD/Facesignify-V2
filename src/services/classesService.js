const { db, admin } = require('../config/firebaseConfig');
const { v4: uuidv4 } = require('uuid');
const InputError = require('../exceptions/InputError');
const {predict} = require ('./faceRecognitionService');

const createClass = async (studentId, teacherUsername, subject,className, prediction, publicUrl) => {
  try {
    // Ambil data student dari collection users
    const studentPromises = studentId.map(async (studentId) => {
      const studentRef = db.collection('users').doc(studentId);
      const studentDoc = await studentRef.get();
      if (!studentDoc.exists) {
        throw new InputError(`Student dengan ID ${studentId} tidak ditemukan`);
      }
      const studentData = studentDoc.data();
      return { username: studentData.username, email: studentData.email };
    });

    const students = await Promise.all(studentPromises);

    // Ambil data teacher dari collection admins
    const teacherRef = db.collection('admins').doc(teacherUsername);
    const teacherDoc = await teacherRef.get();
    if (!teacherDoc.exists) {
      throw new InputError('Teacher with the specified username does not exist');
    }

    // Buat classCode secara otomatis menggunakan uuid
    const classCode = uuidv4();

    // Simpan kelas ke Firestore
    const classData = {
      students,
      teacherUsername,
      subject,
      classCode,
      className,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('classes').doc(classCode).set(classData);

    return { classCode };
  } catch (error) {
    console.error('Error creating class:', error);
    throw new Error('Failed to create class: ' + error.message);
  }
};

module.exports = { createClass };
