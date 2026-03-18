import express from 'express';
const app = express();
import config from 'config';
import connect from './utils/connect';
import logger from './utils/logger';

const PORT = config.get<number>('port');
app.listen(PORT, () => {
  logger.info(`App is running at http://localhost:${PORT}`);

  connect();
});
