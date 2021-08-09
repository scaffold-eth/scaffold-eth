export function numberWithCommas(x:number) : string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}