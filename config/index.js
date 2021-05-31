/* global process */

module.exports = (() => {
  const appEnv = process.env.APPENV === "prod" ? "prod" : "dev";

  // eslint-disable-next-line no-console
  console.log(`APPENV: "${appEnv}"`);

  return require(`./${appEnv}`);
})();
