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

exports.getPosts = (request, response) => {
  var offSet = request.params.offSet
  var limit = Number(request.params.limit)
  db.collection('post').orderBy('createdAt', 'desc').startAfter(offSet).limit(limit).get()
    .then((data) => {
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
    userImage: request.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  }

  db.collection('post').add(newPost).then((doc) => {
    newPost.postId = doc.id
    response.json(newPost)
  }).catch((err) => {
    response.status(500).json({ error: 'something went wrong' })
    console.log(err)
  })
}

exports.getPost = (req, res) => {
  let PostData = {}
  db.doc(`/post/${req.params.postId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Post not found' })
      }
      PostData = doc.data()
      PostData.postId = doc.id
      return db.collection('comments')
        .where('postId', '==', req.params.postId)
        .orderBy('createdAt', 'desc')
        .get()
    })
    .then((data) => {
      PostData.comments = []
      data.forEach((doc) => {
        PostData.comments.push(doc.data())
      })
      return res.json(PostData)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.commentOnPost = (req, res) => {
  if (req.body.body.trim() === '') return res.status(400).json({ comment: 'Must not be empty' })

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    postId: req.params.postId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  }
  db.doc(`/post/${req.params.postId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'post not found' })
      }
      const post = doc.data()
      post.postId = req.params.postId
      post.commentCount += 1
      doc.ref.update({ commentCount: doc.data().commentCount + 1 })
      return post
    })
    .then((post) => {
      db.collection('comments').add(newComment)
      return { post: post, comment: newComment }
    })
    .then((obj) => {
      res.json(obj)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: 'Something went wrong' })
    })
}

exports.likePost = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('postId', '==', req.params.postId)
    .limit(1)

  const postDocument = db.doc(`/post/${req.params.postId}`)

  let postData

  postDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        postData = doc.data()
        postData.postId = doc.id
        return likeDocument.get()
      } else {
        return res.status(404).json({ error: 'Post not found' })
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection('likes')
          .add({
            postId: req.params.postId,
            userHandle: req.user.handle
          })
          .then(() => {
            postData.likeCount++
            return postDocument.update({ likeCount: postData.likeCount })
          })
          .then(() => {
            return res.json(postData)
          })
      } else {
        return res.status(400).json({ error: 'Post already liked' })
      }
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.unlikePost = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('postId', '==', req.params.postId)
    .limit(1)

  const postDocument = db.doc(`/post/${req.params.postId}`)

  let postData

  postDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        postData = doc.data()
        postData.postId = doc.id
        return likeDocument.get()
      } else {
        return res.status(404).json({ error: 'Post not found' })
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: 'Post not liked' })
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            postData.likeCount--
            return postDocument.update({ likeCount: postData.likeCount })
          })
          .then(() => {
            res.json(postData)
          })
      }
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.deletePost = (req, res) => {
  const document = db.doc(`/post/${req.params.postId}`)
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Post not found' })
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Unauthorized' })
      } else {
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Post deleted successfully' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}
