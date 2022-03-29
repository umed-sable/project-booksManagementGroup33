const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

//var multer = require('multer');
//var upload = multer();

//app.use(upload.array()); 
//app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//app.post("/api/uploadFile", upload.single("myFile"), (req, res) => {
    // Stuff to be added later
    //console.log(req.file);
  //});


mongoose.connect("mongodb+srv://sumandev:aBosU15RXTGZYkKq@cluster0.4du2i.mongodb.net/group33database?retryWrites=true&w=majority", {useNewUrlParser: true})
    .then(() => console.log('mongodb running on 27017'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
}); 