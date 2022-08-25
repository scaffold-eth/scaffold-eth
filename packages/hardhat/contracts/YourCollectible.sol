pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';

import './HexStrings.sol';
import './ToColor.sol';

//import "hardhat/console.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract YourCollectible is ERC721, Ownable {

  using Strings for uint256;
  using HexStrings for uint160;
  using ToColor for bytes3;

  constructor() public ERC721("Dodo Birds Fight", "DODO") {
    // create a junk bird for index 0
    dodos.push(Dodo({
      lives: 0,
      wins: 0,
      color: 0,
      fight: 0
    }));
    // same for fights
    fights.push(Fight({
      id1: 0,
      id2: 0,
      block: 0
    }));
  }

  struct Fight {
      uint256 id1;
      uint256 id2;
      uint256 block;
  }

  // An array of 'Todo' structs
  Fight[] public fights;


  struct Dodo {
      uint8 lives;
      uint248 wins;
      bytes3 color;
      uint256 fight;
  }

  // An array of 'Todo' structs
  Dodo[] public dodos;

  //mapping (uint256 => bytes3) public color;
  //mapping (uint256 => uint256) public chubbiness;

  //uint256 mintDeadline = block.timestamp + 24 hours;

  uint256 public price = 0.01 ether;

  address public constant dodoTreasury = 0xF0b8A88fF89A6C581b9f99fF55a6766593c192B0;

  function setPrice(uint256 amount) public {
    require(msg.sender==dodoTreasury,"not treasury");
    price = amount;
  }

  function mintItem()
      public
      payable
      returns (uint256)
  {
      require( msg.value >= price, "not enough");
      //require( block.timestamp < mintDeadline, "DONE MINTING");
      //_tokenIds.increment();

      uint256 id = dodos.length;
      _mint(msg.sender, id);

      bytes32 predictableRandom = keccak256(abi.encodePacked( blockhash(block.number-1), msg.sender, address(this), id ));
      //color[id] =
      //chubbiness[id] = 35+((55*uint256(uint8(predictableRandom[3])))/255);

      dodos.push(Dodo({
        lives: uint8(msg.value/price),
        wins: 0,
        color: bytes2(predictableRandom[0]) | ( bytes2(predictableRandom[1]) >> 8 ) | ( bytes3(predictableRandom[2]) >> 16 ),
        fight: 0
      }));

      (bool sent,) = payable(dodoTreasury).call{value: msg.value}("");
      require(sent, "failed to treasury");

      return id;
  }

  event Challenge(uint256 indexed id1, uint256 indexed id2, uint256 blocknumber, uint256 fightid);

  function challenge(uint256 id1, uint256 id2) public returns (uint256){
    require(id1!=id2,"cant fight yourself");
    Dodo storage dodo1 = dodos[id1];
    require(dodo1.fight==0, "first dodo not available");
    Dodo storage dodo2 = dodos[id2];
    require(dodo2.fight==0, "second dodo not available");

    require(ownerOf(id1) == msg.sender, "not your dodo!");

    dodo1.fight=fights.length;
    dodo2.fight=fights.length;

    fights.push(Fight({
      id1: id1,
      id2: id2,
      block: block.number+1
    }));

    emit Challenge(id1,id2,block.number+1,fights.length-1);

    return fights.length-1;
  }

  function process(uint256 fightid) public {

     bool result = viewProcess(fightid);

     //console.log("fightresult",result);

     Fight storage fight = fights[fightid];

     Dodo storage dodo1 = dodos[fight.id1];
     Dodo storage dodo2 = dodos[fight.id2];

     if(result){
       dodo1.wins++;
       //console.log("(dodo 1 won)");
       _burn(fight.id2);
       dodo1.fight=0;
     }else{
       dodo2.wins++;
       //console.log("(dodo 2 won)");
       if(dodo1.lives<=1){
         _burn(fight.id1);
       }else{
         dodo1.lives--;
       }

       dodo2.fight=0;
     }





  }

  function viewProcess(uint256 fightid) internal view returns (bool winner) {
    Fight storage fight = fights[fightid];

    require(fight.id1>0,"unknown fight");
    require(block.number>fight.block,"not yet");

    bytes32 lessPredictableRandom = blockhash(fight.block);

    uint8 index = 0;

    bool whosTurn = false;

    uint8 coinflip = uint8(lessPredictableRandom[index++]);
    //console.log("coinflip",coinflip);
    if(coinflip>=128){
      whosTurn=true;
    }

    uint8 health1 = 100;
    uint8 health2 = 100;
    uint8 divider = 10;

    while(health1>0&&health2>0){

      if(index>=32){
        //console.log("hashing");
        lessPredictableRandom = keccak256(abi.encodePacked(lessPredictableRandom));
        //console.log("new hashing");
        index=0;
      }

      uint8 thisDamage = uint8(lessPredictableRandom[index++])/divider;

      if(whosTurn){
        //console.log("damaging bird 1",thisDamage);
        /*if(health1<thisDamage-4) {
          _burn(fight.id1);
        }else */if(health1<thisDamage) {
          health1=0;
        }else{
          health1-=thisDamage;
        }
      }else{
        //console.log("damaging bird 2",thisDamage);
        /*if(health2<thisDamage-4) {
          _burn(fight.id2);
        }else */if(health2<thisDamage) {
          health2=0;
        }else{
          health2-=thisDamage;
        }
      }

      whosTurn=!whosTurn;

    }

    if(health1>0){
      return true;
      //console.log("dodo1 wins!");
    } else {
      return false;
      //console.log("dodo2 wins!");
    }

  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      Dodo storage dodo = dodos[id];
      string memory name = string(abi.encodePacked('Dodo #',id.toString()));
      string memory description = string(abi.encodePacked('This Dodo is the color #',dodo.color.toColor()/*,' with a chubbiness of ',uint2str(chubbiness[id])*/,'!!!'));
      string memory image = Base64.encode(bytes(generateSVGofTokenById(id)));

      return
          string(
              abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                          abi.encodePacked(
                              '{"name":"',
                              name,
                              '", "description":"',
                              description,
                              /*'", "external_url":"https://burnyboys.com/token/',
                              id.toString(),
                              '", "attributes": [{"trait_type": "color", "value": "#',
                              dodo.color.toColor(),
                              '"},{"trait_type": "chubbiness", "value": ',
                              uint2str(chubbiness[id]),
                              */'", "owner":"',
                              (uint160(ownerOf(id))).toHexString(20),
                              '", "image": "',
                              'data:image/svg+xml;base64,',
                              image,
                              '"}'
                          )
                        )
                    )
              )
          );
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg width="550" height="650" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    string memory render = string(abi.encodePacked(
      '<defs><style>.cls-1,.cls-2,.cls-3,.cls-4,.cls-5{stroke-miterlimit:10;}.cls-1,.cls-5{stroke:#0d0d0d;}.cls-2{fill:#685c48;}.cls-2,.cls-3,.cls-4{stroke:#231f20;}.cls-3{fill:#e5d67f;}.cls-4{fill:#fee78a;}.cls-5{fill:#fff;}</style></defs><g id="rightleg"><path class="cls-3" d="M82.09,441.46v87.92l-42.75-7.99s-9.92,13.32,0,15.99,42.75,8.88,42.75,8.88l-42.75,35.52s-4.85,18.65,4.45,13.32c9.3-5.33,45.41-39.08,45.41-39.08l33.37,40.03s13.68,12.36,8.75-9.84-36.66-54.17-36.66-54.17l-1.64-121.67s-9.85-21.31-12.04-1.78,1.09,32.86,1.09,32.86Z"/><path class="cls-2" d="M72.44,341.87s-21.69,82.63,11.23,109.82c0,0,24.31,30.59,59.12-78.37l-70.35-31.45Z"/></g><g id="tailfeathers"><path class="cls-2" d="M227.55,230.56s52.14-55.13,77.62-24.25c0,0-25.37-2.23-44.02,17.76,0,0,32.43-22.99,44.02-10.34,0,0-42.1,18.06-38.81,27.33,0,0,41.9-25.48,44.22-7.72,0,0-38.24,4.75-41.51,17.05,0,0,33.02-14.61,33.79,0,0,0-31.09,2.17-33.79,16.16s-16.4,10.81-16.4,10.81l-25.11-46.8h0"/></g><g id="body"><path class="cls-2" d="M108.57,14.34s45.49-35.34,58.26,32.01c0,0-11.38,47.29-30.11,62.91,0,0-39.84,76.17-7.22,104.21,0,0,9.09,67.43-36.54,50.95,0,0-47.73-60.81,5.48-156.49L108.57,14.34Z"/><path class="cls-2" d="M87.47,227.59s142.35-84.51,191.59,76.88c0,0,3.36,113.8-178.87,108.88,0,0-82.38-53.83-45.86-134.97,0,0,17.73-51.63,33.15-50.79Z"/></g><g id="leftleg"><path class="cls-3" d="M171.07,473.44v87.92l-42.75-7.99s-9.92,13.32,0,15.99,42.75,8.88,42.75,8.88l-42.75,35.52s-4.85,18.65,4.45,13.32c9.3-5.33,45.41-39.08,45.41-39.08l33.37,40.03s13.68,12.36,8.75-9.84-36.66-54.17-36.66-54.17l-1.64-121.67s-9.85-21.31-12.04-1.78,1.09,32.86,1.09,32.86Z"/><path class="cls-2" d="M128.32,386.05s6.67,88.07,44.37,89.68c0,0,31.14,10.5,27.85-109.88l-72.22,20.2Z"/></g><g id="righteye"><g><circle class="cls-5" cx="103.12" cy="21.31" r="20.81"/><circle class="cls-1" cx="98.71" cy="22.1" r="1.49"/></g></g><g id="bottomjaw"><path class="cls-4" d="M114.48,103.35s-69.13-.24-84.89-12.11c0,0-.88-6.71,8.7-6.6l54.93-14.06s36.52,20.16,22.34,29.64"/></g><g id="beak"><circle class="cls-4" cx="122.85" cy="59.64" r="35.42"/><path class="cls-4" d="M96.69,35.76s-41.32,22.87-58.78,20.93c0,0-23.8-25.52-34.77-.81,0,0-6.67,20.44,1.18,29.55l4.79,.7s22.88-6.44,35.21-4.63c0,0,40.46-.57,45.1-10.11"/></g><g id="lefteye"><g><circle class="cls-5" cx="123.67" cy="34.36" r="20.81"/><circle class="cls-1" cx="119.26" cy="35.15" r="1.49"/></g></g>'
      ));

    return render;
  }

  function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
      if (_i == 0) {
          return "0";
      }
      uint j = _i;
      uint len;
      while (j != 0) {
          len++;
          j /= 10;
      }
      bytes memory bstr = new bytes(len);
      uint k = len;
      while (_i != 0) {
          k = k-1;
          uint8 temp = (48 + uint8(_i - _i / 10 * 10));
          bytes1 b1 = bytes1(temp);
          bstr[k] = b1;
          _i /= 10;
      }
      return string(bstr);
  }
}
