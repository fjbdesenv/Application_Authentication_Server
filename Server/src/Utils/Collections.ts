export const Collections = {
    autoIncrement: {
        name: "auto_increment",
        fields: ["codigo", "aplicacao", "usuario", "nivel"]
    },
    aplicacao: {
        name: "aplicacao",
        fields: ["nome", "email", "senha"]
    },
    nivel: {
        name: "niveis",
        fields: ["tipo", "descricao", "valor"]
    }
};