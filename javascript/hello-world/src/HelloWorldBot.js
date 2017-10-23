'use strict';

let Lime = require('lime-js');
let request = require('request-promise');
let BlipHttpClient = require('./BlipHttpClient');

class HelloWorldBot {

    constructor(config) {
        this._bingApiKey = config.settings.bingApiKey;
        this._client = new BlipHttpClient(config.accessKey);
    }

    handleMessage(message) {
        // Obtem o conteudo da mensagem recebida pelo contato
        let text = message.content.toString();
    
        // Loga mensagem recebida
        console.log(`<< ${message.from}: ${message.content}`)
    
        // Cria uma nova mensagem para responder o usuario que enviou a mensagem.
        // O campo `to` da messagem deve ser igual ao campo `from` da mensagem recebida
        let response = {
            id: Lime.Guid(),
            to: message.from,
            content: `Hello World from Webhook`,
            type: 'text/plain'
        };
    
        // Responde a mensagem para o usuario
        return this._client.sendMessage(response);
    }
}

module.exports = HelloWorldBot;
