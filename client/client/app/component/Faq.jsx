
import React from 'react'
import DisclosureFun from '../utlis/Discloure'

const Faq = () => {
  return (<div  className="bg-gray-900 h-screen">
     <h2 className="md:text-2xl text-center justify-center xs:text-xl lg:text-3xl xl:text-4xl">
            Unleash your inner{" "}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
              programming
            </span>{" "}
            <br />{" "}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
              genius{" "}
            </span>{" "}
            with our community.
          </h2>
    <DisclosureFun />
    </div> )
}

export default Faq