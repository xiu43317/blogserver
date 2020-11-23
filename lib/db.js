var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Blog = new Schema({
    id: Number,
    Username:String,
    Article:String,
    CreateDate:Date
});

var Comment = new Schema({
    id: Number,
    Vistor:String,
    Comment:String,
    MessageID:Number,
    CreateDate:Date
});

var Admin = new Schema({
    Username:String,
    Password:String
})

mongoose.model('Blog',Blog);
mongoose.model('Comment',Comment);
mongoose.model('Admin',Admin);
mongoose.connect('mongodb://localhost/newblog',{ useNewUrlParser: true,useUnifiedTopology: true });