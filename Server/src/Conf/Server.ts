import dotenv from "dotenv";

/* Configurando variaveis de ambiente */
dotenv.config();

const HOST: string = process.env.SERVER_HOST || `localhost`;
const VERSAO: string = process.env.SERVER_VERSAO || `/v1`;
const PORT: number = (process.env.SERVER_PORT) ? parseInt(process.env.SERVER_PORT) : 5000;
const BASE_URL: string = process.env.SERVER_BASE_URL || `/api`;
const FUNC_START = () => console.log(`Servidor em execução em http://${HOST}:${PORT}${BASE_URL}${VERSAO}`);

const ConfServer = {
    HOST,
    PORT,
    VERSAO,
    BASE_URL,
    FUNC_START
}

export { ConfServer };