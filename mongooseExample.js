const mongoose = require("mongoose");
const subscriberSchema = mongoose.Schema({
    name: String,
    email: String,
    zipCode: Number
});

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

// first way
const subscriber1 = new Subscriber({
    name: "John Wexler",
    email: "jon@jonwexler.com"
});

subscriber1.save((error, savedDocument) => {
    if(error) console.log(error);
    console.log(savedDocument);
});
// end of first way

// second way, create and save subscriber in a single step
Subscriber.create({
    name: "Jorge Rivera",
    email: "JorgeRivera@gmail.com"
}, function(error, savedDocument){
    if(error) console.log(error);
    console.log(savedDocument);
})
mongoose.connect("mongodb://localhost:27017/recipe_db", {useNewUrlParser: true});
const db = mongoose.connection;

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose");
})