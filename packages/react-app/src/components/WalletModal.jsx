import React, { Fragment, useState, useEffect } from "react";
import { ethers } from "ethers";
import QR from "qrcode.react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { DocumentDuplicateIcon, CheckCircleIcon } from "@heroicons/react/outline";

import { Transactor, classNames } from "../helpers";
import Address from "./Address";
import AddressInput from "./AddressInput";
import Balance from "./Balance";
import EtherInput from "./EtherInput";

/**
  ~ What it does? ~

  Displays a wallet where you can specify address and send USD/ETH, with options to
  scan address, to convert between USD and ETH, to see and generate private keys,
  to send, receive and extract the burner wallet

  ~ How can I use? ~

  <WalletModal
    address={address}
    provider={localProvider}
    signer={userSigner}
    ensProvider={mainnetProvider}
    price={price}
    open={walletOpen}
    setOpen={setWalletOpen}
  />

  ~ Features ~

  - Provide provider={userProvider} to display a wallet
  - Provide address={address} if you want to specify address, otherwise
                                                    your default address will be used
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
  - Provide price={price} of ether and easily convert between USD and ETH
**/

const DISPLAY_STATES = {
  qr: "qr",
  private_key: "private_key",
};

export default function WalletModal(props) {
  const [signerAddress, setSignerAddress] = useState();
  const [privateKeyCopied, setPrivateKeyCopied] = useState(false);

  const copyPrivateKey = (e, privateKey) => {
    e.stopPropagation();
    navigator.clipboard.writeText(privateKey);
    setPrivateKeyCopied(true);
    setTimeout(() => {
      setPrivateKeyCopied(false);
    }, 800);
  };

  useEffect(() => {
    async function getAddress() {
      if (props.signer) {
        const newAddress = await props.signer.getAddress();
        setSignerAddress(newAddress);
      }
    }
    getAddress();
  }, [props.signer]);

  const selectedAddress = props.address || signerAddress;
  const open = props.open || false;
  const setOpen = props.setOpen;

  const [amount, setAmount] = useState();
  const [toAddress, setToAddress] = useState();
  const [displayState, setDisplayState] = useState();

  let display;
  switch (displayState) {
    case DISPLAY_STATES.qr:
      display = (
        <div>
          <QR
            value={selectedAddress}
            size="450"
            level="H"
            includeMargin
            renderAs="svg"
            imageSettings={{ excavate: false }}
          />
        </div>
      );

      break;
    case DISPLAY_STATES.private_key:
      const pk = localStorage.getItem("metaPrivateKey");
      const wallet = new ethers.Wallet(pk);

      if (wallet.address !== selectedAddress) {
        display = <p className="text-sm text-gray-500">Using injected account: private key unknown.</p>;
        break;
      }

      const extraPkDisplayAdded = {};
      const extraPkDisplay = [];
      extraPkDisplayAdded[wallet.address] = true;
      extraPkDisplay.push(
        <div style={{ fontSize: 16, padding: 2, backgroundStyle: "#89e789" }}>
          <a href={"/pk#" + pk}>
            <Address minimized address={wallet.address} ensProvider={props.ensProvider} /> {wallet.address.substr(0, 6)}
          </a>
        </div>,
      );

      for (const key in localStorage) {
        if (key.indexOf("metaPrivateKey_backup") >= 0) {
          console.log(key);
          const pastpk = localStorage.getItem(key);
          const pastwallet = new ethers.Wallet(pastpk);
          if (!extraPkDisplayAdded[pastwallet.address] /* && selectedAddress!=pastwallet.address */) {
            extraPkDisplayAdded[pastwallet.address] = true;
            extraPkDisplay.push(
              <div style={{ fontSize: 16 }}>
                <a href={"/pk#" + pastpk}>
                  <Address minimized address={pastwallet.address} ensProvider={props.ensProvider} />{" "}
                  {pastwallet.address.substr(0, 6)}
                </a>
              </div>,
            );
          }
        }
      }

      display = (
        <div className="dark:text-white">
          <b>Private Key: </b>
          <span className="break-all">
            {pk}
            {privateKeyCopied ? (
              <CheckCircleIcon
                className="inline-block ml-1 font-normal text-sky-600 h-4 w-4 cursor-pointer"
                aria-hidden="true"
              />
            ) : (
              <DocumentDuplicateIcon
                className="inline-block ml-1 font-normal text-sky-600 h-4 w-4 cursor-pointer"
                aria-hidden="true"
                onClick={e => copyPrivateKey(e, pk)}
              />
            )}
          </span>

          <hr className="dark:border-gray-700" />

          <i>
            Point your camera phone at qr code to open in{" "}
            <a target="_blank" href={"https://xdai.io/" + pk} rel="noopener noreferrer">
              burner wallet
            </a>
          </i>
          <div class="flex justify-center">
            <QR
              value={"https://xdai.io/" + pk}
              size="300"
              level="H"
              includeMargin
              renderAs="svg"
              imageSettings={{ excavate: false }}
            />
          </div>
          {extraPkDisplay ? (
            <div>
              <h3 className="dark:text-white">Known Private Keys:</h3>
              {extraPkDisplay}
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:w-auto sm:text-sm"
                onClick={() => {
                  const currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
                  if (currentPrivateKey) {
                    window.localStorage.setItem("metaPrivateKey_backup" + Date.now(), currentPrivateKey);
                  }
                  const randomWallet = ethers.Wallet.createRandom();
                  const privateKey = randomWallet._signingKey().privateKey;
                  window.localStorage.setItem("metaPrivateKey", privateKey);
                  window.location.reload();
                }}
              >
                Generate
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      );

      break;
    default:
      const inputStyle = {
        padding: 10,
      };

      display = (
        <div>
          <div style={inputStyle}>
            <AddressInput autoFocus ensProvider={props.ensProvider} address={toAddress} onChange={setToAddress} />
          </div>
          <div style={inputStyle}>
            <EtherInput
              price={props.price}
              value={amount}
              onChange={value => {
                setAmount(value);
              }}
            />
          </div>
        </div>
      );
  }

  const sendTx = () => {
    const tx = Transactor(props.signer || props.provider);

    let value;
    try {
      value = ethers.utils.parseEther("" + amount);
    } catch (e) {
      // failed to parseEther, try something else
      value = ethers.utils.parseEther("" + parseFloat(amount).toFixed(8));
    }

    tx({
      to: toAddress,
      value,
    });
  };

  const tabs = [
    { name: "Send", action: () => setDisplayState(), current: !displayState },
    { name: "Receive", action: () => setDisplayState(DISPLAY_STATES.qr), current: displayState === DISPLAY_STATES.qr },
    {
      name: "Private Key",
      action: () => setDisplayState(DISPLAY_STATES.private_key),
      current: displayState === DISPLAY_STATES.private_key,
    },
  ];

  return (
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
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" />
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
            <div className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all w-full sm:my-8 sm:align-middle sm:max-w-lg sm:p-6">
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
              <div className="">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="flex justify-center sm:justify-start text-lg leading-6 font-normal text-gray-900"
                  >
                    <Address address={selectedAddress} ensProvider={props.ensProvider} />
                    <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white">
                      <Balance
                        address={selectedAddress}
                        provider={props.provider}
                        dollarMultiplier={props.price}
                        textSize={"text-lg"}
                      />
                    </span>
                  </Dialog.Title>

                  {/* Tab List */}
                  <div>
                    <div className="block">
                      <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex justify-center sm:justify-start space-x-8" aria-label="Tabs">
                          {tabs.map(tab => (
                            <span
                              key={tab.name}
                              onClick={tab.action}
                              className={classNames(
                                tab.current
                                  ? "border-sky-500 text-sky-600"
                                  : "border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-gray-300",
                                "cursor-pointer whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm",
                              )}
                              aria-current={tab.current ? "page" : undefined}
                            >
                              {tab.name}
                            </span>
                          ))}
                        </nav>
                      </div>
                    </div>
                  </div>
                  {/* End Tab List */}

                  <div className="mt-2">{display}</div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                {!displayState && (
                  <button
                    type="button"
                    disabled={!amount || !toAddress}
                    className={classNames(
                      !amount || !toAddress ? "opacity-50 cursor-not-allowed" : "hover:bg-sky-700",
                      "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:ml-3 sm:w-auto sm:text-sm",
                    )}
                    onClick={sendTx}
                  >
                    Send
                  </button>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
