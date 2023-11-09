import fs from 'fs';
import https from 'https';
import { Request, Response, NextFunction } from 'express';

const production = (app: any, port: string, httpsPort: string) => {
  app.enable('trust proxy');
  const sslkey = fs.readFileSync('/etc/pki/tls/private/ca.key');
  const sslcert = fs.readFileSync('/etc/pki/tls/certs/ca.crt');
  const options = {
    key: sslkey,
    cert: sslcert
  };
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.secure) {
      next();
    } else {
      const proxypath = process.env.PROXY_PATH || '';
      res.redirect(`https://${req.headers.host}${proxypath}${req.url}`);
    }
  });
  app.listen(port);
  https.createServer(options, app).listen(httpsPort);
  console.log(`Listening: https://localhost:${httpsPort}`);
};

export default production;
