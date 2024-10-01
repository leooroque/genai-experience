const { BedrockAgentClient, GetPromptCommand } = require ("@aws-sdk/client-bedrock-agent"); 
//const { fromIni } = require("@aws-sdk/credential-provider-ini");

const _bedrockAgentRuntime = new BedrockAgentClient({
    region: 'us-east-1'
});

module.exports = genAIExperiencePrompt = () =>{
    genAIExperiencePrompt.generatePromptToLLM = (prompt) => {
  
        const params = {
            modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        };

        return params;
    }

    genAIExperiencePrompt.getBedrockPrompt = async (input,variables) => {
        try{
            let command = new GetPromptCommand(input);
            let response = await _bedrockAgentRuntime.send(command);
            let prompt = response.variants[0].templateConfiguration.text.text.replace('{{tipoLinguagem}}',variables.tone)
             prompt = prompt.replace('{{topico}}',variables.lectures)
            return prompt;
        } catch(err){
            throw new Error(err)
        }
        
    }

    return genAIExperiencePrompt;
}