/**
 * Funções comuns que são exportadas para facilitar o uso no index.js.
 *
 * Dev Gui </>
 */
const { downloadContentFromMessage } = require("baileys");
const { TEMP_DIR } = require("../config");
const path = require("path");
const { writeFile } = require("fs/promises");
const axios = require("axios");

exports.loadLiteFunctions = ({ lite, update }) => {
  console.log(update);

  return {};
};

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function onlyLettersAndNumbers(text) {
  return text.replace(/[^a-zA-Z0-9]/g, "");
}

function removeAccentsAndSpecialCharacters(text) {
  if (!text) {
    return "";
  }

  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function onlyNumbers(text) {
  return text.replace(/[^0-9]/g, "");
}

exports.splitByCharacters = (str, characters) => {
  characters = characters.map((char) => (char === "\\" ? "\\\\" : char));
  const regex = new RegExp(`[${characters.join("")}]`);

  return str
    .split(regex)
    .map((str) => str.trim())
    .filter(Boolean);
};

exports.formatCommand = (text) => {
  return onlyLettersAndNumbers(
    removeAccentsAndSpecialCharacters(text.toLocaleLowerCase().trim())
  );
};

exports.baileysIs = (webMessage, context) => {
  return !!this.getContent(webMessage, context);
};

exports.getContent = (webMessage, context) => {
  return (
    webMessage.message?.[`${context}Message`] ||
    webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[
      `${context}Message`
    ]
  );
};

exports.download = async (webMessage, fileName, context, extension) => {
  const content = this.getContent(webMessage, context);

  if (!content) {
    return null;
  }

  const stream = await downloadContentFromMessage(content, context);

  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  const filePath = path.resolve(TEMP_DIR, `${fileName}.${extension}`);

  await writeFile(filePath, buffer);

  return filePath;
};

exports.toUserJid = (number) => `${onlyNumbers(number)}@s.whatsapp.net`;

exports.getBuffer = (url, options) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url,
      headers: {
        DNT: 1,
        "Upgrade-Insecure-Request": 1,
        range: "bytes=0-",
      },
      ...options,
      responseType: "arraybuffer",
      proxy: options?.proxy || false,
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

exports.getRandomName = (extension) => {
  const fileName = getRandomNumber(0, 999999);

  if (!extension) {
    return fileName.toString();
  }

  return `${fileName}.${extension}`;
};

exports.onlyLettersAndNumbers = onlyLettersAndNumbers;
exports.removeAccentsAndSpecialCharacters = removeAccentsAndSpecialCharacters;
exports.getRandomNumber = getRandomNumber;
exports.onlyNumbers = onlyNumbers;
