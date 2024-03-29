import * as axios from "axios";
import {
  HTTP_CODES,
  SessionToken,
  UserCredentials,
} from "../app/Models/ServerModels";
import { UserCredentialsDBAccess } from "../app/Authorization/UserCredentialsDBAccess";

axios.default.defaults.validateStatus = function () {
  return true;
};

const serverURL = "http://localhost:8080";

const itestUserCredentials: UserCredentials = {
  accessRights: [1, 2, 3],
  password: "iTestPassword",
  username: "iTestUser",
};

describe("Server test suite", () => {
  let userCredentialsDBAccess: UserCredentialsDBAccess;
  let sessionToken: SessionToken;

  beforeAll(() => {
    userCredentialsDBAccess = new UserCredentialsDBAccess();
  });

  test("Server reachable", async () => {
    const response = await axios.default.options(serverURL);
    expect(response.status).toBe(HTTP_CODES.OK);
  });

  test.skip("put credentials inside database", async () => {
    await userCredentialsDBAccess.putUserCredential(itestUserCredentials);
  });

  test("reject invalid credentials", async () => {
    const response = await axios.default.post(serverURL + "/login", {
      username: "wrongUser",
      password: "wrongPass",
    });
    expect(response.status).toBe(HTTP_CODES.NOT_fOUND);
  });

  test("login successes with correct credentials", async () => {
    const response = await axios.default.post(serverURL + "/login", {
      username: itestUserCredentials.username,
      password: itestUserCredentials.password,
    });
    expect(response.status).toBe(HTTP_CODES.CREATED);
    sessionToken = response.data;
  });

  test("query data", async () => {
    const response = await axios.default.get(serverURL + "/users?name=some", {
      headers: {
        Authorization: sessionToken.tokenId,
      },
    });
    expect(response.status).toBe(HTTP_CODES.OK);
  });

  test("query data with invalid token", async () => {
    const response = await axios.default.get(serverURL + "/users?name=some", {
      headers: {
        Authorization: sessionToken.tokenId + "invalid",
      },
    });
    expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED);
  });
});

// This doesn't work in jest:
// async function serverReachable(): Promise<boolean> {
//   try {
//     await axios.default.get(serverURL);
//   } catch (error) {
//     console.log("Server not reachable");
//     return false;
//   }
//   console.log("Server reachable");
//   return true;
// }
