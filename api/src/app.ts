import 'dotenv/config';
import './database';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json, text, urlencoded } from 'express';
import 'express-async-errors';

import routes from './routes';
import exceptionHandler from './util/excetionHandler';

const corsOptions: cors.CorsOptions = {
  origin:  process.env.NODE_ENV === 'development'
  ? '*' : ['http://localhost:4200', 'http://localhost:3000', 'http://barber.thsystem.com.br', 'https://barber.thsystem.com.br', 'http://thsystem.com.br', 'https://thsystem.com.br'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

class App {
  server: express.Express;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    exceptionHandler(this.server);
  }

  middlewares(): void {
    this.server.use(cors(corsOptions));
    this.server.use(cookieParser());

    this.server.use(urlencoded({ limit: '10mb', extended: true }));
    this.server.use(json({ limit: '10mb' }));
    this.server.use(text({ limit: '10mb' }));

  }

  routes(): void {
    this.server.use(routes);
  }
}

export default new App().server;
