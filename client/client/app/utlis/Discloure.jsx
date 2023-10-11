import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'

export default function DisclosureFun() {
let arr=[1,2,3,4]
  return (
    <div className=" bg-gray-900 ">
    <div className="w-full px-4 pt-16 mb-16  ">
      {arr.map((el)=><div className="mx-auto w-full md:w-4/5 rounded-2xl mt-4">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="border-y-4 h-16 flex w-full justify-between rounded-lg px-4 py-2 text-left xs:text-md align-middle font-medium text-white hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>What is your refund policy?</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-yellow-100">
                If you're unhappy with your purchase for any reason, email us
                within 90 days and we'll refund you in full, no questions asked.
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
       
      </div>)}
    </div>
    </div>
  )
}
