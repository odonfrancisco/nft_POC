const VotingContract = artifacts.require("./VotingContract");
const { expectRevert } = require('@openzeppelin/test-helpers');

contract("VotingContract", function (accounts) {
  let vc;
  let address1;
  let address2;
  let address3;

  beforeEach(async () => {
    vc = await VotingContract.deployed();
    address1 = accounts[0];
    address2 = accounts[1];
    address3 = accounts[2];
  })
  
  it("should create contract correctly", async () => {
    const tokenId = 0;
    const accessRef = await vc.getAccessRef(tokenId);
    const tokenOwnerRef = await vc.getOwnerToken({from: address1});

    assert(await vc.name() === "First Organization",
      "VC name not saved correctly");
    assert(await accessRef.isAdmin === true,
      "VC TokenRef.admin not saved correctly");
    assert(await accessRef.tokenId.toString() 
      === tokenId.toString(),
      "VC TokenRef.tokenId not saved correctly");
    assert(await tokenOwnerRef.isAdmin === true,
      "VC TokenRef.admin not saved correctly");
    assert(await tokenOwnerRef.tokenId.toString() 
      === tokenId.toString(),
      "VC TokenRef.tokenId not saved correctly");
  });

  it("should generate access token correctly", async () => {
    const tx = await vc.generateAccessToken(
      address2, vc.address, {from: address1});
    const tokenId = tx.receipt.logs[0].args[0].words[0];
    const tokenOwner = tx.receipt.logs[0].args[1];
    const accessRef = await vc.getAccessRef(tokenId);
    const tokenOwnerRef = await vc.getOwnerToken({from: address2});

    assert(await accessRef.isAdmin === false,
      "VC TokenRef.admin not saved correctly");
    assert(await accessRef.tokenId.toString() 
      === tokenId.toString(),
      "VC TokenRef.tokenId not saved correctly");
    assert(await tokenOwnerRef.isAdmin === false,
      "VC TokenRef.admin not saved correctly");
    assert(await tokenOwnerRef.tokenId.toString() 
      === tokenId.toString(),
      "VC TokenRef.tokenId not saved correctly");
    assert(tokenOwner === address2,
      "Token owner not saved correctly");
  });

  it("should NOT generate access token if not called by admin", 
    async () => {
      await expectRevert(
        vc.generateAccessToken(address3, vc.address, {from: address2}),
        "Only admin may perform this action"
      )
  });

  it("should NOT generate access token for same address twice", 
    async () => {
      await expectRevert(
        vc.generateAccessToken(address2, vc.address, {from: address1}),
        "An address may only own one Access Token"
      )
  });
  
});
