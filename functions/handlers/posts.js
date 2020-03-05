const { db } = require('../util/admin')

exports.getAllPosts = (request, response) => {
  db.collection('post').orderBy('createdAt', 'desc').get().then((data) => {
    const posts = []
    data.forEach((doc) => {
      posts.push({ postId: doc.id, ...doc.data() })
    })
    return response.status(200).json(posts)
  })
    .catch((err) => console.log(err))
}

exports.postOnePost = (request, response) => {
  const newPost = {
    body: request.body.body,
    userHandle: request.user.handle,
    createdAt: new Date().toISOString()
  }

  db.collection('post').add(newPost).then((doc) => {
    response.json({ message: `document ${doc.id} created succeddfully` })
  }).catch((err) => {
    response.status(500).json({ error: 'something went wrong' })
    console.log(err)
  })
}
