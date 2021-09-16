pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {
    uint256 constant RIDE_FARE = 1;

    address public owner;

    Driver[] public onlineDrivers;

    struct Coordinate {
        int256 lat;
        int256 lon;
    }

    struct Vehicle {
        string licensePlate;
    }

    struct Driver {
        address driverAddress;
        Coordinate currentCoordinate;
        Vehicle vehicle;
        uint256 updatedTime;
    }

    event Rides(
        address indexed rider,
        address indexed driver,
        string licensePlate,
        uint256 ride_fare,
        Coordinate src,
        Coordinate dest
    );
    event SetPurpose(address sender, string purpose);

    string public purpose = "Building Unstoppable Apps!!!";

    constructor() {
        owner = msg.sender;
    }

    function setLicensePlate(string memory licensePlate) public {
        console.log(msg.sender, "set license plate to", licensePlate);
        emit SetPurpose(msg.sender, licensePlate);
    }

    function setPurpose(string memory newPurpose) public {
        purpose = newPurpose;
        console.log(msg.sender, "set purpose to", purpose);
        emit SetPurpose(msg.sender, purpose);
    }

    function driverGoOnline(
        int256 lat,
        int256 lon,
        string memory licensePlate
    ) public {
        Driver memory driver = Driver(
            address(msg.sender),
            Coordinate(lat, lon),
            Vehicle(licensePlate),
            block.timestamp
        );
        onlineDrivers.push(driver);
        // TODO: check if the sender is already added as a online driver
    }

    // Finds an online driver and pays them for the ride
    function request_ride(
        int256 srcLat,
        int256 srcLon,
        int256 destLat,
        int256 destLon
    ) public payable {
        require(onlineDrivers.length > 0, "No online drivers!");
        address rider = msg.sender;
        Coordinate memory src = Coordinate(srcLat, srcLon);
        Coordinate memory dest = Coordinate(destLat, destLon);

        Driver memory assignedDriver;
        for (uint256 i = 0; i < onlineDrivers.length; i++) {
            if (onlineDrivers[i].driverAddress != rider) {
                assignedDriver = onlineDrivers[i];

                // remove assigned driver from online drivers
                onlineDrivers[i] = onlineDrivers[onlineDrivers.length - 1];
                delete onlineDrivers[onlineDrivers.length - 1];
            }
        }

        emit Rides(
            msg.sender,
            assignedDriver.driverAddress,
            assignedDriver.vehicle.licensePlate,
            RIDE_FARE,
            src,
            dest
        );
        payable(assignedDriver.driverAddress).transfer(RIDE_FARE);
    }
}
