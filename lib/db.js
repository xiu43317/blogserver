var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Blog = new Schema({
    Username:String,
    Article:String,
    CreateDate:Date
});

var Comment = new Schema({
    Vistor:String,
    Comment:String,
    MessageID:Schema.Types.ObjectId,
    CreateDate:Date
});

var Admin = new Schema({
    Username:String,
    Password:String
})

mongoose.model('Blog',Blog);
mongoose.model('Comment',Comment);
mongoose.model('Admin',Admin);
mongoose.connect('mongodb://localhost/blog',{ useNewUrlParser: true,useUnifiedTopology: true });