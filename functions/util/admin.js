const admin = require('firebase-admin')
const serviceAccount = require('../socialsite-64b08-firebase-adminsdk-emxvv-417e5f2a43.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://socialsite-64b08.firebaseio.com',
  storageBucket: 'gs://socialsite-64b08.appspot.com'
})
const db = admin.firestore()

module.exports = {
  admin,
  db
}
