const VotingContract = artifacts.require("VotingContract");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("VotingContract", function (accounts) {
  it("should assert true", async function () {
    await VotingContract.deployed();
    return assert.isTrue(true);
  });
});
