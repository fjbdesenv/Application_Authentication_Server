import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import Routers from "../Routes";
import { ConfServer } from "../Conf/Server"
import { Erro } from "../Utils/Responses";
import { checkKey } from "../Utils/Functions";
const server = express();

server.use(helmet());       /* Configura headers de segunraça para o express */
server.use(morgan("dev"));  /* Gerar logs no console */
server.use(express.json())  /* Configura uso de parser-Body com Json */

function setRouters() {
    server.use(checkKey);
    server.use(`${ConfServer.BASE_URL}${ConfServer.VERSAO}`, Routers.Auth);
    server.use(`${ConfServer.BASE_URL}${ConfServer.VERSAO}/aplicacoes`, Routers.Aplicacao);
    server.use(`${ConfServer.BASE_URL}${ConfServer.VERSAO}/niveis`, Routers.Nivel);
    server.use(Routers.NotFount);
    server.use(Erro);
}

function start() {
    setRouters();

    server.listen(
        ConfServer.PORT,
        ConfServer.HOST,
        ConfServer.FUNC_START
    );
};


export { server, start };