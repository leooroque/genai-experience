FROM node:20

WORKDIR /usr/src/genai-experience/backend

ENV AgendaAgentId='YOUR-AgendaAgentId'

ENV AgendaAliasId='YOUR-AgendaAliasId'

ENV presentationResumeAgentId='YOUR-presentationResumeAgentId'

ENV presentationResumeAliasId='YOUR-presentationResumeAliasId'

ENV promptIdentifierId='YOUR-promptIdentifierId'

ENV promptVersion='YOUR-promptVersion'

ENV linkedInAgentId='YOUR-linkedInAgentId'

ENV linkedInAliasId='YOUR-linkedInAliasId'

ENV chatFlowInAgentId='YOUR-chatFlowInAgentId'

ENV chatFlowInAliasId='YOUR-chatFlowInAliasId'

ENV chatGuardrailAgentId='YOUR-chatGuardrailAgentId'

ENV chatGuardrailVersion='YOUR-chatGuardrailVersion'

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
