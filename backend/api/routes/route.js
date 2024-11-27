const _genAIExperience = require('../controller/genaiController')();


const cors = require('cors');
const corsOptions = require('../factory/corsFactory');

module.exports = app => {
    /** Rota das funcionalidades dos produtos */
    app.route('/api/genai/llm')
    .post(_genAIExperience.llmcall,cors(corsOptions))

    app.route('/api/genai/llmv2')
    .post(_genAIExperience.llmcallv2,cors(corsOptions))

    app.route('/api/genai/agenda')
    .post(_genAIExperience.agenda,cors(corsOptions))

    app.route('/api/genai/getlectures')
    .get(_genAIExperience.getlectures, cors(corsOptions))

    app.route('/api/genai/presentationResume')
    .post(_genAIExperience.presentationResume, cors(corsOptions))

    app.route('/api/genai/linkedIn')
    .post(_genAIExperience.linkedIn, cors(corsOptions))

    app.route('/api/genai/checkCV')
    .post(_genAIExperience.checkCV,cors(corsOptions))
    
    app.route('/api/genai/getsubjects')
    .get(_genAIExperience.getsubjects, cors(corsOptions))

    app.route('/api/genai/linkedInRH')
    .post(_genAIExperience.linkedInRH, cors(corsOptions))

    app.route('/api/genai/getCVDEtails')
    .post(_genAIExperience.getCVDEtails, cors(corsOptions))

    app.route('/api/genai/llmrh')
    .post(_genAIExperience.llmcallrh,cors(corsOptions))
}