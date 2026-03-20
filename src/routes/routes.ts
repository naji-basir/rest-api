import { Express, Request, Response } from 'express';
import { createUserHandler } from '../controller/user.controller';
import validateResource from '../middleware/validateResourse';
import { createUserSchema } from '../schema/user.schema';
export const routes = (app: Express) => {
  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post('/api/user', validateResource(createUserSchema), createUserHandler);
};
