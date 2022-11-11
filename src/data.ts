import * as type from './types'

export const accounts: type.Account[] = [
    {
        name: "Pedro",
        cpf: "012.325.252-05",
        birthDate: "09/05/1999",
        balance: 0,
        statement:[]
    },
    {
        name: "João",
        cpf: "252.715.782-02",
        birthDate: "05/12/1970",
        balance: 4000,
        statement: [
            {
                value: 6000,
                date: "20/10/2022",
                description: "Deposit"
            },
            {
                value: -1000,
                date: "22/09/2022",
                description: "Withdraw"
            },
            {
                value: -1000,
                date: "22/08/2022",
                description: "Withdraw"
            },
        ]
        
    },
    {
        name: "Maria",
        cpf: "712.111.254-15",
        birthDate: "05/05/1949",
        balance: 1500,
        statement: [
            {
                value: 3000,
                date: "20/10/2022",
                description: "Deposit"
            },
            {
                value: -1000,
                date: "12/10/2022",
                description: "Withdraw"
            },
            {
                value: -500,
                date: "20/09/2022",
                description: "Withdraw"
            },
        ]
    },
    {
        name: "Bianca",
        cpf: "092.942.251-12",
        birthDate: "05/05/1991",
        balance: 120000,
        statement: [
            {
                value: -30000,
                date: "10/08/2022",
                description: "Payment"
            },
            {
                value: 50000,
                date: "12/07/2022",
                description: "Transfer"
            },
            {
                value: 100000,
                date: "01/05/2022",
                description: "Deposit"
            },
        ]    },
    {
        name: "Mateus",
        cpf: "541.325.981-27",
        birthDate: "05/05/1959",
        balance: 0,
        statement: []
    },
    {
        name: "Sheila",
        cpf: "712.981.001-05",
        birthDate: "05/05/1994",
        balance: 2500000,
        statement: [
            {
                value: 1500000,
                date: "20/10/2022",
                description: "Deposit"
            },
            {
                value: 500000,
                date: "12/04/2022",
                description: "Deposit"
            },
            {
                value: 1000000,
                date: "20/02/2022",
                description: "Withdraw"
            },
            {
                value: 1000000,
                date: "20/01/2022",
                description: "Deposit"
            },
            {
                value: 500000,
                date: "02/01/2022",
                description: "Deposit"
            },
        ]
    },
    {
        name: "Jorge",
        cpf: "231.981.271-90",
        birthDate: "05/05/1943",
        balance: 0,
        statement: []
    },
    {
        name: "Fernanda",
        cpf: "341.763.817-98",
        birthDate: "05/05/1999",
        balance: 1000,
        statement: [
            {
                value: 400,
                date: "02/04/2022",
                description: "Deposit"
            },
            {
                value: 100,
                date: "02/02/2022",
                description: "Deposit"
            },
            {
                value: 300,
                date: "02/01/2022",
                description: "Deposit"
            },
            {
                value: 200,
                date: "01/01/2022",
                description: "Deposit"
            },
        ]
    },
    {
        name: "Natalia",
        cpf: "641.844.321-12",
        birthDate: "05/05/1999",
        balance: 100,
        statement: []
    }
]