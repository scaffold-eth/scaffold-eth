/* Here we specify the solidity versions
 * Any version greater than or equal to 0.6.2
 * or less than 0.7.0 will compile this contract */
pragma solidity ^0.6.2;

contract YourContract {
    // the switch is on if true
    bool public isOn;
    int cont = 0;

    constructor() public {
        // we'll default to being on
        isOn = true;
    }

    // a publicly accessible function to "flip" the switch
    function toggle() public returns (bool) {
        // flip isOn from true->false or false->true
        isOn = !isOn;
        // return the new value
        return isOn;
    }

    function halfToggle() public returns (bool) {
        // flip isOn from true->false or false->true
        if (cont == 0) {
            cont++;
        } else {
            isOn = !isOn;
            cont = 0;
        }

        // return the new value
        return isOn;
    }
}
