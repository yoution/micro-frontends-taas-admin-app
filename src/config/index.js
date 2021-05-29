/* global process */

module.exports = (() => {
  const appEnv =
    process.env.APPENV === "production" ? "production" : "development";

  // eslint-disable-next-line no-console
  console.log(`APPENV: "${appEnv}"`);

  return require(`./${appEnv}`);
})();
