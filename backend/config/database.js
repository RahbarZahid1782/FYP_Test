const mongoose = require('mongoose');

const DB_CON_STRING = "mongodb://umair:umair@ac-uk413zu-shard-00-00.etdq3lc.mongodb.net:27017,ac-uk413zu-shard-00-01.etdq3lc.mongodb.net:27017,ac-uk413zu-shard-00-02.etdq3lc.mongodb.net:27017/bloomease?ssl=true&replicaSet=atlas-b1037x-shard-0&authSource=admin&retryWrites=true&w=majority";

module.exports = () => {
    mongoose.connect(DB_CON_STRING)
        .then(() => console.log('DB Connection Successful'))
        .catch(err => console.log(err.message));
}
