const _genAIExperienceLog = require ('./logFactory')();

module.exports = genAIExperienceResponse = () =>{
    genAIExperienceResponse.successResponse = (content,api,functionName) => {
        var data = {
            message: 'Processamento realizado com sucesso!',
            success: true,
            status:200,
            content: (!!content) ? content : ''
        }
        _genAIExperienceLog.generateInfoLog({message: data.message,api: api, functionName: functionName})
        return data;
    }

    genAIExperienceResponse.errorResponse = (content,status,api,functionName) => {
        var err = {
            message: 'Ops, algo deu errado no processamento',
            success: false,
            status: status,
            stack: (!!content.message) ? content.message : content
        }
        _genAIExperienceLog.generateErrorLog({message: err.message,api: api, functionName: functionName, stack: err.stack})
        return err;
    }
    return genAIExperienceResponse;
}