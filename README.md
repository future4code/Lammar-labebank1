# Projeto em grupo - LabeBank

## 🔗 Link para acessar os endpoints do Postman
https://documenter.getpostman.com/view/22376488/2s8YmSsLe6

## 💻 Funcionalidades

:heavy_check_mark: Crie um **tipo** para representar uma conta para o usuário

:heavy_check_mark: Crie um array global que armazene usuários na aplicação. Caso queira, pode iniciar este array com valores pré-definidos.

:heavy_check_mark: Crie mais um **tipo**: para representar as **transações** que serão salvas no extrato

:heavy_check_mark: Dentro da definição do usuário, crie um array que armazene as transações de um cliente.

:heavy_check_mark: Crie um endpoint  que utilize o método `POST` da entidade `users` que será responsável por cadastrar um usuário em um array de usuários. Neste                            momento, não se preocupe, com as validações descritas nas funcionalidades.

:heavy_check_mark: Crie um método `GET` na entidade `users` função que será responsável por pegar todos os usuários existentes no array de usuários.

:heavy_check_mark: Adicione, uma validação no item 1 (Criar conta): o usuário deve possuir mais do que 18 anos para conseguir se cadastrar. Caso não possua, exiba uma                      mensagem de erro.

## ⭐ Extras

- Adicionado o endpoint que recebe um CPF como parâmetro e retorna o saldo da conta do usuário dono daquele CPF. A informação deve ser igual ao que estiver salvo no sistema. Se for diferente, exibe uma mensagem de erro.

- Adicionado o endpoint que recebe um nome, um CPF e um valor. Ele adiciona um extrato a conta do usuário, indicando o valor e a data da transação. O saldo do usuário não é atualizado neste momento. O nome e o CPF devem ser iguais ao que estiver salvo no sistema. Se algum dos dados for diferente, exibe uma mensagem de erro.

- Adicionado o endpoint que permite ao cliente pagar uma conta. Ele deve receber uma data de vencimento da conta, uma descrição, um valor e o CPF do titular e salvar uma transação no extrato da conta correspondente. O saldo do usuário não é atualizado neste momento. Caso nenhuma data seja passada, o pagamento é efetuado no mesmo dia. 
O usuário não pode colocar uma data que já passou ou pagar uma conta com o valor superior ao do seu saldo atual. 

- Adicionado o endpoint que permite a transferência entre duas contas do banco. O usuário deve informar o seu nome, o seu CPF, o nome do destinatário, o CPF do destinatário e o valor. Para cada transferência, cria um item do extrato para as duas contas envolvidas. Os saldos de ambas não são atualizados neste momento. 
O usuário não pode enviar uma quantia com o valor superior ao do seu saldo atual ou enviar de/para uma conta não existente. 

## 👩‍💻 Desenvolvedores:

- João Vitor Gomes Lara Resende.
- Rafael Gonçalves Quintanilha Guimarães.
- Nei Luis Duarte Tavares Junior.
