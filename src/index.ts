import express from "express"
import cors from "cors"
import { accounts } from './data';

const app = express();

app.use(express.json());

app.use(cors());


// FUNCTIONS    

const compareDates = (billDate: string): string => {
    let response: string;
    const today = new Date();
    const year = today.getFullYear() - Number(billDate.substring(6, 10));
    const month = (today.getMonth() + 1) - Number(billDate.substring(3, 5));
    const day = today.getDate() - Number(billDate.substring(0, 2));
    if (year < 0) {
        response = "ok"
    } else if (year > 0) {
        response = "not ok"
    } else {
        if (month < 0) {
            response = "ok"
        } else if (month > 0) {
            response = "not ok"
        } else {
            if (day < 0) {
                response = "ok"
            } else if (day > 0) {
                response = "not ok"
            } else {
                response = "same date"
            }
        }
    }
    return response;
}

let errorCode = 400;

const validateCpf = (cpf: any): any => {
    if (!cpf) {
        errorCode = 422
        throw new Error("O cpf do usuário não foi informado!");
    }
    if (typeof cpf !== "string") {
        errorCode = 422
        throw new Error("O cpf do usuário deve ser do tipo string!");
    }
    if (cpf.length !== 14 || cpf[3] !== "." || cpf[7] !== "." || cpf[11] !== "-") {
        errorCode = 422
        throw new Error("O cpf do usuário deve ser no formato 000.000.000-00");
    }
}

const validateName = (name: any): any => {
    if (!name) {
        errorCode = 422
        throw new Error("O nome do usuário não foi informado!");
    }
    if (typeof name !== "string") {
        errorCode = 422
        throw new Error("O nome do usuário deve ser do tipo string!");
    }
}

const validateDate = (date: any): any => {
    if (!date) {
        errorCode = 422
        throw new Error("A data de nascimento do usuário não foi informada!");
    }
    if (typeof date !== "string") {
        errorCode = 422
        throw new Error("A data de nascimento do usuário deve ser do tipo string!");
    }
    if (date.length !== 10 || date[2] !== "/" || date[5] !== "/") {
        errorCode = 422
        throw new Error("A data deve ser no formato DD/MM/AAAA");
    }
}

// CREATE ACCOUNT

app.post("/users", (req, res) => {

    const userName = req.body.name
    const userCpf = req.body.cpf
    const userBirthDate = req.body.birthDate

    try {
        if (!userName && !userCpf && !userBirthDate) {
            errorCode = 422
            throw new Error("O nome, cpf e data de nascimento do usuário não foram informados!");
        }

        validateName(userName)

        validateCpf(userCpf)

        validateDate(userBirthDate)

        const findCpf = accounts.find(account => {
            return account.cpf === userCpf
        })

        if (findCpf) {
            errorCode = 409
            throw new Error("Já existe um usuário com este cpf!");
            
        }

        const getAge = (birthDate: string): number => {
            const today = new Date();
            let age = today.getFullYear() - Number(birthDate.substring(6, 10));
            const m = (today.getMonth() + 1) - Number(birthDate.substring(3, 5));
            if (m < 0 || (m === 0 && today.getDate() < Number(birthDate.substring(0, 2)))) {
                age--;
            }
            return age;
        }

        if (getAge(userBirthDate) < 18) {
            errorCode = 401
            throw new Error("A idade do usuário deve ser maior ou igual a 18 anos!");
        }

        accounts.push({
            name: userName,
            cpf: userCpf,
            birthDate: userBirthDate,
            balance: 0,
            statement: []
        })

        res.status(201).send(accounts)

    } catch (e: any) {
        res.status(errorCode).send(e.message)
    }
})

// GET USERS

app.get("/users", (req, res) => {

    const showUsers = accounts.map(account => {
        return account
    })

    res.status(200).send(showUsers)

})


// GET BALANCE

app.get('/balance', (req, res) => {

    const userCpf = req.query.cpf as string

    try {

        validateCpf(userCpf)

        const getBalance = accounts.find((account) => {
            return account.cpf === userCpf
        })

        if (!getBalance) {
            errorCode = 404
            throw new Error("Conta não encontrada!");
        }

        res.status(200).send(`O saldo da conta é: R$ ${getBalance.balance}`)
    } catch (e: any) {
        res.status(errorCode).send(e.message)
    }

})

// PUT DEPOSIT

app.put('/deposit', (req, res) => {

    const addFunds = req.body.value
    const userCpf = req.body.cpf
    const userName = req.body.name

    try {
        if (!userCpf && !userName && !addFunds) {
            errorCode = 422
            throw new Error("O cpf, o nome e o valor não foram informados!");
        }

        validateCpf(userCpf)

        validateName(userName)

        if (!addFunds) {
            errorCode = 422
            throw new Error("O valor do depósito não foi informado!");
        }

        if (typeof addFunds !== "number") {
            errorCode = 422
            throw new Error("O valor do depósito deve ser do tipo number!");
        }

        if (addFunds <= 0) {
            errorCode = 422
            throw new Error("O depósito não pode ser manor ou igual a zero. Favor inserir um número maior que zero.");
        }

        const findedUser = accounts.find((account) => {
            return account.cpf === userCpf && account.name === userName
        })

        if (!findedUser) {
            errorCode = 404
            throw new Error("Conta não encontrada!");
        }

        findedUser.statement.push(
            {
                value: addFunds,
                date: new Date().toISOString().slice(0, 10).split("-").reverse().join("/"),
                description: "Depósito de dinheiro"
            }
        )

        res.status(201).send(`Depósito efetuado com sucesso!`)
    } catch (e: any) {
        res.status(errorCode).send(e.message)
    }

})

// PAY A BILL

app.post('/bill', (req, res) => {

    const billExpirationDate = req.body.expiration
    const billDescription = req.body.description
    const userCpf = req.body.cpf
    const billValue = req.body.value

    try {
        if (!userCpf && !billDescription && !billValue) {
            errorCode = 422
            throw new Error("O cpf, a data de vencimento e o valor da conta não foram informados!");
        }
        if (!billDescription) {
            errorCode = 422
            throw new Error("A descrição da conta não foi informada!");
        }
        if (!billValue) {
            errorCode = 422
            throw new Error("O valor da conta não foi informado!");
        }

        validateCpf(userCpf)

        if (typeof billDescription !== "string") {
            errorCode = 422
            throw new Error("A descrição deve ser do tipo string!");
        }
        if (typeof billValue !== "number") {
            errorCode = 422
            throw new Error("O valor da conta deve ser do tipo number!");
        }

        const findedUser = accounts.find((account) => {
            return account.cpf === userCpf
        })

        if (!findedUser) {
            errorCode = 404
            throw new Error("Conta não encontrada!");
        }

        if (!billExpirationDate) {
            findedUser.statement.push(
                {
                    value: billValue,
                    date: new Date().toISOString().slice(0, 10).split("-").reverse().join("/"),
                    description: billDescription
                }
            )
            res.status(201).send(`Pagamento feito com sucesso!`)
        }

        if (typeof billExpirationDate !== "string") {
            errorCode = 422
            throw new Error("A data de nascimento do usuário deve ser do tipo string!");
        }

        if (billExpirationDate.length !== 10 || billExpirationDate[2] !== "/" || billExpirationDate[5] !== "/") {
            errorCode = 422
            throw new Error("A data deve ser no formato DD/MM/AAAA");
        }

        if (compareDates(billExpirationDate) === "not ok") {
            errorCode = 422
            throw new Error("A data não pode ser anterior a de hoje.");
        }

        if (billValue > findedUser.balance) {
            errorCode = 422
            throw new Error("O valor da conta não pode ser maior que o saldo.");
        }

        findedUser.statement.push(
            {
                value: billValue,
                date: billExpirationDate,
                description: billDescription
            }
        )

        if (compareDates(billExpirationDate) === "same date") {
            res.status(201).send(`Pagamento feito com sucesso!`)
        } else {
            res.status(201).send(`Pagamento agendado com sucesso!`)
        }

    } catch (e: any) {
        res.status(errorCode).send(e.message)
    }
})

// UPDATE BALANCE

app.put('/updateBalance', (req, res) => {

    const userCpf = req.body.cpf

    try {
        validateCpf(userCpf);

        const findedUser = accounts.find(account => {
            return account.cpf === userCpf;
        })

        if (!findedUser) {
            errorCode = 404
            throw new Error("Usuário não encontrado!");
        }

        accounts.forEach((account) => {
            if (account.cpf === userCpf) {
                let newBalance = 0;
                account.statement.forEach(transaction => {
                    if (compareDates(transaction.date) === "not ok" || compareDates(transaction.date) === "same date") {
                        newBalance += transaction.value
                    }
                })
                account.balance = newBalance;
            }
        })
        res.status(201).send("Saldo atualizado com sucesso!")
    } catch (e: any) {
        res.status(errorCode).send(e.message)
    }

})

// TRANSFER BETWEEN ACCOUNTS

app.post('/transfer', (req, res) => {

    const { userName, userCpf, receiverName, receiverCpf, value } = req.body

    try {
        if (!userName && !userCpf && !receiverName && !receiverCpf && !value) {
            errorCode = 422
            throw new Error("O nome do usuário, o cpf do usuário, o nome do destinatário, o cpf do destinatário e o valor da transferência não foram informados!");
        }

        validateName(userName)

        validateCpf(userCpf)

        if (!receiverName) {
            errorCode = 422
            throw new Error("O nome do destinatário não foi informado!");
        }
        if (typeof receiverName !== "string") {
            errorCode = 422
            throw new Error("O nome do destinatário deve ser do tipo string!");
        }
        if (!receiverCpf) {
            errorCode = 422
            throw new Error("O cpf do destinatário não foi informado!");
        }
        if (typeof receiverCpf !== "string") {
            errorCode = 422
            throw new Error("O cpf do destinatário deve ser do tipo string!");
        }
        if (receiverCpf.length !== 14 || receiverCpf[3] !== "." || receiverCpf[7] !== "." || receiverCpf[11] !== "-") {
            errorCode = 422
            throw new Error("O cpf do destinatário deve ser no formato 000.000.000-00");
        }
        if (!value) {
            errorCode = 422
            throw new Error("O valor da transferência não foi informado!");
        }
        if (typeof value !== "number") {
            errorCode = 422
            throw new Error("O valor da transferência deve ser do tipo number!");
        }
        if (value <= 0) {
            errorCode = 422
            throw new Error("O valor da transferência não pode ser manor ou igual a zero. Favor inserir um número maior que zero.");
        }

        const findedUser = accounts.find((account) => {
            return account.cpf === userCpf && account.name === userName
        })

        const findedReceiver = accounts.find(account => {
            return account.cpf === receiverCpf && account.name === receiverName
        })

        if (!findedUser) {
            errorCode = 404
            throw new Error("Usuário não encontrado!");
        }

        if (!findedReceiver) {
            errorCode = 404
            throw new Error("Destinatário não encontrado!");
        }

        if (value > findedUser.balance) {
            errorCode = 422
            throw new Error("O valor da transferência não pode ser maior que o saldo.");
        }

        accounts.forEach(account => {
            if (account.cpf === userCpf) {
                account.statement.push(
                    {
                        value: -value,
                        date: new Date().toISOString().slice(0, 10).split("-").reverse().join("/"),
                        description: "Transferência"
                    }
                )
            }
            if (account.cpf === receiverCpf) {
                account.statement.push(
                    {
                        value: value,
                        date: new Date().toISOString().slice(0, 10).split("-").reverse().join("/"),
                        description: "Transferência"
                    }
                )
            }
        })

        res.status(201).send("Transferência realizada com sucesso!")

    } catch (e: any) {
        res.status(errorCode).send(e.message)
    }
})


// ---------------------- SERVER RESPONSE --------------------------- //

app.listen(3003, () => {
    console.log("Server is running in http://localhost:3003");
});

