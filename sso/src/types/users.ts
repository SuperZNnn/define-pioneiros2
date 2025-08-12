export type User = {
    id: number;
    fullname: string;
    cpf?: string;
    rg?: string;
    telefone?: string | boolean;
    telefone_responsavel?: string | boolean;
    email?: string | boolean;
    email_responsavel?: string | boolean;
    responsavel?: string;
    mae?: string;
    pai?: string;
    nascimento: Date;
    funcao: string;
    genero: string;
    photo?: string;
    reg: number;
    status: number;
    pix: string;
};
export type DisplayInfo = {
    display_name: string;
    origin_id: number;
};
