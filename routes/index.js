var express = require('express');
var router = express.Router();
var mysql=require('mysql');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var secret="supersecret";


var dbconfig=require('../config/database');
var connection=mysql.createConnection(dbconfig.connection);




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// api for login
router.post('/login',function(req,res,next){

 var contact=req.body.contact;
 var password=req.body.password;

console.log(typeof(req.body.contact));
console.log(contact);
console.log(password);
 connection.query("select * from user where contact='"+contact+"'",function(err,result,fields){
  if (err) {
     return handleError(err, null, res);
   }
  else{

        if(result.length<=0)
        {
        	 console.log("user with contact number: " +contact+ " does not exist");
           msg="user with contact number does not exist";
           return handleError(null,msg,res);
        }
        console.log(result[0].password);
           
        
         bcrypt.compare(password, result[0].password , function(err, isMatch){
			       if(err){
                    return handleError(err, null, res);
                }
                if(!isMatch){
                    return handleError(null, "wrong password", res);
                }
                jwt.sign({id: result[0].userId}, secret, function(err, token){
                    if(err)handleError(err, null, res);
                res.json({
                     success:true,
                     token:token

                });
            });
        }) 
     }
   })
});

//This api is for register of user
router.post('/register',function(req,res,next){

   var name=req.body.name;
   var email=req.body.email;
   var password = req.body.password;
   var contact=req.body.contact.slice(2-12);
   console.log(contact);
   //var bloodGroup=req.body.bloodgroup;


   // var contact2=req.body.contact.slice(2-12);
   // console.log(contact2);

connection.query("select contact from user",function(err,result,fields){
  if(err) throw err;
   else{
    for(var i=0;i<result.length;i++){

    if(contact==result[i].contact)
    {
      console.log("mobile number" +contact + "already exist");
      return res.json({
      success:true,
      msg:'mobile number already exist'
     });
    }

}
console.log("mobile number" +contact+ "does not exist");

return res.json({
    msg:'mobile number does not exist'
})

  }


 var newUser= ({
       name:name,
       email:email,
       password:password,
       contact:contact
       
 });

     
       bcrypt.hash(newUser.password, 10, function(err, hash){
        if(err)throw err;
        newUser.password = hash;


            
   var sql="Insert into user ( name , email , contact,password) values('"+newUser.name+"','"+newUser.email+"','"+newUser.contact+"','"+newUser.password+"')";
   connection.query(sql,function(err,result){
      if(err) throw err;
           

         return res.json({
                    success:true,
                    msg: 'user created'
                });

           });

        });
})    

});

router.post('/qrgenerator',function(req,res,next){

var receivercontact=req.body.rmobile;
var receiverAddress=req.body.raddress;
var productDescription=req.body.proDescription;
var receiverName=req.body.rname;

console.log(receivercontact);
console.log(receiverAddress);
console.log(productDescription);
console.log(receiverName);

connection.query("Insert into qrdata (rcontact,raddress,productdescription,rname) values('"+receivercontact+"','"+receiverAddress+"','"+productDescription+"','"+receiverName+"')",function(err,result,fields){
if(err) throw err;

var result={
	rmobile:receivercontact,
	raddress:receiverAddress,
	proDescription:productDescription,
	rname:receiverName
    

}


  res.json({
                    success:true,
                    msg:'qrdata successfully stored in database',
                   data:result
                });



})

});



//this function is a general error handler
function handleError(err, msg, res){
    console.log(err);
    if(msg == undefined){
        msg = "there was some error at the server"
    }
    return res.json({
        success:false,
        msg: msg,
        err:err
    })
}






module.exports = router;
