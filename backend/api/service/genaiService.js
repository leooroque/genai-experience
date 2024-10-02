const _log = require('../factory/logFactory')();
const _response = require('../factory/responseFactory')();
const _prompt = require('../factory/promptFactory')();
const { BedrockRuntimeClient, InvokeModelCommand , ApplyGuardrailCommand } = require("@aws-sdk/client-bedrock-runtime");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
const { BedrockAgentRuntimeClient, InvokeAgentCommand, InvokeFlowCommand } = require ("@aws-sdk/client-bedrock-agent-runtime");
const _getVariable = require('../factory/getEnvironmentVariables')();


const bedrockAgentRuntime = new BedrockAgentRuntimeClient({
    region: 'us-east-1'
});

const bedrockRuntime = new BedrockRuntimeClient({
    region: 'us-east-1'
});

const _api = 'ServiceLayer';

module.exports = genaiService = () => {
    genaiService.llmcall = async (req,callback) => {
        let _functionName = "llmcall";
        try{
            _log.generateInfoLog({message:`Inicio do processo da funcao ${_functionName}`,api:_api,functionName:_functionName});
            let guardrail = await genaiService.callGuardrail(_getVariable.getVariable('chatGuardrailAgentId'),_getVariable.getVariable('chatGuardrailVersion'),req.body.content);
            var awnser;
            if(!guardrail){
                 awnser = await genaiService.callFlows(_getVariable.getVariable('chatFlowInAgentId'),_getVariable.getVariable('chatFlowInAliasId'),req.body.content)
            } else{
                awnser = guardrail
            }
            callback(undefined, _response.successResponse(awnser, _api, _functionName));
        } catch (err) {
            callback(_response.errorResponse(err, 500, _api, _functionName), undefined);
        }
    }

    genaiService.invokellm = async (prompt) => {
        let _functionName = "invokellm";
        try{
            _log.generateInfoLog({message:`Inicio do processo da funcao ${_functionName}`,api:_api,functionName:_functionName});
            let command = new InvokeModelCommand(prompt);
            let responseBody = await bedrockRuntime.send(command);
            if(responseBody){
                return JSON.parse(new TextDecoder().decode(responseBody.body));
            }else {
                throw new Error("Error when calling the model");
            }
        } catch (err){
            throw new Error(err);
        }
    }

    genaiService.agenda =  async (req,callback) => {
        let _functionName = "agenda";
        try {
                _log.generateInfoLog({message:`Inicio do processo da funcao ${_functionName}`,api:_api,functionName:_functionName});
                let task;
                if (req.body.content.name && req.body.content.role){
                    task = `Meu nome é ${req.body.content.name} e meu cargo é ${req.body.content.role},
                    meus interesses são: ${req.body.content.interests}`  
                } else {
                    task = `Meus interesses são interesses gerais de cultura, certificações da AWS e novidades como Generative AI`
                }
                let agentResponse = await genaiService.callAgents(_getVariable.getVariable('AgendaAgentId'),_getVariable.getVariable('AgendaAliasId'), req.body.content.session , task)                    
                callback(undefined,_response.successResponse(agentResponse,_api,_functionName));
          } catch (err) {
            callback(_response.errorResponse(err, 500, _api, _functionName), undefined);
          }
    }
    
    genaiService.presentationResume = async (req, callback) => {
        let _functionName = "presentationResume";
        try {
            _log.generateInfoLog({message:`Inicio do processo da funcao ${_functionName}`, api:_api, functionName:_functionName});
            let task;
            task = `Tenho interesse na apresentação ${req.body.presentation}`
            let agentResponse = await genaiService.callAgents(_getVariable.getVariable('presentationResumeAgentId'), _getVariable.getVariable('presentationResumeAliasId'), req.body.session, task)
            callback(undefined, _response.successResponse(agentResponse, _api, _functionName));
        } catch (err) {
            callback(_response.errorResponse(err, 500, _api, _functionName), undefined);
        }
    }

    genaiService.linkedIn = async (req, callback) => {
        let _functionName = "linkedIn";
        var prompt;
        try {
            let prompt = await _prompt.getBedrockPrompt({promptIdentifier:_getVariable.getVariable('promptIdentifierId'),promptVersion:_getVariable.getVariable('promptVersion')},req.body.content);
            if (!prompt){
                prompt = await _prompt.getDefaultPrompt(req.body.content);
            }
            _log.generateInfoLog({message:`Inicio do processo da funcao ${_functionName}`, api:_api, functionName:_functionName});
            let agentResponse = await genaiService.callAgents(_getVariable.getVariable('linkedInAgentId'),_getVariable.getVariable('linkedInAliasId'), req.body.content.session , prompt)    
            callback(undefined, _response.successResponse(agentResponse, _api, _functionName));
        } catch (err) {
            callback(_response.errorResponse(err, 500, _api, _functionName), undefined);
        }
    }

    genaiService.getlectures = (req, callback) => {
        let _functionName = "getlectures";
        try {
            _log.generateInfoLog({message:`Inicio do processo da funcao ${_functionName}`, api:_api, functionName:_functionName});
            let lectures = {"lectures": [
                {"name": "Generative AI com Amazon Bedrock"},
                {"name":"Deep dive em SaaS com a AWS: Padrões de Arquitetura, Identidade e Isolamento"}, {"name":"Personalizaçao de modelos de IA Generativa na AWS"},
                {"name":"Arquiteturas Orientadas a Eventos & Transações Distribuidas"},
                {"name":"Impulsionando Inovação com IA Generativa na AWS"},
                {"name":"Melhores Práticas ao se preparar para os Exames de Certificação AWS"},
                {"name":"Learning from Amazon - Product Management "},
                {"name":"Fundamentos de Resiliência"},
                {"name":"Fluxo de Dados de Ponta a Ponta: Integração, Processamento e Persistência com Amazon MSK Connect, MSK e Kinesis Data Analytics"},
                {"name":"Melhores práticas de observabilidade para aplicações modernas"},
                {"name":"Cultura de Inovação da Amazon"},
                {"name":"Patterns de resiliência para a camada de aplicação"},
                {"name":"Como os serviços gerenciados de AI/ML podem ajudar a acelerar o processo de implementação de novas funcionalidades"},
                {"name":"Gray Failures: como identificá-las e mitigá-las para proteger a continuidade de negócio"},
                {"name":"Bancos de dados na AWS: Qual a ferramenta certa para cada tarefa?"},
                {"name":"Estratégias de Cache e casos de uso do Amazon ElastiCache"},
                {"name":"Desenvolvendo aplicações seguras de IA generativa com os príncipios do OWASP Top10 para LLM"},
                {"name":"Ferramentas de observabilidade para bancos de dados na AWS"}
                ]}
                callback(undefined, _response.successResponse(lectures, _api, _functionName));
        } catch (error) {
            _log.generateErrorLog({
                message: `Erro durante o processo da funcao ${_functionName}`,
                api: _api,
                functionName: _functionName,
                error: error
            });

            callback(_response.errorResponse(err, 500, _api, _functionName), undefined);
        }  
    }

    genaiService.callAgents = async (agentId,agentAliasId, sessionId ,task ) => {
    let _functionName = "callAgents";
    try {
        _log.generateInfoLog({message:`Inicio do processo da funcao ${_functionName}`,api:_api,functionName:_functionName});
        let command = new InvokeAgentCommand({
            agentId,
            agentAliasId,
            sessionId,
            inputText: task,
            enableTrace: true
        });

        let completion = "";
        const response = await bedrockAgentRuntime.send(command);
        
        if (response.completion === undefined) {
            throw new Error("Completion is undefined");
        }
        
        for await (let chunkEvent of response.completion) {
            const chunk = chunkEvent.chunk;
                if(chunk){
                    const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
                    completion += decodedResponse;
                }
        }

        return completion;
    } catch (err) {
        throw new Error(err);
    }}

    genaiService.callFlows = async (flowId,flowAliasId,task) => {
        let _functionName = "callFlows";
        try{
            _log.generateInfoLog({message:`Inicio do processo da funcao ${_functionName}`,api:_api,functionName:_functionName});
            let command = new InvokeFlowCommand({
                flowIdentifier:flowId,
                flowAliasIdentifier:flowAliasId,
                inputs: [ 
                    { 
                      nodeName: "FlowInputNode", 
                      nodeOutputName: "document", 
                      content: { 
                        document: task,
                      },
                    },
                  ]
            });
            let responseBody = await bedrockAgentRuntime.send(command);
            let completion = "";
            for await (const event of responseBody.responseStream) {
                
                if (event.flowOutputEvent) {
                    completion = event.flowOutputEvent.content.document;
                    break; // Assuming we only need the first flowOutputEvent
                }
            }
            return completion;
        } catch (err){
            throw new Error(err);
        }
    }

    genaiService.callGuardrail = async (guardrailIdentifier,guardrailVersion,task) => {
        let _functionName = "invokellm";
        try{
            _log.generateInfoLog({message:`Inicio do processo da funcao ${_functionName}`,api:_api,functionName:_functionName});
            let command = new ApplyGuardrailCommand({
                guardrailIdentifier: guardrailIdentifier,
                guardrailVersion: guardrailVersion,
                source: "INPUT" || "OUTPUT" ,
                content: [
                    {
                    text: {
                        text: task, 
                    }
                    }
                ]
            });
            let responseBody = await bedrockRuntime.send(command);
            if(responseBody.outputs.length > 0) {
                return responseBody.outputs[0].text;
            }
            return undefined;
        } catch (err){
            throw new Error(err);
        }
    }

    return genaiService;
}