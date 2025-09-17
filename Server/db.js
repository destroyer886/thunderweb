// const { urlencoded } = require('express');
const { MongoClient } = require('mongodb');


let client;
let db;


 async function connectToDb(){
    const uri = "mongodb+srv://dhruvchoudhary88649:thundercoder@cluster0.xveiygm.mongodb.net/?retryWrites=true&w=majority&AppName=Cluster0";
    
    client = new MongoClient(uri)
    await client.connect();
    db = client.db('Greenish');
    const Users = db.collection('Users');
  
    console.log('mongo db is connected with Greenish Farmer')

    return{
       db, Users
    }
}

const closedb = async ()=>{
  
      console.log('SIGTERM signal received: closing MongoDB client');
      if (client) {

         await client.close(false, (err) => {
            if (err) {
              console.error('Error closing MongoDB client', err);
              process.exit(1);
            } else {
              console.log('MongoDB client closed');
              process.exit(0);
            }
          });
          
      } else {
     
        process.exit(0);
      }

      // await client.close(false, (err) => {
      //    if (err) {
      //      console.error('Error closing MongoDB client', err);
      //      process.exit(1); // Exit with non-zero status on error
      //    } else {
      //      console.log('MongoDB client closed');
      //      process.exit(0); // Exit with success status
      //    }
      //  });
      console.log('closed')
   
    
}





const DB = ()=> db;

module.exports = { connectToDb , DB , closedb,client }

