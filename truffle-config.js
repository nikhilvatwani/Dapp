require('babel-register');
require('babel-polyfill');
var HDWalletProvider = require("truffle-hdwallet-provider");

const MNEMONIC = 'indoor hold weather hazard such dust flavor recycle lawsuit inmate same choose';

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/a955f2f7ee4149ceb68c0637c8fe3b9b")
      },
      network_id: 3,
      gas: 4000000  ,
      skipDryRun: true,   
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
    //  optimizer: {
    //    enabled: true,
    //    runs: 200
    //  }
    }
  }
}
