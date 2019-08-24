// Load zos scripts and truffle wrapper function
const { scripts, ConfigManager } = require('@openzeppelin/cli');
const { add, push, create } = scripts;

async function deploy(options) {
  // Register v0 of MyContract in the zos project
  add({ contractsData: [{ name: 'FBERC20Token', alias: 'FBToken'}] });

  // Push implementation contracts to the network
  await push(options);

  // Create an instance of MyContract, setting initial value to 42
  await create(Object.assign({ contractAlias: 'FBToken', methodName: 'initialize', methodArgs: ["FBToken", "uFB", 18, 0, "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1", ["0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"], ["0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"]]}, options));
}

module.exports = function(deployer, networkName, accounts) {
  deployer.then(async () => {
    const { network, txParams } = await ConfigManager.initNetworkConfiguration({ network: networkName, from: accounts[0] })
    await deploy({ network, txParams })
  })
}