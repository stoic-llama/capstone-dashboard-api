require('dotenv').config()

const express = require('express')
const app = express()

app.get("/", (req, res) => {
    res.send("Metrics Dashboard API is alive at port!")
})

////////////////
//   Routes   //
////////////////

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// setup app to process JSON
app.use(express.json())

// setup applications endpoint/route
const applicationsRouter = require('./routes/applications')
app.use('/api/v1/applications', applicationsRouter)

// setup healthcheck for entire application
const healthcheckRouter = require('./routes/healthcheck')
app.use('/api/v1/healthcheck', healthcheckRouter);


/////////////////
//   Startup   //
/////////////////
const port = process.env.PORT || 9999

// start server at port 7100
app.listen(port, () => console.log(`Server started at ${port}`))