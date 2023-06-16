import { MongoClient } from 'mongodb';

let client;

export const initializeDbConnection = async () => {
    client = await MongoClient.connect("mongodb+srv://awaizkhanmd:9959198231@cluster0.jnaj01l.mongodb.net/?retryWrites=true&w=majority", {
    // client = await MongoClient.connect(`mongodb+srv://pilogsample:7xVjcWJCywnLrNU2@pilogsample.haolgyn.mongodb.net/pilogsample`, {
        // client = await MongoClient.connect(`mongodb+srv://${process.env.API_MONGO_USER}:${process.env.API_MONGO_PASS}@cluster0.xkeckso.mongodb.net/?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
       //mongodb+srv://awaizkhanmd:9959198231@cluster0.jnaj01l.mongodb.net/?retryWrites=true&w=majority
       //
    });
}

export const getDbConnection = dbName => {
    const db = client.db(dbName);
    return db;
}