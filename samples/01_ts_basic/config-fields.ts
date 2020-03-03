import { ConfigDictionnaryRaw } from 'envconfman';

const PREFIX = 'SAMPLE_';

export const ConfigFields: ConfigDictionnaryRaw = {
  POLKADOT_NODE_NAME: { name: PREFIX + 'POLKADOT_NODE_NAME', description: 'The name of the node we connect to' },
  POLKADOT_URL: { name: PREFIX + 'POLKADOT_WS_HOST', description: 'The Polkadot WS url' },
};
