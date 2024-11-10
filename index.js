/**
 * Este script é responsável pelas funções que serão executadas no Lite Bot.
 *
 * Aqui é onde você vai definir o que o seu bot vai fazer.
 *
 * Dev Gui </>
 */
async function runLite({ socket: lite, events }) {
  if (!events["messages.upsert"]) {
    return;
  }

  // Aqui virão as cases, body, etc, etc, etc...
}

exports.runLite = runLite;
