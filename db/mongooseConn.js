const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'product-api';

async function main() {
    await mongoose.connect(url + '/' + dbName , {serverSelectionTimeoutMS: 2000});
    return 'Connected successfully!'
}

main()
    .then(console.log)
    .catch(console.error)