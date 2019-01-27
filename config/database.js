var mysql= require('mysql');

//For online database on aws server

// module.exports={
//  'connection':   {
				      
// 				      host:"concrete.czu4q09peyku.us-east-2.rds.amazonaws.com",
// 				      user:"chitransh",
// 				      password:"mission1",
// 				      database:"concrete"
				      
//                  }
// };

module.exports={
  
  'connection': {    host:"remotemysql.com",
                   	user:"kiUKewSqLj",
        			 password:"kgl2qKsKO0",
      				database:"kiUKewSqLj"
            }

};
console.log("database");


//For local host


// module.exports={
  
//   'connection': {    host:"localhost",
//                    	user:"root",
//         			 password:"abhi",
//       				database:"qrtool"
//             }

// };
