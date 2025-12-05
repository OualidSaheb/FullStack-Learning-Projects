import YAML from "yamljs";
import swagger from "swagger-ui-express";
export const swaggerUi = swagger;
export const swaggerDocument = YAML.load("./routes/openapi.yaml");
export const DisableTryItOutPlugin = () => ({
  statePlugins: {
    spec: {
      wrapSelectors: {
        allowTryItOutFor: () => () => false
      }
    }
  }
});
export const swaggerOptions = {
  swaggerOptions: {
    plugins: [
      DisableTryItOutPlugin
    ]
  }
};