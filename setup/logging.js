const winston = require('winston');

module.exports = function(){
    /*logging errors on  */
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    winston.add(new winston.transports.Console({colorize: true, prettyPrint: true }));

    process.on('uncaughtException', (ex) =>{
        console.log('UNCAUGHT EXCEPTION');
        winston.error(ex.message,ex );
    })

    process.on('unhandledRejection', (ex) =>{
        console.log('UNHANDLED REJECTION');
        winston.error(ex.message,ex );
    })
}