import * as express from "express";
import * as multer from "multer";

const errorHandlerMiddleware = (app: express.Application) => {

  // Error handling
  app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (err instanceof multer.MulterError) {
      // Manejo de errores de Multer
      res.status(400).json({error: err.message});
    } else {
      // Otros errores
      console.log(err)
      res.status(500).json({error: 'Internal Server Error'});
    }
  });
};

export {errorHandlerMiddleware}
