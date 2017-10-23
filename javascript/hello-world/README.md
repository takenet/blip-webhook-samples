## Introdução

Neste tutorial vamos criar um bot que responde "Hello World" para qualquer entrada de texto utilizando o modo de integração Webhook da plataforma [BLiP](https://blip.ai).

## Passo 1 - Criando o projeto

Para este projeto iremos utilizar o [node.js](https://nodejs.org/). Para criar um projeto node, basta criar um diretório qualquer e executar o comando `npm init` neste diretório.

Após criado o projeto node, precisamos instalar os pacotes de dependências que iremos utilizar. Para utilizar Webhooks, precisamos fazer chamadas HTTP no endereço `https://msging.net/messages`, portanto serão necessários os pacotes `request` e `request-promise`.

Para instalar estas dependências basta executar o seguinte comando:

```bash
npm install --save request request-promise uuid
```

Para mais informações acessar a documentação: https://portal.blip.ai/#/docs/home

## Passo 2 - Configurando o Bot

Como estamos criando um Bot que utilizará os recursos Webhook do blip.ai, precisamos obter uma chave de acesso e urls para recebimento e envio de mensagens. Para isto, acesse o portal http://blip.ai e registre o seu contato utilizando a opção Webhook. Após a criação do seu contato você encontrará as informações necessárias para o desenvolvimento do bot no menu configuração. Guarde o **Cabeçalho de autenticação**, pois ele será necessário para enviar mensagens.

Com isso já temos um Bot conectado à plataforma que consegue enviar e receber mensagens. Para habilitar o seu contato nos canais, basta acessar o menu **Publicações** e escolher o canal onde deseja publicar seu contato (no site [blip.ai](https://blip.ai/) há um guia sobre a ativação dos canais).

## Passo 3 - Mão na massa

Primeiramente precisamos criar um servidor HTTP Node que recebe as mensagens através da url para receber mensagens que configuramos no passo 2.

```javascript
const SERVER_PORT = process.env.PORT || 3000;

let server = http.createServer((req, res) => {
    // Por definição, no pacote http, o corpo da requisição é recebido separado
    // em chunks, portanto precisamos reconstruí-lo.
    let body = [];
    req.on('data', (chunk) => body.push(chunk));

    req.on('end', () => {
        // Converte a string recebida como corpo da requisição para uma mensagem JSON
        let message = JSON.parse(body.toString());

        // Trata as mensagens recebidas
        handleMessage(req);

        res.end();
    });
});

server.listen(SERVER_PORT, () => {
    console.log(`Server is listening on port ${SERVER_PORT}`);
});
```

Como próximo passo, precisamos abstrair o envio de mensagens. Para isto vamos criar uma classe `BlipHttpClient` que, suprida com a urls para envio de mensagens e a chave de acesso do bot, envia mensagens através de requisições HTTP:

```javascript
let request = require('request-promise');
const MESSAGES_URL = 'https://msging.net/messages';

class BlipHttpClient {

    // O cabeçalho de autenticação obtido ao configurar o Bot será passado para este construtor
    constructor(authHeader) {
        this._authHeader = `Key ${authHeader}`;
    }

    sendMessage(message) {
        return request({
            method: 'POST',
            uri: MESSAGES_URL,
            headers: {
                'Content-type': 'application/json',
                'Authorization': this._authHeader
            },
            body: message,
            json: true
        });
    }
}
```
O que nos resta agora é efetivamente tratar as mensagens recebidas, isto é, definir a função `handleMessage` utilizada no servidor HTTP definido acima. Esta função apenas responde `Hello world` para qualquer texto recebido.

```javascript
// Substitua {SEU_CABECALHO_DE_AUTENTICACAO} pelo cabeçalho de autenticação obtido ao criar seu Bot no Painel Blip
let client = new BlipHttpClient('{SEU_CABECALHO_DE_AUTENTICACAO}');

function handleMessage(message) {
    if (message.type !== 'text/plain') {
        return;
    }

    // Obtem o conteudo da mensagem recebida pelo contato
    let text = message.content.toString();

    // Loga mensagem recebida
    console.log(`<< ${m.from}: ${m.content}`)

    // Cria uma nova mensagem para responder o usuario que enviou a mensagem.
    // O campo `to` da messagem deve ser igual ao campo `from` da mensagem recebida
    let response = {
        id: Lime.Guid(),
        to: message.from,
        content: `Hello World from Webhook`,
        type: 'text/plain'
    };

    // Responde a mensagem para o usuario
    return client.sendMessage(response);
}
```

## Passo 5 - Hospedando o Bot

Por ser uma aplicação Node.js, o Bot criado deve ser hospedado em um servidor de hospedagem que seja compatível com esta ferramenta. Alguns bons exemplos de serviços de hospedagem gratuitos para Node.js incluem [Heroku](https://www.heroku.com/), [Nodejitsu](https://www.nodejitsu.com/) e [Microsoft Azure](https://azure.microsoft.com/).

Após hospedar seu bot, você deve ainda incluir sua **URL para receber mensagens** nas configurações do seu Bot no [Painel Blip](https://blip.ai/portal/) como a URL onde seu bot está hospedado.

## License

[Apache 2.0 License](https://github.com/takenet/messaginghub-client-csharp/blob/master/LICENSE)
