import mongoose from 'mongoose'; // Ensure mongoose is imported

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: true,
    },
    categories: {
        type: Array,
        required: false,
    },
    createdDate: {
        type: Date,
    },
});

const post = mongoose.model('post', PostSchema);

export default post;
