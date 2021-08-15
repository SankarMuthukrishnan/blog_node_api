const express = require('express')

const CommentsCtrl = require('../controllers/comments-ctrl')

const router = express.Router()

router.post('/comments', CommentsCtrl.createComments)
router.put('/comments/:id', CommentsCtrl.updateComments)
router.delete('/comments/:id', CommentsCtrl.deleteComments)
router.get('/comments/:id', CommentsCtrl.getCommentsById)
router.get('/comments', CommentsCtrl.getComments)

module.exports = router