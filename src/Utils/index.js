import axios from "axios";

export const utilFns = {
    request: (config) => {
        config.headers = config.headers ? config.headers : {};
        return axios
          .request(config)
          .then((response) => {
            return response;
          })
          .catch((err) => {
            throw err;
          });
    },
}