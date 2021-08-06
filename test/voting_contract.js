const VotingContract = artifacts.require("./VotingContract");
const AccessToken = artifacts.require("AccessToken");
const { expectRevert } = require('@openzeppelin/test-helpers');

contract("VotingContract", function (accounts) {
  let vc;
  let accessToken;
  let account1;
  let account2;
  let account3;

  beforeEach(async () => {
    vc = await VotingContract.deployed();
    accessToken = await AccessToken.deployed();
    account1 = accounts[0];
    account2 = accounts[1];
    account3 = accounts[2];
  })
  
  it("should create contract correctly", async () => {
    const tokenId = 0;
    const accessRef = await vc.getAccessRef(tokenId);
    const tokenOwnerRef = await vc.getOwnerToken({from: account1});

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
      account2, vc.address, {from: account1});
    const tokenId = tx.receipt.logs[0].args[0].words[0];
    const tokenOwner = tx.receipt.logs[0].args[1];
    const tokenURI = tx.receipt.logs[0].args[2];
    const accessRef = await vc.getAccessRef(tokenId);
    const tokenOwnerRef = await vc.getOwnerToken({from: account2});

    assert(await accessRef.isAdmin === false,
      "VC TokenRef. admin not saved correctly");
    assert(await accessRef.tokenId.toString() 
      === tokenId.toString(),
      "VC TokenRef.tokenId not saved correctly");
    assert(await tokenOwnerRef.isAdmin === false,
      "VC TokenRef.admin not saved correctly");
    assert(await tokenOwnerRef.tokenId.toString() 
      === tokenId.toString(),
      "VC TokenRef.tokenId not saved correctly");
    assert(tokenOwner === account2,
      "Token owner not saved correctly");
    assert(tokenURI === vc.address,
      "TokenURI not saved correctly");
    
  });

  it("should NOT generate access token if not called by admin", 
    async () => {
      await expectRevert(
        vc.generateAccessToken(account3, vc.address, {from: account2}),
        "Only admin may perform this action"
      )
  });

  it("should NOT generate access token for same address twice", 
    async () => {
      await expectRevert(
        vc.generateAccessToken(account2, vc.address, {from: account1}),
        "An address may only own one Access Token"
      )
  });

  it("should NOT generate admin a second time", 
    async () => {
      await expectRevert(
        vc.generateAdmin(vc.address),
        "Admin already exists for this contract"
      );
    });

  it("should allow vote() to be called", async () => {
    const tx = await vc.vote({from: account2});
    const tokenId = tx.receipt.logs[0].args[0].words[0];
    const balanceOf = (await accessToken.balanceOf(account2)).words[0];
    let accessTokenId;

    for(let i = 0; i < balanceOf; i++){
      const current = await accessToken.tokenOfOwnerByIndex(account2, i);
      const uri = await accessToken.tokenURI(current);
      if(uri === vc.address) {
        accessTokenId = current;
      }
    }
    assert(accessTokenId.toString() === tokenId.toString(), "Vote() did not emit correct tokenId");
  });

  it("should NOT vote if not approved", async () => {
    await expectRevert(
      vc.vote({from: account3}),
      "Must hold an access token to perform this action"
    )
  })
  
});
