const Marketplace = artifacts.require("Marketplace");
const InfinityToken = artifacts.require("InfinityToken.sol");
module.exports = function(deployer) {
  deployer.deploy(InfinityToken, 1000000).then(function() {
    // Token price is 0.001 Ether
    var tokenPrice = 1000000000000000;
    return deployer.deploy(Marketplace, InfinityToken.address, tokenPrice);
  });
};
