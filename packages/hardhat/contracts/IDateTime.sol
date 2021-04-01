// SPDX-License-Identifier: MIT

interface IDateTime {
        /*
         *  Abstract contract for interfacing with the DateTime contract.
         *
         */
        function isLeapYear(uint16 year) external view returns (bool);
        function getYear(uint timestamp) external view returns (uint16);
        function getMonth(uint timestamp) external view returns (uint8);
        function getDay(uint timestamp) external view returns (uint8);
        function getHour(uint timestamp) external view returns (uint8);
        function getMinute(uint timestamp) external view returns (uint8);
        function getSecond(uint timestamp) external view returns (uint8);
        function getWeekday(uint timestamp) external view returns (uint8);
        function toTimestamp(uint16 year, uint8 month, uint8 day) external view returns (uint timestamp);
        function toTimestamp(uint16 year, uint8 month, uint8 day, uint8 hour) external view returns (uint timestamp);
        function toTimestamp(uint16 year, uint8 month, uint8 day, uint8 hour, uint8 minute) external view returns (uint timestamp);
        function toTimestamp(uint16 year, uint8 month, uint8 day, uint8 hour, uint8 minute, uint8 second) external view returns (uint timestamp);
}
