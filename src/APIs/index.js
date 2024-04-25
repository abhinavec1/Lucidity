import {utilFns} from "../Utils";

const BASE_URL = 'https://dev-0tf0hinghgjl39z.api.raw-labs.com/'

export const API_MANAGER = {
    getInventoryData: (params) => {
        return utilFns.request({
          baseURL: BASE_URL,
          url: "inventory",
          method: "GET",
          params,
          headers: { "Content-Type": "multipart/form-data" },
        });
      },
}