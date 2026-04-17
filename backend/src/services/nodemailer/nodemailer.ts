import { createTransport } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { resolve } from "path";
import config from "../../config";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: resolve("src/services/nodemailer/templates"),
    defaultLayout: "",
  },
  viewPath: resolve("src/services/nodemailer/templates"),
  extName: ".handlebars",
};

transporter.use("compile", hbs(handlebarOptions));

export default transporter;
