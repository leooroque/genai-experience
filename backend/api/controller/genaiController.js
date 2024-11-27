const _genAIService = require('../service/genaiService')();

module.exports = genAIController = () => {
    
    genAIController.llmcall = (req,resp) => {
        _genAIService.llmcall(req,(err,data) =>{
            if(!!err){
                resp.json(err);
            } else{
                resp.json(data);
            }
        });
    };

    genAIController.llmcallv2 = (req,resp) => {
        _genAIService.llmcallv2(req,(err,data) =>{
            if(!!err){
                resp.json(err);
            } else{
                resp.json(data);
            }
        });
    };

    genAIController.llmcallrh = (req,resp) => {
        _genAIService.llmcallrh(req,(err,data) =>{
            if(!!err){
                resp.json(err);
            } else{
                resp.json(data);
            }
        });
    };

    genAIController.getlectures = (req,resp) => {
        _genAIService.getlectures(req,(err,data) =>{
            if(!!err){
                resp.json(err);
            } else{
                resp.json(data);
            }
        });
    };

    genAIController.agenda = (req,resp) => {
        _genAIService.agenda(req,(err,data) =>{
            if(!!err){
                resp.json(err);
            } else{
                resp.json(data);
            }
        });
    };

    genAIController.presentationResume = (req,resp) => {
        _genAIService.presentationResume(req,(err,data) =>{
            if(!!err){
                resp.json(err);
            } else{
                resp.json(data);
            }
        });
    };

    genAIController.linkedIn = (req,resp) => {
        _genAIService.linkedIn(req,(err,data) =>{
            if(!!err){
                resp.json(err);
            } else{
                resp.json(data);
            }
        });
    };

    genAIController.checkCV = (req,resp) => {
        _genAIService.checkCV(req,(err,data) =>{
            if(!!err){
                resp.json(err);
            } else{
                resp.json(data);
            }
        });
    };

    genAIController.getsubjects = (req,resp) => {
        _genAIService.getsubjects(req,(err,data) =>{
            if(!!err){
                resp.json(err);
            } else{
                resp.json(data);
            }
        });
    };

    genAIController.linkedInRH = (req,resp) => {
        _genAIService.linkedInRH(req,(err,data) =>{
            if(!!err){
                resp.json(err);
            } else{
                resp.json(data);
            }
        });
    };

    genAIController.getCVDEtails = (req,resp) => {
        _genAIService.getCVDEtails(req,(err,data) =>{
            if(!!err){
                resp.json(err);
            } else{
                resp.json(data);
            }
        });
    };

    return genAIController;
}