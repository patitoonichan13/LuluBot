/**
 * Este script é responsável pelas funções que serão executadas no Lite Bot.
 *
 * Aqui é onde você vai definir o que o seu bot vai fazer.
 *
 * Dev Gui </>
 */
const { loadFunctions } = require("./utils/functions");

async function runLite({ socket: lite, events }) {
  if (!events["messages.upsert"]) {
    return;
  }

  const upsert = events["messages.upsert"];
  const {} = loadFunctions({ lite, upsert });
}

exports.runLite = runLite;
