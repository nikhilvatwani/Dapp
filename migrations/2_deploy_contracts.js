const Marketplace = artifacts.require("Marketplace");
const DappToken = artifacts.require("DappToken.sol");
module.exports = function(deployer) {
  deployer.deploy(DappToken, 1000000).then(function() {
    // Token price is 0.001 Ether
    var tokenPrice = 1000000000000000;
    return deployer.deploy(Marketplace, DappToken.address, tokenPrice);
  });
};
