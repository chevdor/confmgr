import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

module.exports = {
  // General Polkadot config
  polkadot: {
    // This is just for you to remember. i.e. 'Crash Override'
    nodeName: process.env.POLKADOT_NODE_NAME,
    // WebSocket host:port, usually :9944. i.e. 'ws://127.0.0.1:9944'
    host: process.env.POLKADOT_WS_HOST || 'ws://127.0.0.1:9944',
  },

  // General Matrix config
  matrix: {
    // Who is managing the bot. i.e. '@you:matrix.org'
    botMasterId: process.env.MATRIX_BOTMASTER_ID,
    // In what room is the bot active by default. i.e. '!<someid>:matrix.org'
    roomId: process.env.MATRIX_ROOM_ID,
    // Credentials of the bot. i.e. '@...:matrix.org'
    botUserId: process.env.MATRIX_BOT_USER_ID,
    // Token. i.e. 'your_token_here'
    token: process.env.MATRIX_TOKEN,
    // Base Matrix URL. i.e. 'https://matrix.org'
    baseUrl: process.env.MATRIX_BASE_URL || 'https://matrix.org',
    loginUserId: process.env.MATRIX_LOGIN_USER_ID,
    loginUserPassword: process.env.MATRIX_LOGIN_USER_PASSWORD,
  },
};
