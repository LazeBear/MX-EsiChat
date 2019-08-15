require('envdotjson').load();
require('./utils/globalErrorCatcher');
require('./socket.io');
require('./express');
require('./utils/db').connectToDB();
