import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod/v3';

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  };
