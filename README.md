# Projeto Desafio Integração Dev API
Projeto desenvolvido no módulo de Back End da [Trybe](https://www.betrybe.com/). 

## ✏ Informações sobre o projeto
O objetivo deste projeto de Back End foi criar uma integração entre as APIs do Google Sheets e Hubspot CRM.
- Foi criado um script que possibilita, após inserção de dados em uma planilha online do Google Sheets, transferir aquelas informações de contato para a plataforma do Hubspot.
- A solução foi feita de forma <strong>serverless</strong>, de forma que não foi necessária a implementação de uma API, aumentando a eficiência da aplicação.

## ⚙ Instruções para rodar o projeto em sua máquina

<strong>1. Fazer o git clone na sua máquina e entrar no diretório:</strong>
 - Lembre-se de clonar o repositório no diretório desejado na sua máquina!
 ```
 git clone git@github.com:d4n13ln13ls3n/Desafio-Integracao-DANIEL-YABU-.git
 cd Desafio-Integracao-DANIEL-YABU-

<strong>2. Acessar o link https://app.hubspot.com/ com o login e senha recebidos por email e acessar a aba Contatos em https://app.hubspot.com/user-guide/23983704?via=home:</strong>

<strong>3. Acessar o link https://docs.google.com/spreadsheets/d/1lWfM4N7EXb6wyZ6IR0bsXftS_iv3fqA18Ea0dEcrHDg/edit#gid=0 para acessar a planilha de testes:</strong>
- Inserir os dados do contato que quer acrescentar aos contatos do Hubspot.
- Lembrar-se de não inserir um email comercial(Yahoo, Hotmail, Gmail, etc.) Apenas emails corporativos são válidos para a aplicação.
- PS: a aplicação funciona também com outras Google Sheets, desde que a estrutura seja a mesma (o mesmo cabeçalho).

<strong>4. - Após realizar o passo 3, rodar o seguinte comando no terminal: </strong>
GOOGLE_API_KEY='chave recebida por email' HUBSPOT_API_KEY='chave recebida por email' node index.js 'id da planilha recebida por email' customers
- Observar se os contatos inseridos na Google Sheet aparecem na lista de contatos do Hubspot.
- Caso não apareçam, atualizar a página ou clicar em outra aba e depois voltar à aba de Contatos.

<strong>5. - Fazer logout da conta no Hubspot.</strong>
 
## 🛸 Principais tecnologias utilizadas / Main technologies used: 
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript);
- [Node.js](https://nodejs.org/en/);
