import React, { Fragment, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { classNames, switchNetworks } from "../helpers";
import { NETWORKS } from "../constants";

export default function NetworkSwitch({ networkOptions, selectedNetwork, setSelectedNetwork }) {
  const selectorEnabled = networkOptions.length > 1;

  const switchAndSetSelectedNetwork = network => {
    switchNetworks(NETWORKS[network]);
    setSelectedNetwork(network);
  };

  return (
    <Listbox value={selectedNetwork} onChange={network => switchAndSetSelectedNetwork(network)}>
      {({ open }) => (
        <>
          <div className="relative self-center ml-4 md:ml-6">
            <Listbox.Button
              className={classNames(
                selectorEnabled ? "pl-4 pr-8 cursor-pointer" : "px-4 cursor-default",
                "flex relative w-full py-3 border border-transparent text-lg text-gray-900 leading-4 font-normal rounded-full shadow-sm bg-slate-200 focus:outline-none dark:bg-neutral-900 dark:text-white",
              )}
            >
              <span className="block border border-transparent">{selectedNetwork}</span>
              {selectorEnabled && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              )}
            </Listbox.Button>

            <Transition
              show={selectorEnabled && open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {networkOptions.map(network => (
                  <Listbox.Option
                    key={network}
                    style={{ color: NETWORKS[network].color }}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-gray-100 dark:bg-gray-800" : "text-gray-900",
                        "cursor-pointer select-none relative py-2 pl-3 pr-9 dark:hover:bg-gray-800",
                      )
                    }
                    value={network}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? "font-semibold" : "font-medium", "block text-lg")}>
                          {network}
                        </span>

                        {selected ? (
                          <span
                            style={{ color: NETWORKS[network].color }}
                            className={classNames(
                              active ? "text-white" : "",
                              "absolute inset-y-0 right-0 flex items-center pr-2",
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
