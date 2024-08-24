const express = require('express')
var cors = require('cors')

require('dotenv').config({ path: '../.env' });
const dbConfig = require('./config/database')
const app = express()
const userRoutes = require('./routes/userRoutes')

app.use(cors())
app.use(express.json())
app.use('/app/users', userRoutes)



const PORT = process.env.PORT || 5000;



app.listen(PORT , ()=>{

    console.log(   `Server is running on port http://localhost:${PORT}`);
})