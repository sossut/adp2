import app from './app';
import production from './utils/production';
process.env.PORT = process.env.PORT || '5000';
process.env.HTTPS_PORT = process.env.HTTPS_PORT || '8000';
if (process.env.NODE_ENV === 'production') {
  production(app, process.env.PORT, process.env.HTTPS_PORT);
} else {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening: http://localhost:${port}`);
    /* eslint-enable no-console */
  });
}
