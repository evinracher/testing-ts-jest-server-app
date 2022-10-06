import { Server } from "../../app/Server/Server";
import { LoginHandler } from "../../app/Handlers/LoginHandler";
import { Authorizer } from "../../app/Authorization/Authorizer";
import { DataHandler } from "../../app/Handlers/DataHandler";
import { UsersDBAccess } from "../../app/Data/UsersDBAccess";

jest.mock("../../app/Handlers/LoginHandler");
jest.mock("../../app/Handlers/DataHandler");
jest.mock("../../app/Authorization/Authorizer");

const requestMock = {
  url: "",
};
const responseMock = {
  end: jest.fn(),
};
const listenMock = {
  listen: jest.fn(),
};

jest.mock("http", () => {
  return {
    createServer: (cb: any) => {
      cb(requestMock, responseMock);
      return listenMock;
    },
  };
});

describe("Server test suite", () => {
  test("should create server on port 8080", () => {
    new Server().startServer();
    expect(responseMock.end).toBeCalled();
    expect(listenMock.listen).toBeCalledWith(8080);
  });

  test("should handle login request", () => {
    requestMock.url = "http://localhost:8080/login";
    new Server().startServer();
    const handlerRequestSpy = jest.spyOn(
      LoginHandler.prototype,
      "handleRequest"
    );
    expect(handlerRequestSpy).toBeCalled();
    expect(LoginHandler).toBeCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer)
    );
  });

  test("should handle data request", () => {
    requestMock.url = "http://localhost:8080/users";
    new Server().startServer();
    const handlerRequestSpy = jest.spyOn(
      DataHandler.prototype,
      "handleRequest"
    );
    expect(handlerRequestSpy).toBeCalled();
    expect(DataHandler).toBeCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer),
      expect.any(UsersDBAccess)
    );
  });
});
