import React, { Fragment, useState } from "react";
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

// added display of 0 if price={price} is not provided

/**
  ~ What it does? ~

  Displays current ETH price and gives options to buy ETH through Wyre/Ramp/Coinbase
                            or get through Rinkeby/Ropsten/Kovan/Goerli

  ~ How can I use? ~

  <Ramp
    price={price}
    address={address}
  />

  ~ Features ~

  - Ramp opens directly in the application, component uses RampInstantSDK
  - Provide price={price} and current ETH price will be displayed
  - Provide address={address} and your address will be pasted into Wyre/Ramp instantly
**/

export default function Ramp(props) {
  const [open, setOpen] = useState(false);

  const allFaucets = [];
  for (const n in props.networks) {
    if (props.networks[n].chainId !== 31337 && props.networks[n].chainId !== 1) {
      allFaucets.push(
        <button
          key={props.networks[n].chainId}
          type="button"
          style={{ color: props.networks[n].color }}
          className="inline-flex items-center m-0.5 px-5 py-2 border border-transparent text-base font-medium rounded-full shadow-sm bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white"
          onClick={() => {
            window.open(props.networks[n].faucet);
          }}
        >
          {props.networks[n].name}
        </button>,
      );
    }
  }

  const rampAction = () => {
    new RampInstantSDK({
      hostAppName: "scaffold-eth",
      hostLogoUrl: "https://scaffoldeth.io/scaffold-eth.png",
      swapAmount: "100000000000000000", // 0.1 ETH in wei  ?
      swapAsset: "ETH",
      userAddress: props.address,
    })
      .on("*", event => console.log(event))
      .show();
  };

  const buyEthOptions = [
    {
      name: "Wyre",
      emoji: "🇺🇸",
      action: () =>
        window.open("https://pay.sendwyre.com/purchase?destCurrency=ETH&sourceAmount=25&dest=" + props.address),
    },
    { name: "Ramp", emoji: "🇬🇧", action: rampAction },
    { name: "Coinbase", emoji: "🏦", action: () => window.open("https://www.coinbase.com/buy-ethereum") },
  ];

  const ethOptionButtons = buyEthOptions.map(option => {
    return (
      <button
        key={option.name}
        type="button"
        className="inline-flex items-center m-0.5 px-5 py-2 border border-transparent text-base font-medium rounded-full shadow-sm bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white"
        onClick={option.action}
      >
        {option.emoji + " " + option.name}
      </button>
    );
  });

  return (
    <>
      <span
        onClick={() => setOpen(true)}
        className="cursor-pointer inline-flex items-center px-3 py-0.5 rounded-full text-base font-normal bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white"
      >
        🤑 ${typeof props.price === "undefined" ? 0 : props.price.toFixed(2)}
      </span>
      {/* Modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
          <div className="flex items-start justify-center min-h-screen pt-20 px-4 pb-4 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-white focus:outline-none"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Buy ETH
                    </Dialog.Title>
                    <div className="my-2 flex flex-wrap justify-center sm:justify-start">{ethOptionButtons}</div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Testnet ETH</h3>
                    <div className="mt-2 flex flex-wrap justify-center sm:justify-start">{allFaucets}</div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-900 dark:text-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
