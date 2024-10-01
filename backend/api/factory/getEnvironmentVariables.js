 

module.exports = getEnvironmentVariables = () =>{
    getEnvironmentVariables.getVariable = (variable) => {
        return process.env[variable];
    }

    return getEnvironmentVariables;
}