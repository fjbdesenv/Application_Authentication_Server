import { Nivel } from "./Nivel";
import { Usuario } from "./Usuario";

export interface Aplicacao {
    codigo?: string | undefined,
    nome?: string | undefined,
    email?: string | undefined,
    senha?: string | undefined,
    token?: string | undefined,
    usuarios: Array<Usuario>,
    nivel: Array<Nivel>,
    data_criacao: string,
    data_atualizacao: string
};