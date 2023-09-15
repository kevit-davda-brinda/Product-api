const express = require('express');
require('./db/mongooseConn.js');

const userRouter = require('./routers/user.js');
const productRouter = require('./routers/product.js');

const app = express();
const port = 3000;

app.use(express.json())

app.use(userRouter) // use user route
app.use(productRouter) // use task route

app.listen(port, () => {
    console.log('Srver is running at port ' + port);
})






