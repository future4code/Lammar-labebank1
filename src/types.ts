type Transaction = {
    value: number,
    date: string,
    description: string
}

export type Account = {
    name: string,
    cpf: string,
    birthDate: string,
    balance: number,
    statement: Transaction[]
}