export type User = {
    id: number,
    fullname: string,
    cpf?: string,
    rg?: string,
    telefone?: string | boolean,
    telefone_responsavel?: string | boolean,
    email?: string | boolean,
    email_responsavel?: string | boolean,
    responsavel?: string,
    mae?: string,
    pai?: string,
    nascimento: Date,
    funcao: string,
    genero: string,
    photo?: string,
    reg: number,
    status: number,
    sgc_code: number,
    pix: string,
    unidade: number
}
export type DisplayInfo = {
    display_name: string
    origin_id: number
    photo?:string 
}
export type CepReturn = {
    bairro: string
    cep: string
    complemento: string
    ddd: string
    estado: string
    gia: string,
    ibge: string,
    localidade: string,
    logradouro: string,
    regiao: string,
    siafi: string,
    uf: string,
    unidade: string
}

export const AdmFuncs = ['Diretor', 'Diretora', 'Diretor Associado', 'Diretora Associada', 'Secretário', 'Secretária']