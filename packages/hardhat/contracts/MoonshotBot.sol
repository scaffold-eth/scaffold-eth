pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

// 🤖 🚀 🌔  MoonshotBots for public goods funding!
/*
______  ___                         ______       _____            ________                               ______ __________                              _________
___   |/  /____________________________  /_________  /________    ___  __/_____________   ____________  ____  /____  /__(_)______   _______ __________________  /
__  /|_/ /_  __ \  __ \_  __ \_  ___/_  __ \  __ \  __/_  ___/    __  /_ _  __ \_  ___/   ___  __ \  / / /_  __ \_  /__  /_  ___/   __  __ `/  __ \  __ \  __  /
_  /  / / / /_/ / /_/ /  / / /(__  )_  / / / /_/ / /_ _(__  )     _  __/ / /_/ /  /       __  /_/ / /_/ /_  /_/ /  / _  / / /__     _  /_/ // /_/ / /_/ / /_/ /
/_/  /_/  \____/\____//_/ /_//____/ /_/ /_/\____/\__/ /____/      /_/    \____//_/        _  .___/\__,_/ /_.___//_/  /_/  \___/     _\__, / \____/\____/\__,_/   
                                                                                          /_/                                       /____/
🦧✊ Demand more from PFPs! 👇
🌱🌱 100% of MoonshotBot Minting Fees go to fund Ethereum Public Goods on Gitcoin Grants 🌱🌱
🦧✊🌱100%🌱✊🦧

*/
// https://github.com/austintgriffith/scaffold-eth/tree/moonshot-bots-with-curve


//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract MoonshotBot is ERC721 {

  address payable public constant gitcoin = 0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  string [] private uris;

  constructor() public ERC721("MoonShotBots", "MSB") {
    _setBaseURI("https://gateway.pinata.cloud/ipfs/QmdRmZ1UPSALNVuXY2mYPb3T5exn9in1AL3tsema4rY2QF/json/");
    uris =  ['Superior_Wiki.json', 'Homely_Word_processor.json', 'Abrupt_Paste.json', 'Hungry_Inbox.json', 'Acidic_Digital.json', 'Hungry_Windows.json', 'Adorable_Malware.json', 'Hurt_App.json', 'Adorable_Platform.json', 'Hurt_Bug.json', 'Adventurous_Hack.json', 'Hurt_Byte.json', 'Aggressive_Kernel.json', 'Hurt_Spyware.json', 'Alert_Flash.json', 'Icy_Hyperlink.json', 'Alert_Privacy.json', 'Ideal_Captcha.json', 'Alert_Status_bar.json', 'Ideal_Node.json', 'Aloof_Data.json', 'Immense_Enter.json', 'Aloof_Text_editor.json', 'Impressionable_Surf.json', 'Aloof_Url.json', 'Intrigued_Blogger.json', 'Amiable_Shift.json', 'Intrigued_Database.json', 'Anxious_Status_bar.json', 'Irate_Scanner.json', 'Apprehensive_Email.json', 'Irritable_Cloud_computing.json', 'Apprehensive_Teminal.json', 'Irritable_Xml.json', 'Arrogant_Dns_.json', 'Itchy_Notebook_computer.json', 'Ashamed_Backup.json', 'Jealous_Html.json', 'Ashamed_Password.json', 'Jittery_Script.json', 'Average_Platform.json', 'Jolly_Domain_name.json', 'Average_Router.json', 'Jolly_Real-time.json', 'Batty_Cypherpunk.json', 'Joyous_Queue.json', 'Beefy_Binary.json', 'Joyous_Security.json', 'Bland_Domain.json', 'Juicy_Template.json', 'Blushing_Malware.json', 'Jumpy_Widget.json', 'Blushing_Platform.json', 'Kind_Cd-rom.json', 'Blushing_Storage.json', 'Lackadaisical_Phishing.json', 'Bright_Log_out.json', 'Lackadaisical_Windows.json', 'Broad_Save.json', 'Lackadaisical_Zip.json', 'Burly_Configure.json', 'Large_Linux.json', 'Cheeky_Hacker.json', 'Large_Table.json', 'Cheeky_Spam.json', 'Large_Undo.json', 'Clueless_App.json', 'Lively_Scroll_bar.json', 'Clueless_Operating_system.json', 'Lively_Template.json', 'Colorful_Development.json', 'Lucky_Tag.json', 'Colorful_Email.json', 'Macho_Bite.json', 'Combative_Log_out.json', 'Magnificent_Captcha.json', 'Combative_Shareware.json', 'Maniacal_Dns_.json', 'Condemned_Bandwidth.json', 'Maniacal_Scan.json', 'Condemned_Keyword.json', 'Massive_Browser.json', 'Condescending_Kernel.json', 'Massive_Captcha.json', 'Condescending_Qwerty.json', 'Massive_Login.json', 'Contemplative_Dashboard.json', 'Massive_Offline.json', 'Convincing_Flash.json', 'Melancholy_Buffer.json', 'Convincing_Lurking.json', 'Melancholy_Bus.json', 'Cooperative_Computer.json', 'Melancholy_Shift_key.json', 'Cooperative_Screen.json', 'Miniature_Java.json', 'Corny_Internet.json', 'Misty_Drag.json', 'Corny_Motherboard.json', 'Misty_Zip.json', 'Crabby_Macro.json', 'Muddy_Backup.json', 'Crooked_Virus.json', 'Narrow_Hacker.json', 'Cruel_Dns_.json', 'Narrow_Hypertext.json', 'Cumbersome_Worm.json', 'Nasty_Faq__frequently_asked_questions_.json', 'Cynical_Desktop.json', 'Nasty_Pirate.json', 'Dashing_Clip_art.json', 'Naughty_Backup.json', 'Dashing_Cpu_.json', 'Naughty_Logic.json', 'Dashing_Data_mining.json', 'Naughty_Wireless.json', 'Dashing_Interface.json', 'Nervous_Html.json', 'Deceitful_Bus.json', 'Nonchalant_Log_out.json', 'Deceitful_Log_out.json', 'Nonsensical_Backup.json', 'Defeated_Host.json', 'Nonsensical_Gigabyte.json', 'Delicious_Widget.json', 'Nutritious_Flash_drive.json', 'Delightful_App.json', 'Odd_Clip_board.json', 'Delightful_Database.json', 'Odd_Gigabyte.json', 'Delightful_Hacker.json', 'Old-fashioned_Broadband.json', 'Distinct_Url.json', 'Panicky_Keyword.json', 'Disturbed_Domain_name.json', 'Panicky_User.json', 'Eager_Frame.json', 'Petite_Worm.json', 'Ecstatic_Version.json', 'Petty_Clip_art.json', 'Ecstatic_Zip.json', 'Plain_Cd.json', 'Elated_Bug.json', 'Plain_Firmware.json', 'Elated_Data_mining.json', 'Plain_Multimedia.json', 'Elegant_Wiki.json', 'Pleasant_Flaming.json', 'Emaciated_Page.json', 'Pleasant_Tag.json', 'Emaciated_Rom__read_only_memory_.json', 'Poised_Shell.json', 'Embarrassed_Server.json', 'Poised_Trojan_horse.json', 'Enchanting_Privacy.json', 'Poised_User.json', 'Enormous_Template.json', 'Precious_Computer.json', 'Enthusiastic_Disk.json', 'Precious_Logic.json', 'Exasperated_Encrypt.json', 'Prickly_Supercomputer.json', 'Exasperated_Finder.json', 'Proud_Storage.json', 'Excited_Hacker.json', 'Pungent_Floppy_disk.json', 'Excited_Home_page.json', 'Puny_Mirror.json', 'Extensive_Plug-in.json', 'Quaint_Bus.json', 'Exuberant_Broadband.json', 'Quaint_Shell.json', 'Exuberant_Kernel.json', 'Quizzical_Spyware.json', 'Fantastic_Linux.json', 'Repulsive_Analog.json', 'Fantastic_Screenshot.json', 'Responsive_Kernel.json', 'Flat_Portal.json', 'Responsive_Output.json', 'Floppy_Cloud_computing.json', 'Responsive_Shell.json', 'Floppy_Interface.json', 'Responsive_Tag.json', 'Fluttering_Integer.json', 'Robust_Interface.json', 'Fluttering_Upload.json', 'Round_Finder.json', 'Foolish_Kernel.json', 'Round_Username.json', 'Foolish_Network.json', 'Salty_Cybercrime.json', 'Frantic_Java.json', 'Salty_Shift_key.json', 'Fresh_Domain_name.json', 'Sarcastic_Desktop.json', 'Fresh_Laptop.json', 'Sarcastic_Save.json', 'Fresh_Password.json', 'Scary_Router.json', 'Fresh_Ram.json', 'Shaky_Output.json', 'Fresh_Shareware.json', 'Shallow_Link.json', 'Frustrating_Bug.json', 'Silky_Dot.json', 'Funny_Bitmap.json', 'Silky_Screenshot.json', 'Funny_Real-time.json', 'Silky_Trash.json', 'Fuzzy_Buffer.json', 'Slimy_Qwerty.json', 'Fuzzy_Virtual.json', 'Small_Internet.json', 'Gaudy_Data_mining.json', 'Small_Path.json', 'Gentle_Malware.json', 'Smarmy_Dynamic.json', 'Ghastly_Joystick.json', 'Smoggy_Monitor.json', 'Ghastly_Podcast.json', 'Soggy_Root.json', 'Ghastly_Pop-up.json', 'Sour_Paste.json', 'Ghastly_Status_bar.json', 'Spicy_Array.json', 'Ghastly_Version.json', 'Spicy_Database.json', 'Giddy_Computer.json', 'Stale_Download.json', 'Giddy_Laptop.json', 'Steady_Modem.json', 'Gigantic_Bug.json', 'Steady_Privacy.json', 'Gigantic_Log_out.json', 'Sticky_Font.json', 'Glamorous_Desktop.json', 'Stormy_Url.json', 'Gleaming_Byte.json', 'Stout_Cloud_computing.json', 'Gleaming_Process.json', 'Stunning_Programmer.json', 'Gleaming_Scan.json', 'Substantial_Monitor.json', 'Glorious_Integer.json', 'Succulent_Icon.json', 'Glorious_Programmer.json', 'Superficial_Array.json', 'Gorgeous_Piracy.json', 'Graceful_Security.json', 'Swanky_Trojan_horse.json', 'Graceful_Software.json', 'Sweet_Host.json', 'Greasy_Bus.json', 'Tasty_Url.json', 'Greasy_Digital.json', 'Tense_Blogger.json', 'Grieving_Freeware.json', 'Terrible_Shift_key.json', 'Grotesque_Clip_art.json', 'Thoughtless_Html.json', 'Grotesque_Password.json', 'Uneven_Spam.json', 'Grubby_Computer.json', 'Uneven_Workstation.json', 'Grubby_Media.json', 'Unsightly_Backup.json', 'Grumpy_Bite.json', 'Unsightly_Network.json', 'Grumpy_Script.json', 'Unsightly_Word_processor.json', 'Grumpy_Teminal.json', 'Upset_Runtime.json', 'Grumpy_Url.json', 'Uptight_Restore.json', 'Handsome_Worm.json', 'Uptight_Text_editor.json', 'Happy_Delete.json', 'Vast_Cloud_computing.json', 'Happy_Drag.json', 'Vast_Compile.json', 'Happy_Macro.json', 'Victorious_Cyberspace.json', 'Healthy_Encryption.json', 'Victorious_Motherboard.json', 'Helpful_Version.json', 'Vivacious_Bug.json', 'Helpless_Flowchart.json', 'Vivid_Domain_name.json', 'Helpless_Laptop.json', 'Wacky_Cpu_.json', 'Helpless_Pirate.json', 'Wacky_Logic.json', 'Helpless_Shell.json', 'Whimsical_Pirate.json', 'High_Rom__read_only_memory_.json', 'Whopping_Screen.json', 'Hollow_Interface.json', 'Wicked_Development.json', 'Hollow_Kernel.json', 'Wicked_Key.json', 'Hollow_Spammer.json', 'Wicked_Online.json'];
  }

  uint256 public constant limit = 303;
  uint256 public price = 0.0033 ether;

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
    price = (price * 1047) / 1000;
    (bool success,) = gitcoin.call{value:msg.value}("");
    require( success, "could not send");
    mintItem(to, uris[_tokenIds.current()]);
  }
}
