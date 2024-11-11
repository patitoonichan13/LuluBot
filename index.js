/**
 * Este script é responsável pelas funções que serão executadas no Lite Bot.
 *
 * Aqui é onde você vai definir o que o seu bot vai fazer.
 *
 * @author Dev Gui
 */
const path = require("node:path");
const { menu } = require("./utils/menu");
const { loadLiteFunctions } = require("./utils/functions");
const { ASSETS_DIR } = require("./config");

async function runLite({ socket, data }) {
  const functions = loadLiteFunctions({ socket, data });

  if (!functions) {
    return;
  }

  const { command, reply, react, successReact, imageFromFile } = functions;

  /**
   * Aqui você vai definir as funções que
   * o seu bot vai executar via "cases".
   *
   * ⚠ ATENÇÃO ⚠: Não traga funções ou "cases" de outros bots para cá
   * sem saber o que está fazendo.
   *
   * Cada bot tem suas particularidades e, por isso, é importante tomar cuidado.
   * Não nos responsabilizamos por problemas que possam ocorrer ao
   * trazer códigos de outros bots pra cá, na tentativa de adaptação.
   *
   * Toda ajuda será *COBRADA* caso sua intenção
   * seja adaptar os códigos de outro bot para este.
   */
  switch (command) {
    case "menu":
      await successReact();
      await imageFromFile(
        path.join(ASSETS_DIR, "images", "menu.png"),
        `\n\n${menu()}`
      );
      break;
    case "ping":
      await react("🏓");
      await reply("🏓 Pong!");
      break;
  }
}

exports.runLite = runLite;
