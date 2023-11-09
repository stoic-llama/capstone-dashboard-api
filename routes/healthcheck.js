// healthcheck for overall application - is the app up or not?
// this is not api-specfic, but overall app
// https://blog.logrocket.com/how-to-implement-a-health-check-in-node-js/

const express = require('express')
const router = express.Router()

router.get('/', async (_req, res, _next) => {
    const healthcheck = {
        name: 'capstone-dashboard-api',
        message: 'OK',
        uptime: Math.floor(process.uptime()) + " seconds",
        timestamp: formattedDateNow() // new Date(Date.now()).toString() 
    };
    try {
        res.status(200).json(healthcheck);
    } catch (error) {
        res.status(500).json({
            name: 'capstone-dashboard-api',
            message: error.message,
            uptime: Math.floor(process.uptime()) + " seconds",
            timestamp: formattedDateNow() // new Date(Date.now()).toString() 
        });
    }
});

function formattedDateNow() {
   var result = "" 
   var d = new Date(Date.now())

   // format ---> 'YYYY/MM/D hh:mm:ss SSS'

   result = result + d.getFullYear()
            + "/"
            + (d.getMonth()+1)
            + "/"
            + d.getDate().toString().padStart(2,0) 
            + " "
            + d.getHours().toString().padStart(2,0)
            + ":"
            + d.getMinutes().toString().padStart(2,0)
            + ":"
            + d.getSeconds().toString().padStart(2,0)
            + "."
            + d.getMilliseconds().toString().padStart(3,0)

   return result;
}


module.exports = router;