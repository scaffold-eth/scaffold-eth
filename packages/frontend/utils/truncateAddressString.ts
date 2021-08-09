export function truncateAddressString(address:string) : string {
    if (address.length <= 10)
        return address
    return address.substr(0, 5) + "..." + address.substr(address.length - 4) 
}