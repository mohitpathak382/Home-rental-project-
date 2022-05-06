var db=require('../database');
module.exports={ 
  storeImage:function(inputValues,callback){

  // check unique email address
var sql='SELECT * FROM house WHERE image =?';
db.query(sql,inputValues.image,function (err, data, fields) {
 if(err) throw err
 if(data.length>1){
     var msg = inputValues.image + " is already exist";
 }else{ 
    // save users data into database
    var sql = 'INSERT INTO  SET ?';
   db.query(sql, inputValues, function (err, data) {
      if (err) throw err;
   });
  var msg = inputValues.image_name+ "is uploaded successfully";
 }
 return callback(msg)
})
  }
}