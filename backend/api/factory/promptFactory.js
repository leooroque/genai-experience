const { BedrockAgentClient, GetPromptCommand } = require ("@aws-sdk/client-bedrock-agent"); 
const { fromIni } = require("@aws-sdk/credential-provider-ini");

const _bedrockAgentRuntime = new BedrockAgentClient({
    region: 'us-east-1'
});

module.exports = genAIExperiencePrompt = () =>{
    genAIExperiencePrompt.generatePromptToLLM = (prompt) => {
  
        const params = {
            modelId: "us.anthropic.claude-3-5-sonnet-20240620-v1:0",
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
        var prompt;
        try{
            let command = new GetPromptCommand(input);
            let response = await _bedrockAgentRuntime.send(command);
             prompt = response.variants[0].templateConfiguration.text.text.replace('{{tipoLinguagem}}',variables.tone)
             prompt = prompt.replace('{{topico}}',variables.lectures)
            return prompt;
        } catch(err){
            return undefined;
        }   
    }

    genAIExperiencePrompt.getDefaultPrompt =  (variables) => {
        var prompt;
        try{
             prompt =   `Gere um post do LinkedIn de utilizando uma linguagem ${variables.tone}. O post deve ter a seguinte estrutura. 
            Topicos: ${variables.lectures}
            Incluir hashtags do post considerando as seguintes hashtags #Santander #F1RST #AWS e #GenaI #SantanderAWSExperience e inclua uma hashtag relaciona com os ${variables.lectures} abordados. 
            Retorne apenas os detalhes do post sem nenhum comentário adicional
            Sempre crie posts em portugues.
            Independente do tipo da linguagem escolhida seja sempre educado, não considere palavrões ou xingamentos, não faça comparações com outras intituições.
            Não utilize tags XMLs nos posts.`
            return prompt;
        } catch(err){
            throw new Error(err)
        }   
    }

    genAIExperiencePrompt.getDefaultPromptRH =  (variables) => {
        var prompt;
        try{
             prompt =   `Gere um post do LinkedIn de utilizando uma linguagem ${variables.tone}. O post deve ter a seguinte estrutura. Criação de um breve resumo de no máximo 100 caractetres do conteúdo recebido: ${variables.topics} Incluir hashtags do post considerando as seguintes hashtags #Santander #F1RST #AWS e #GenaI #TalentAcquisitionAwards2024 e inclua uma hashtag relaciona com os ${variables.topics} abordados. Faça o post em uma linguagem de profssional de RH que não tem domínio sobre tecnologia, os exemplos precisam ser relacionados ao mundo de RH. Inclua ao final do post a seguinte frase: Post by Amazon Bedrock. Retorne apenas os detalhes do post sem nenhum comentário adicional Sempre crie posts em portugues. Independente do tipo da linguagem escolhida seja sempre educado, não considere palavrões ou xingamentos, não faça comparações com outras intituições. Não utilize tags XMLs nos posts. Nunca utilize a palavra chatGPT, Microsoft ou openAI.`
            return prompt;
        } catch(err){
            throw new Error(err)
        }   
    }

    return genAIExperiencePrompt;
}