const mongoDB = require("mongodb").MongoClient;
const dbURL = "mongodb://localhost:27017";
const dbName = "recipe_db";

mongoDB.connect(dbURL, (error, client) => {
    if (error) throw error;
    let db = client.db(dbName);

    // db.collection("contacts").insertOne({
    //     name: "Freddie Mercury",
    //     email: "fred@queen.com"
    // }, (error, data) => {
    //     if (error) throw error;
    //     console.log(data);
    // });

    db.collection("contacts").find().toArray((error, data) => {
        if (error) throw error;
        console.log(data);
    });
});