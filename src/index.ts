import express from "express"
import cors from "cors"
import { accounts } from './data';

const app = express();

app.use(express.json());

app.use(cors());


// CREATE ACCOUNT

app.post("/accounts", (req, res) => {

    let errorCode = 400
    const userName = req.body.name
    const userCpf = req.body.cpf
    const userBirthDate = req.body.birthDate

    try {
        if (!userName && !userCpf && !userBirthDate) {
            errorCode = 422
            throw new Error("O nome, cpf e data de nascimento do usuário da conta não foram informados!");
        }
        if (!userName) {
            errorCode = 422
            throw new Error("O nome do usuário da conta não foi informado!");
        }
        if (!userCpf) {
            errorCode = 422
            throw new Error("O cpf do usuário da conta não foi informado!");
        }
        if (!userBirthDate) {
            errorCode = 422
            throw new Error("A data de nascimento do usuário da conta não foi informado!");
        }
        if (typeof userName !== "string") {
            errorCode = 422
            throw new Error("O nome do usuário da conta deve ser do tipo string!");
        }
        if (typeof userCpf !== "string") {
            errorCode = 422
            throw new Error("O cpf do usuário da conta deve ser do tipo string!");
        }
        if (typeof userBirthDate !== "string") {
            errorCode = 422
            throw new Error("A data de nascimento do usuário da conta deve ser do tipo string!");
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
            throw new Error("A idade do usuário deve ser maior ou igual a 18 anos");
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


// ---------------------- SERVER RESPONSE ---------------------------- //

app.listen(3003, () => {
    console.log("Server is running in http://localhost:3003");
});