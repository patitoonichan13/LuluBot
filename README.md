<div align="center">
    <img src="./assets/images/lite-bot-logo.png" width="500">
</div>

<br />

<div align="center">
    <a href="https://github.com/guiireal/lite-bot">
        <img alt="Version" src="https://img.shields.io/badge/Vers%C3%A3o-1.0.0-blue">
    </a>
</div>

<br />

# Bot de WhatsApp minimalista multifunções

## Tecnologias envolvidas

- [Axios](https://axios-http.com/ptbr/docs/intro)
- [Baileys](https://github.com/WhiskeySockets/Baileys)
- [FFMPEG](https://ffmpeg.org/)
- [Node.js 20.17.0](https://nodejs.org/en)
- [Spider X API](https://api.spiderx.com.br)

## Instalação no Termux <a id="termux-setup"></a>

1 - Abra o Termux e execute os comandos abaixo.<br/>
_Não tem o Termux? [Clique aqui e baixe a última versão](https://www.mediafire.com/file/082otphidepx7aq/Termux_0.119.1_aldebaran_dev.apk)._

2 - Cole o seguinte código:

```sh
curl -O https://spiderx.com.br/lite-bot.sh && sh lite-bot.sh
```

3 - Se não tiver dado a permissão pra ler as pastas do dispositivo pelo termux, aceite quando aparecer o pop-up na tela, caso contrário, pressione `y`.

4 - Quando finalizar tudo, informe seu número de telefone.

5 - Coloque o código de pareamento em "dispositivos conectados" no WhatsApp, conforme explicado [nessa parte do vídeo](https://youtu.be/lBhpGuq5ETQ?t=76).

6 - Aguarde 10 segundos, depois digite `CTRL + C` 2x para parar o bot.

7 - Configure o arquivo `config.js`. O bot fica dentro da pasta `/sdcard/DevGui/lite-bot`.

```js
// Prefixo dos comandos
exports.PREFIX = "/";

// Emoji do bot (mude se preferir).
exports.BOT_EMOJI = "🤖";

// Nome do bot (mude se preferir).
exports.BOT_NAME = "Takeshi Bot";

// Número do bot. Coloque o número do bot (apenas números).
exports.BOT_NUMBER = "5511920202020";

// Número do dono do bot. Coloque o número do dono do bot (apenas números).
exports.OWNER_NUMBER = "5511999999999";
```

7 - Inicie o bot novamente, dentro da pasta `lite-bot`:
```sh
yarn start
```

ou

```sh
npm start
```

## Alguns comandos necessitam de API

Edite a linha `34` do arquivo `config.js` e cole sua api key da plataforma Spider X API.<br/>
Para obter seu token, acesse: [https://api.spiderx.com.br](https://api.spiderx.com.br) e crie sua conta gratuitamente!

```js
exports.SPIDER_API_TOKEN = "seu_token_aqui";
```
## Funcionalidades

| Função | Online? | Contexto | Requer a Spider X API?
| ------------ | --- | --- | ---
| Desligar o bot no grupo | ✅ | Dono | ❌
| Ligar o bot no grupo | ✅ | Dono | ❌
| Anti link | ✅ | Admin | ❌
| Banir membros | ✅ | Admin | ❌
| Ligar/desligar boas vindas | ✅ | Admin | ❌
| Marcar todos | ✅ | Admin | ❌
| Busca CEP | ✅ | Membro | ❌
| Figurinha de texto animada | ✅ | Membro | ✅
| Geração de imagens com IA | ✅ | Membro | ❌
| GPT 4 | ✅ | Membro | ✅
| Ping | ✅ | Membro | ❌
| Play áudio | ✅ | Membro | ✅
| Play vídeo | ✅ | Membro | ✅
| Sticker | ✅ | Membro | ❌

## Inscreva-se no canal!

<a href="https://www.youtube.com/@devgui_?sub_confirmation=1" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube"></a>

## Licença

[MIT](https://github.com/guiireal/takeshi-bot/blob/main/LICENSE)

## ⚠ Disclaimer

Neste projeto, precisei hospedar a node_modules, para auxiliar quem está rodando o bot pelo celular, pois muitos deles podem não rodar o `npm install` ou `yarn` pelo termux corretamente.
