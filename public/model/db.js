const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://nvu806101:19ShRC4UNeVi69Dz@cluster0.iupvbq2.mongodb.net/Database?retryWrites=true&w=majority')
       .catch((err)=>{
           console.log(err);
       });
module.exports = {mongoose};

//mongodb+srv://nvu806101:19ShRC4UNeVi69Dz@cluster0.iupvbq2.mongodb.net/Database?retryWrites=true&w=majority
//mongodb+srv://admin:Abc123@cluster0.purxtfc.mongodb.net/Data_Prod?retryWrites=true&w=majority


