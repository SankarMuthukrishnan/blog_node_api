const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Comments = new Schema(
    {
        content: { type: String },
        type: { type: String },
        children_ids: { type: [String] },
        parent_id: { type: String },
        child_list:{type:[Object]}
    },
    { timestamps: true },
)

module.exports = mongoose.model('comments', Comments)