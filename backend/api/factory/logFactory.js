const winston = require('winston');
const logger = winston.createLogger({
    format:winston.format.json(),
    transports:[
        new winston.transports.File({filename:'genAIExperience.log'})
    ]
});

module.exports = genAIExperienceLog = () =>{
    genAIExperienceLog.generateInfoLog = (content) => {
        logger.log(
            {
                level: 'info',
                message: content.message,
                api: content.api,
                function: content.functionName,
                date: Date.now()  
            }
        );
    }
    genAIExperienceLog.generateErrorLog = (content) => {
        logger.log(
            {
                level: 'error',
                message: content.message,
                api: content.api,
                function: content.functionName,
                date: Date.now()  
            }
        )
    }
    return genAIExperienceLog;
}