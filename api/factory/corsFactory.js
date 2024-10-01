module.exports = () => {
    var whitelist = process.env.APIS_WHITE_LIST || '^(http(s)?\:\/\/localhost(\:\d{1,5}(\/)?)?)';
    whitelist = whitelist.split(';');
    var corsOptions = {
          origin: function (origin, callback) {
                if (process.env.NODE_ENV == 'development' || !process.env.NODE_ENV){
                      callback(null, true);
                      return;
                }
                let regex;

                for (let idx in whitelist) {
                      regex = new RegExp(whitelist[idx], 'gi');
                      if (regex.test(origin)) {
                            callback(null, true);
                            return;
                      }
                }

                callback(new Error('Not allowed by CORS'));
                return;
          },
          methods: 'GET,PUT,POST,DELETE',
          optionsSuccessStatus: 200,
          allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
    }

    return corsOptions;
};