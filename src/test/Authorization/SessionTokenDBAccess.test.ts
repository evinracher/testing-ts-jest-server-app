import { SessionTokenDBAccess } from "../../app/Authorization/SessionTokenDBAccess";
import * as Nedb from "nedb";
import { SessionToken } from "../../app/Models/ServerModels";
jest.mock("nedb");

describe("SessionTokenDBAccess test suite", () => {
  let sessionTokenDBAccess: SessionTokenDBAccess;

  const nedbMock = {
    loadDatabase: jest.fn(),
    insert: jest.fn(),
    find: jest.fn(),
  };

  const someToken: SessionToken = {
    accessRights: [],
    expirationTime: new Date(),
    tokenId: "123",
    userName: "Kevin",
    valid: true,
  };

  beforeEach(() => {
    sessionTokenDBAccess = new SessionTokenDBAccess(nedbMock);
    expect(nedbMock.loadDatabase).toBeCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("store sessionToken without error", async () => {
    nedbMock.insert.mockImplementationOnce((someToken: any, cb: any) => {
      cb();
    });
    await sessionTokenDBAccess.storeSessionToken(someToken);
    expect(nedbMock.insert).toBeCalledWith(someToken, expect.any(Function));
  });

  test("store sessionToken with error", async () => {
    nedbMock.insert.mockImplementationOnce((someToken: any, cb: any) => {
      cb(new Error("something went wrong"));
    });
    await expect(
      sessionTokenDBAccess.storeSessionToken(someToken)
    ).rejects.toThrow("something went wrong");
    expect(nedbMock.insert).toBeCalledWith(someToken, expect.any(Function));
  });

  test("get token without error", async () => {
    nedbMock.find.mockImplementationOnce((user: any, cb: any) => {
      cb(null, []);
    });
    const token = await sessionTokenDBAccess.getToken("user");
    expect(token).toBeUndefined();
    expect(nedbMock.find).toBeCalledWith(
      { tokenId: "user" },
      expect.any(Function)
    );
  });

  test("get token with error", async () => {
    nedbMock.find.mockImplementationOnce((user: any, cb: any) => {
      cb(new Error("something went wrong"));
    });
    await expect(sessionTokenDBAccess.getToken("user")).rejects.toThrow(
      "something went wrong"
    );
    expect(nedbMock.find).toBeCalledWith(
      { tokenId: "user" },
      expect.any(Function)
    );
  });
});
