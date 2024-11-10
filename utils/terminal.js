/**
 * Funções de log e interação com o terminal.
 *
 * Dev Gui </>
 */
const terminal = require("terminal-kit").terminal;

const { version } = require("../package.json");
const { BOT_NAME } = require("../config");
const botName = BOT_NAME.replace(" BOT", "");

function infoLog(message) {
  terminal.bgCyan(`\n ${botName} INFO `).defaultColor(" ").cyan(`${message}`);
}

function errorLog(message) {
  terminal.bgRed(`\n ${botName} ERROR `).defaultColor(" ").red(`${message}`);
}

function successLog(message) {
  terminal
    .bgGreen(`\n ${botName} SUCCESS `)
    .defaultColor(" ")
    .green(`${message}\n`);
}

function warningLog(message) {
  terminal
    .bgYellow(`\n ${botName} WARNING `)
    .defaultColor(" ")
    .yellow(`${message}`);
}

function banner() {
  terminal.cyan("░█░░░▀█▀░▀█▀░█▀▀░░░█▀▄░█▀█░▀█▀\n");
  terminal.defaultColor("░█░░░░█░░░█░░█▀▀░░░█▀▄░█░█░░█░\n");
  terminal.cyan("░▀▀▀░▀▀▀░░▀░░▀▀▀░░░▀▀░░▀▀▀░░▀░\n");
  terminal.cyan("🤖 Versão: ").defaultColor(`${version}\n\n`);
}

function textInput(message) {
  terminal
    .bgMagenta(`\n ${botName} INPUT `)
    .defaultColor(" ")
    .magenta(`${message}`);

  return new Promise((resolve) => {
    terminal.inputField({}, async (error, input) => {
      if (error) {
        resolve(null);
      } else {
        resolve(input);
      }
    });
  });
}

module.exports = {
  banner,
  errorLog,
  infoLog,
  successLog,
  warningLog,
  textInput,
};
