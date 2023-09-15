export interface Usuario {
    codigo?: string | undefined,
    nivel?: number | undefined,
    nome?: string | undefined,
    email?: string | undefined,
    senha?: string | undefined,
    data_criacao: string,
    data_atualizacao: string
};