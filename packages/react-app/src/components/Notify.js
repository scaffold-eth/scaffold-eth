import BNCNotify from "bnc-notify"

export default function Notify(props) {
  const options = {
    dappId: "17422c49-c723-41e7-85dd-950f5831ef92",
    networkId: 3,
    //darkMode: Boolean, // (default: false)
    transactionHandler: (txInformation)=>{
      console.log("HANDLE TX",txInformation)
    },
  }
  return BNCNotify(options)
}
