interface Resume {
    dados:Dados
    objetivo:string,
    formacoes: Formacoes[],
    experiencias: Experiencias[],    
    habilidades:string
}

interface Dados {
    nome:string,
    idade:number,
    nacionalidade:string,
    estadoCivil:string,
    cnh:string,
    email:string,
    cep:number,
    cidade:string,
    bairro: string,
    estado:string,
    logradouro:string,
    telefone:number,
    celular:number    
}

interface Objetivo {
    titulo:string
}

interface Experiencias {
    funcao:string,
    empresa:string,
    Inicio:Date,
    Termino:Date,
    descricao:string
}

interface Formacoes {
    escolaridade:string,
    instituto:string,
    inicio:string,
    termino:string,
    status:string

}

