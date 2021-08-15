const Comment = require('../models/comments-model');

createComments = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a comments',
        })
    }

    var comments = new Comment();
    comments.content = body.content;
    comments.type = 'comments';

    if (body.parent_id) {
        comments.parent_id = body.parent_id;
        comments.type = 'reply';

        Comment.findOne({ _id: body.parent_id }, (err, upComments) => {
            if (!err) {
                upComments.children_ids = [...upComments.children_ids, comments._id]
            }

            upComments.save();

        })

    }

    if (!comments) {
        return res.status(400).json({ success: false, error: err })
    }

    comments
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: comments._id,
                message: 'Comments created!',
                data: comments,
                status: 200
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Comments not created!',
            })
        })
}

updateComments = async (req, res) => {
    const body = req.body

    console.log(req.params.id);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Comment.findOne({ _id: req.params.id }, (err, comments) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'comments not found!',
            })
        }
        if (body.content) {
            comments.content = body.content
        }

        if (body.children_ids) {
            comments.children_ids = body.children_ids
        }

        if (body.parent_id) {
            comments.parent_id = body.parent_id
        }


        comments
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: comment._id,
                    message: 'Comments updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Comments not updated!',
                })
            })
    })
}

deleteComments = async (req, res) => {
    await Comment.findOneAndDelete({ _id: req.params.id }, (err, comment) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!comment) {
            return res
                .status(404)
                .json({ success: false, error: `Comments not found` })
        }

        return res.status(200).json({ success: true, data: comment })
    }).catch(err => console.log(err))
}

getCommentsById = async (req, res) => {
    await Comment.findOne({ _id: req.params.id }, (err, comment) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true, data: comment })
    }).catch(err => console.log(err))
}

getComments = async (req, res) => {
    let comment_res = [];
    let allComments = await Comment.find({ 'type': 'reply' });
    await Comment.find({ type: 'comments' }, null, { sort: { createdAt: 'desc' } }, (err, comment) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!comment.length) {
            return res
                .status(404)
                .json({ success: false, error: `Comments not found` })
        }
        if (comment.length > 0) {
            comment.map((comnt, cmntIndx) => {
                comment_res.push(comnt);
            });
        }
    }).catch(err => console.log(err));

    let comment_loop = (id) => {
        let list = [];
        allComments.find((allC, allCindX) => {
            if (allC.parent_id == id) {
                if (allC['children_ids'] && allC['children_ids'].length > 0) {
                    allC['child_list'] = comment_loop(allC._id);
                }
                list.push(allC);
            }
        });
        return list;
    }

    if (comment_res.length > 0) {
        await comment_res.map((comnt, cmntIndx) => {
            let comnt_child = comnt['children_ids'];
            if (comnt_child && comnt_child.length > 0) {
                comment_res[cmntIndx]['child_list'] = comment_loop(comnt._id);
            }
        });
    }
    return res.status(200).json({ success: true, data: { status: 200, results: comment_res } });
}

module.exports = {
    createComments,
    updateComments,
    deleteComments,
    getCommentsById,
    getComments
}