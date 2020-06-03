const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const md5=require("md5");

const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended:true
}));

mongoose.connect("mongodb://127.0.0.1/CAR-CDB");



const userSchema=new mongoose.Schema({
name:String,
email:String,
password:String
});

const User=mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
})

app.get("/login",function(req,res){
res.sendFile(__dirname+"/login.html");
});

app.get("/register",function(req,res){
res.sendFile(__dirname+"/register.html");
});




app.post("/login",function(req,res){
   User.findOne({email:req.body.email},function(err,result){
    if(result){
      if(err){
        console.log(err);
      }else{
        app.set("data",result.name);
         if(result.password===md5(req.body.password)){
           res.redirect("/");
      }
      else{
        res.redirect("/login");
      }
      }
    }else{
      res.redirect("/register");
    }

  });
});



app.post("/register",function(req,res){
  User.findOne({email:req.body.email},function(err,result){
    if(result){
    res.redirect("/login");
  }else{
    const user=new User({
     name:req.body.username,
     email:req.body.email,
     password:md5(req.body.password)
    });
    user.save();
    res.redirect("/welcome");
  }
  });
  });


  app.listen(3000,function(){
    console.log("server started");
  });
