import { API, Auth } from "aws-amplify";
const API_NAME = "balderApi";
const ROUTE_NAME = "/new-narrative";

export const createNarrative = async (language: string, text: string) => {
  //   const user = await Auth.currentAuthenticatedUser();
  //   const userId = user.attributes.sub;
  //   const attributes = JSON.parse(user.attributes.identities);
  const init = {
    body: {
      language: language,
      text: text,
    },
  };
  const res = await API.post(API_NAME, ROUTE_NAME, init);
  return res;
};
