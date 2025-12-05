import path from "path";
import i18n_ from "i18n";
export const i18n = i18n_;

export const i18nConfig = (app) => {
  i18n_.configure({
    locales: ["en", "fr"],
    directory: path.join(process.cwd(), "./locales"),
    defaultLocale: "fr",
    cookie: "locale",
    queryParameter: "lang",
    autoReload: true,
    updateFiles: false,
    syncFiles: true,
    indent: "\t",
    extension: ".json",
    objectNotation: true,
    register: global,
  });

  app.use(i18n_.init);
  app.use((req, res, next) => {
    //i18n_.setLocale(req.headers['accept-language']);
    next();
  });
};