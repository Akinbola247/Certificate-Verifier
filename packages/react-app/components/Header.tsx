import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import logo from '../assets/logo.png';

export default function Header() {
    return (
      <Disclosure as="nav" className="border-none mt-[10px]">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  {/* <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black focus:outline-none focus:ring-1 focus:ring-inset focus:rounded-none focus:ring-black">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button> */}
                </div>
                <div className="flex flex-1 items-center lg:ml-[30px] sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center space-x-2">
                    <Image className="block sm:block lg:block" src={logo} width="45" height="50" alt="educert Logo" />
                    <h1 className="text-[30px] font-[700] text-[#FFFFFF]">Edu<span className="text-[#EC27B6]">Cert</span></h1>
                  </div>
                 
                </div>
                <div className="absolute lg:space-x-6 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <h1 className="text-[14px] font-[400] h-[20px] w-[120px]">Create Account</h1>
                  <h1 className="text-[14px] font-[400] h-[20px] w-[89px]">About Us</h1>
                <ConnectButton showBalance={{smallScreen: true, largeScreen: false}} />
                </div>
              </div>
            </div>
  
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pt-2 pb-4">
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block border-l-4 border-black py-2 pl-3 pr-4 text-base font-medium text-black"
                >
                  Home
                </Disclosure.Button>
                {/* Add here your custom menu elements */}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    )
  }