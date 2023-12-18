import fs from 'fs';
import https from 'https';
import { Request, Response, NextFunction } from 'express';

const production = (app: any, port: string, httpsPort: string) => {
  app.enable('trust proxy');
  const sslcert = fs.readFileSync(
    '/etc/letsencrypt/live/shtsvr.mooo.com/fullchain.pem'
  );
  const sslkey = fs.readFileSync(
    '/etc/letsencrypt/live/shtsvr.mooo.com/privkey.pem'
  );
  const ca = fs.readFileSync('/etc/letsencrypt/live/shtsvr.mooo.com/chain.pem');
  const options = {
    // key: sslkey,
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
