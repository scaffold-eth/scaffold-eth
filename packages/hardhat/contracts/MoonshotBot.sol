pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract MoonshotBot is ERC721, Ownable {

  address payable public constant gitcoin = 0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  string [] private uris;

  constructor() public ERC721("MoonShotBots", "MSB") {
    _setBaseURI("https://gateway.pinata.cloud/ipfs/QmdkZW8hMbSSBjrFov7sGoeoxvYJnVp8gx7pgByCNoM6ko/");
    uris = ['Adelyn.json','Cairo.json','Dominic.json','Harlow.json','Khaleesi.json','Meredith.json','Ryan.json','Adler.json','Cal.json','','Donald.json','Harmony.json','Killian.json','Michael.json','Ryann.json','Ahmir.json','Callan.json','Dorian.json','Hope.json','Kolton.json','Milana.json','Saoirse.json','Alaya.json','Cameron.json','Dream.json','Ian.json','','Kora.json','Mohammad.json','Sincere.json','Albert.json','Cannon.json','Edwin.json','Ibrahim.json','Lainey.json','Molly.json','Skye.json','Alden.json','Carlos.json','Elaine.json','Indie.json','Laurel.json','Myles.json','Solomon.json','Alessandro.json','Carly.json','Eliana.json','Israel.json','Layton.json','Nathanael.json','Steven.json','Alex.json','Case.json','Elianna.json','Izaiah.json','Leandro.json','Nellie.json','Talon.json','Alexis.json','Casen.json','Elizabeth.json','Jake.json','Leonard.json','Nicholas.json','Taylor.json','Alia.json','Cayson.json','Elliana.json','Jalen.json','Lexie.json','Niko.json','Tessa.json','Alyssa.json','Cesar.json','Ellianna.json','Jase.json','Liana.json','Oaklyn.json','Theo.json','Amora.json','Charlie.json','Elyse.json','Jaxtyn.json','Liliana.json','Oaklynn.json','Tomas.json','Anakin.json','Claire.json','Evan.json','Jay.json','','Linda.json','Paisley.json','Ty.json','Angelina.json','Clark.json','Evangeline.json','Jeffrey.json','Liv.json','','Parker.json','Tyler.json','Annabella.json','Clementine.json','Eve.json','','Jianna.json','Lucca.json','Paul.json','Van.json','Ariel.json','Coen.json','Everett.json','Jude.json','Luciana.json','Penelope.json','Walter.json','Ariyah.json','Corey.json','Evie.json','Judith.json','Madisyn.json','Peter.json','Watson.json','Arthur.json','Dakari.json','Fallon.json','Julian.json','Makenna.json','Presley.json','Westin.json','Axl.json','','Dallas.json','Finley.json','Julio.json','Malaya.json','Quinn.json','Ximena.json','Axton.json','Daniel.json','Gary.json','Kade.json','Marcos.json','Quinton.json','Yousef.json','Belen.json','Danielle.json','Georgia.json','Kairi.json','Marianna.json','Raven.json','Zainab.json','Braden.json','Danny.json','Grace.json','Kamari.json','Marleigh.json','Rhea.json','Zelda.json','Bradley.json','Darwin.json','Halo.json','Kareem.json','Mateo.json','Rhett.json','Zola.json','Brecken.json','Davis.json','Hana.json','Kash.json','Maxwell.json','Rhys.json','read_files.py','Brinley.json','Daxton.json','Hanna.json','Kashton.json','Mckinley.json','Rosemary.json','Brynlee.json','Della.json','Hannah.json','Kayson.json','Melissa.json','Royal.json'];
  }

  uint256 public constant limit = 175;
  uint256 public price = 0.007 ether;

  function mintItem(address to, string memory tokenURI)
      private
      returns (uint256)
  {
      require( _tokenIds.current() < limit , "DONE MINTING");
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(to, id);
      _setTokenURI(id, tokenURI);

      return id;
  }

  function requestMint(address to)
      public
      payable
  {
    require( msg.value >= price, "NOT ENOUGH");
    price = (price * 103) / 100;
    (bool success,) = gitcoin.call{value:msg.value}("");
    require( success, "could not send");
    mintItem(to, uris[_tokenIds.current()]);
  }
}
