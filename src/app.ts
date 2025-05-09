import * as bodyParser from "body-parser";
import express from "express";
import {
  Index,
  // InterServiceIndex
} from "./routes/index";

class App {
  public app: express.Application;
  public indexRoutes: Index = new Index();

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.indexRoutes.routes(this.app);
  }
}

// class InterServiceApp {
//     public interServiceApp: express.Application;
//     // public interServiceRoutes: InterServiceIndex = new InterServiceIndex();

//     constructor() {
//         this.interServiceApp = express();
//         this.interServiceApp.use(bodyParser.json());
//         // this.interServiceRoutes.routes(this.interServiceApp);
//     }
// }

// export const interServiceComs = new InterServiceApp().interServiceApp;

export default new App().app;
