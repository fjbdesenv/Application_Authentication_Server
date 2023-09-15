import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

const URL = process.env.BANCO_URL || "mongodb://localhost:27017";
const DB_NAME = process.env.BANCO_NAME;

async function conexao() {
  try {
    const client = new MongoClient(URL);
    await client.connect();
    const db = client.db(DB_NAME);

    return { client, db };
  } catch (error: any) {
    throw error;
  }
}

async function desconectar(client: any) {
  client.close();
}

export { conexao, desconectar };
