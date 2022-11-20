import express from "express"
import cors from "cors"
import { accounts } from './data';

const app = express();

app.use(express.json());

app.use(cors());


// CREATE ACCOUNT

app.post("/users", (req, res) => {

    let errorCode = 400
    const userName = req.body.name
    const userCpf = req.body.cpf
    const userBirthDate = req.body.birthDate

    try {
        if (!userName && !userCpf && !userBirthDate) {
            errorCode = 422
            throw new Error("O nome, cpf e data de nascimento do usuário não foram informados!");
        }
        if (!userName) {
            errorCode = 422
            throw new Error("O nome do usuário não foi informado!");
        }
        if (!userCpf) {
            errorCode = 422
            throw new Error("O cpf do usuário não foi informado!");
        }
        if (!userBirthDate) {
            errorCode = 422
            throw new Error("A data de nascimento do usuário não foi informada!");
        }
        if (typeof userName !== "string") {
            errorCode = 422
            throw new Error("O nome do usuário deve ser do tipo string!");
        }
        if (typeof userCpf !== "string") {
            errorCode = 422
            throw new Error("O cpf do usuário deve ser do tipo string!");
        }
        if (typeof userBirthDate !== "string") {
            errorCode = 422
            throw new Error("A data de nascimento do usuário deve ser do tipo string!");
        }
        if (userCpf.length !== 14 || userCpf[3] !== "." || userCpf[7] !== "." || userCpf[11] !== "-") {
            errorCode = 422
            throw new Error("O cpf deve ser no formato 000.000.000-00");
        }

        const findCpf = accounts.find(account => {
            return account.cpf === userCpf
        })

        if (findCpf) {
            errorCode = 409
            throw new Error("Já existe um usuário com este cpf!");
        }

        if (userBirthDate.length !== 10 || userBirthDate[2] !== "/" || userBirthDate[5] !== "/") {
            errorCode = 422
            throw new Error("A data deve ser no formato DD/MM/AAAA");
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

    let errorCode = 400
    const userCpf = req.query.cpf as string

    try {
        if (!userCpf) {
            errorCode = 422
            throw new Error("O cpf do usuário não foi informado!");
        }
        if (userCpf.length !== 14 || userCpf[3] !== "." || userCpf[7] !== "." || userCpf[11] !== "-") {
            errorCode = 422
            throw new Error("O cpf deve ser no formato 000.000.000-00");
        }

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

    let errorCode = 400

    const addFunds = req.body.value
    const userCpf = req.body.cpf
    const userName = req.body.name

    try {
        if (!userCpf && !userName && !addFunds) {
            errorCode = 422
            throw new Error("Preencha todos os campos corretamente!");
        }
        if (!userName) {
            errorCode = 422
            throw new Error("O nome do usuário não foi informado!");
        }
        if (!userCpf) {
            errorCode = 422
            throw new Error("O cpf do usuário não foi informado!");
        }
        if (!addFunds) {
            errorCode = 422
            throw new Error("O valor do depósito não foi informado!");
        }
        if (typeof userName !== "string") {
            errorCode = 422
            throw new Error("O nome do usuário deve ser do tipo string!");
        }
        if (typeof userCpf !== "string") {
            errorCode = 422
            throw new Error("O cpf do usuário deve ser do tipo string!");
        }
        if (userCpf.length !== 14 || userCpf[3] !== "." || userCpf[7] !== "." || userCpf[11] !== "-") {
            errorCode = 422
            throw new Error("O cpf deve ser no formato 000.000.000-00");
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

        res.status(200).send(`Deposito efetuado com sucesso, seu novo saldo é: R$ ${addFunds + findedUser.balance}`)
    } catch (e: any) {
        res.status(errorCode).send(e.message)
    }

})


// ---------------------- SERVER RESPONSE --------------------------- //

app.listen(3003, () => {
    console.log("Server is running in http://localhost:3003");
});

