/**
 * Arquivo pra rodar alguns testes,
 * nada demais.
 *
 * @author Dev Gui
 */
(async () => {
  const fetchJson = async (url) => {
    const response = await fetch(url);
    return await response.json();
  };

  const q = "https://www.youtube.com/watch?v=Oz7pHJ65gjM";

  const api = await fetchJson(
    ` http://br3.bronxyshost.com:4237/youtube/playmp3?q=${q}&apikey=igoBots`
  );

  console.log(api);
})();
