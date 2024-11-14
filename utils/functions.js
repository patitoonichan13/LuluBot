/**
 * Funções comuns que são exportadas
 * para facilitar o uso no index.js.
 * Não suje seu index.js com
 * muitas linhas de código,
 * separe as funções em arquivos separados.
 *
 * @author Dev Gui </>
 */
const { downloadContentFromMessage } = require("baileys");
const {
  TEMP_DIR,
  PREFIX,
  BOT_EMOJI,
  OWNER_NUMBER,
  ASSETS_DIR,
} = require("../config");
const path = require("node:path");
const fs = require("node:fs");
const { writeFile } = require("node:fs/promises");
const axios = require("axios");
const { errorLog } = require("./terminal");

function loadLiteFunctions({ socket: lite, data }) {
  if (!data?.messages?.length) {
    return null;
  }

  const info = data.messages[0];

  const {
    args,
    body,
    command,
    from,
    fullArgs,
    isReply,
    prefix,
    replyJid,
    userJid,
  } = extractDataFromInfo(info);

  if (!from) {
    return null;
  }

  const isImage = baileysIs(info, "image");
  const isVideo = baileysIs(info, "video");
  const isSticker = baileysIs(info, "sticker");

  const downloadImage = async (info, fileName) => {
    return await download(info, fileName, "image", "png");
  };

  const downloadSticker = async (info, fileName) => {
    return await download(info, fileName, "sticker", "webp");
  };

  const downloadVideo = async (info, fileName) => {
    return await download(info, fileName, "video", "mp4");
  };

  const sendText = async (text, mentions) => {
    let optionalParams = {};

    if (mentions?.length) {
      optionalParams = { mentions };
    }

    return await lite.sendMessage(from, {
      text: `${BOT_EMOJI} ${text}`,
      ...optionalParams,
    });
  };

  const reply = async (text) => {
    return await lite.sendMessage(
      from,
      { text: `${BOT_EMOJI} ${text}` },
      { quoted: info }
    );
  };

  const react = async (emoji) => {
    return await lite.sendMessage(from, {
      react: {
        text: emoji,
        key: info.key,
      },
    });
  };

  const successReact = async () => {
    return await react("✅");
  };

  const waitReact = async () => {
    return await react("⏳");
  };

  const warningReact = async () => {
    return await react("⚠️");
  };

  const errorReact = async () => {
    return await react("❌");
  };

  const successReply = async (text) => {
    await successReact();
    return await reply(`✅ ${text}`);
  };

  const waitReply = async (text) => {
    await waitReact();
    return await reply(`⏳ Aguarde! ${text || waitMessage}`);
  };

  const warningReply = async (text) => {
    await warningReact();
    return await reply(`⚠️ Atenção! ${text}`);
  };

  const errorReply = async (text) => {
    await errorReact();
    return await reply(`❌ Erro! ${text}`);
  };

  const stickerFromFile = async (file) => {
    return await lite.sendMessage(
      from,
      {
        sticker: fs.readFileSync(file),
      },
      { quoted: info }
    );
  };

  const stickerFromURL = async (url) => {
    return await lite.sendMessage(
      from,
      {
        sticker: { url },
      },
      { url, quoted: info }
    );
  };

  const imageFromFile = async (file, caption = "") => {
    return await lite.sendMessage(
      from,
      {
        image: fs.readFileSync(file),
        caption: caption ? `${BOT_EMOJI} ${caption}` : "",
      },
      { quoted: info }
    );
  };

  const imageFromURL = async (url, caption = "") => {
    return await lite.sendMessage(
      from,
      {
        image: { url },
        caption: caption ? `${BOT_EMOJI} ${caption}` : "",
      },
      { url, quoted: info }
    );
  };

  const audioFromURL = async (url) => {
    return await lite.sendMessage(
      from,
      {
        audio: { url },
        mimetype: "audio/mp4",
      },
      { url, quoted: info }
    );
  };

  const videoFromURL = async (url) => {
    return await lite.sendMessage(
      from,
      {
        video: { url },
      },
      { url, quoted: info }
    );
  };

  const checkUserRole = async (jid, type) => {
    try {
      const { participants, owner } = await lite.groupMetadata(from);

      const participant = participants.find(
        (participant) => participant.id === jid
      );

      if (!participant) {
        return false;
      }

      const isOwner =
        participant.id === owner || participant.admin === "superadmin";

      const isAdmin = participant.admin === "admin";

      const isBotOwner =
        userJid === `${onlyNumbers(OWNER_NUMBER)}@s.whatsapp.net`;

      if (type === "owner") {
        return isOwner || isBotOwner;
      }

      if (type === "admin") {
        return isOwner || isBotOwner || isAdmin;
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  const isAdmin = async (jid) => checkUserRole(jid, "admin");
  const isOwner = async (jid) => checkUserRole(jid, "owner");

  const deleteMessage = async (from, info) => {
    await lite.sendMessage(from, {
      delete: {
        from,
        fromMe: false,
        id: info.key.id,
        participant: info.key.participant,
      },
    });
  };

  const ban = async (from, userJid) => {
    await lite.groupParticipantsUpdate(from, [userJid], "remove");
  };

  const getProfileImageData = async (userJid) => {
    let profileImage = "";
    let buffer = null;
    let success = true;

    try {
      profileImage = await lite.profilePictureUrl(userJid, "image");

      buffer = await getBuffer(profileImage);

      const tempImage = path.resolve(TEMP_DIR, getRandomName("png"));

      fs.writeFileSync(tempImage, buffer);

      profileImage = tempImage;
    } catch (error) {
      success = false;

      profileImage = path.resolve(ASSETS_DIR, "images", "default-user.png");

      buffer = fs.readFileSync(profileImage);
    } finally {
      setTimeout(() => {
        fs.unlink(profileImage, (error) => {
          if (error) {
            console.error("Error deleting profile image:", error);
          }
        });
      }, 30_000);
    }

    return { buffer, profileImage, success };
  };

  return {
    args,
    body,
    command,
    from,
    fullArgs,
    info,
    isImage,
    isReply,
    isSticker,
    isVideo,
    lite,
    prefix,
    replyJid,
    userJid,
    ban,
    audioFromURL,
    getProfileImageData,
    downloadImage,
    downloadSticker,
    deleteMessage,
    downloadVideo,
    errorReact,
    errorReply,
    imageFromFile,
    imageFromURL,
    isAdmin,
    isOwner,
    react,
    reply,
    sendText,
    stickerFromFile,
    stickerFromURL,
    successReact,
    successReply,
    videoFromURL,
    waitReact,
    waitReply,
    warningReact,
    warningReply,
  };
}

function deleteTempFile(file) {
  try {
    if (file && fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  } catch (error) {
    errorLog(
      "Erro ao deletar arquivo temporário\n\n",
      JSON.stringify(error, null, 2)
    );
  }
}

function extractDataFromInfo(info) {
  const textMessage = info.message?.conversation;
  const extendedTextMessage = info.message?.extendedTextMessage;
  const extendedTextMessageText = extendedTextMessage?.text;
  const imageTextMessage = info.message?.imageMessage?.caption;
  const videoTextMessage = info.message?.videoMessage?.caption;

  const body =
    textMessage ||
    extendedTextMessageText ||
    imageTextMessage ||
    videoTextMessage;

  if (!body) {
    return {
      args: [],
      body: "",
      command: "",
      from: "",
      fullArgs: "",
      isReply: false,
      prefix: "",
      replyJid: "",
      userJid: "",
    };
  }

  const isReply =
    !!extendedTextMessage && !!extendedTextMessage.contextInfo?.quotedMessage;

  const replyJid =
    !!extendedTextMessage && !!extendedTextMessage.contextInfo?.participant
      ? extendedTextMessage.contextInfo.participant
      : null;

  const userJid = info?.key?.participant?.replace(/:[0-9][0-9]|:[0-9]/g, "");

  const [command, ...args] = body.split(" ");

  const prefix = command.charAt(0);

  const commandWithoutPrefix = command.replace(new RegExp(`^[${PREFIX}]+`), "");

  return {
    args: splitByCharacters(args.join(" "), ["\\", "|", "/"]),
    body,
    command: formatCommand(commandWithoutPrefix),
    from: info?.key?.remoteJid,
    fullArgs: args.join(" "),
    isReply,
    prefix,
    replyJid,
    userJid,
  };
}

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
  if (!text) {
    return "";
  }

  return text.replace(/[^0-9]/g, "");
}

function formatCommand(text) {
  return onlyLettersAndNumbers(
    removeAccentsAndSpecialCharacters(text.toLocaleLowerCase().trim())
  );
}

function splitByCharacters(str, characters) {
  characters = characters.map((char) => (char === "\\" ? "\\\\" : char));
  const regex = new RegExp(`[${characters.join("")}]`);

  return str
    .split(regex)
    .map((str) => str.trim())
    .filter(Boolean);
}

function baileysIs(info, context) {
  return !!getContent(info, context);
}

function getContent(info, context) {
  return (
    info.message?.[`${context}Message`] ||
    info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[
      `${context}Message`
    ]
  );
}

function checkPrefix(prefix) {
  return PREFIX === prefix;
}

async function download(info, fileName, context, extension) {
  const content = this.getContent(info, context);

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
}

function isLink(text) {
  const regex = /(https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?)/g;

  return regex.test(text);
}

function toUserJid(number) {
  return `${onlyNumbers(number)}@s.whatsapp.net`;
}

function getBuffer(url, options) {
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
}

async function getJSON(url, options) {
  try {
    const { data } = await axios.get(url, options);

    return data;
  } catch (error) {
    return null;
  }
}

function getRandomName(extension) {
  const fileName = getRandomNumber(0, 999999);

  if (!extension) {
    return fileName.toString();
  }

  return `${fileName}.${extension}`;
}

module.exports = {
  checkPrefix,
  deleteTempFile,
  download,
  formatCommand,
  getBuffer,
  getContent,
  getRandomName,
  getRandomNumber,
  isLink,
  loadLiteFunctions,
  onlyLettersAndNumbers,
  onlyNumbers,
  removeAccentsAndSpecialCharacters,
  splitByCharacters,
  toUserJid,
};
