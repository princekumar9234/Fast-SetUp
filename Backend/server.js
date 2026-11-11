import app from "./src/app.js";
import ConnectDB from "./src/config/DataBase.js";
import config from "./src/config/config.js";

ConnectDB();

app.listen(config.PORT, () => {
  console.log(`server is listening on port ${config.PORT}`);
});
