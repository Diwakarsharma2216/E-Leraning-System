"use client"
import Image from 'next/image'
import Hero from "./component/Hero"
import Course from './component/Course'
import Review from './component/Review'
import Faq from './component/Faq'
export default function Home() {
  return (
    <main >
      
    
    <Hero /> 
    <Course />
    <Review />  

    <Faq />
 

    </main>
  )
}
