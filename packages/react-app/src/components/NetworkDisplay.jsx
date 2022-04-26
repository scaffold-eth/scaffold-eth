import { Fragment, useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/solid";
import { switchNetworks } from "../helpers";

import { NETWORK } from "../constants";

export default function NetworkDisplay({ NETWORKCHECK, localChainId, selectedChainId, targetNetwork }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState();
  const [body, setBody] = useState();

  useEffect(() => {
    if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
      setNetworkErrorContent(selectedChainId, localChainId);
      setShow(true);
    } else {
      setShow(false);
    }
  }, [NETWORKCHECK, localChainId, selectedChainId]);

  const setNetworkErrorContent = (selectedChainId, localChainId) => {
    if (selectedChainId === 1337 && localChainId === 31337) {
      setTitle("Wrong Network ID");
      setBody(
        <>
          <p>
            You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with HardHat.
          </p>
          <p className="italic">MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337</p>
        </>,
      );
    } else {
      const networkSelected = NETWORK(selectedChainId);
      const networkLocal = NETWORK(localChainId);

      setTitle("Wrong Network");
      setBody(
        <>
          <p>
            You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
            <b>{networkLocal && networkLocal.name}</b>.
          </p>
          <div className="mt-3 flex">
            <button
              type="button"
              className="pointer-events-auto text-sm font-medium text-sky-600 hover:text-sky-500"
              onClick={() => switchNetworks(targetNetwork)}
            >
              Switch Network
            </button>
          </div>
        </>,
      );
    }
  };

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="w-96 rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{title}</h3>
            <div className="mt-2 text-sm text-red-700">{body}</div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
