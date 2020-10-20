const Uls = require('../../futu/nodeaddon/uls-addon/build/Release/UlsAddon.node');

try {
  const uls = new Uls(517, './log', 10000000, 10, 5, 5);
  console.log(uls);
} catch (error) {
  console.error(error);
}
