'use client'

import DoForU from "@/wigets/layouts/ui/main/do_for_u";
import HowItWorks from "@/wigets/layouts/ui/main/how_it_works";
import OurAdvantages from "@/wigets/layouts/ui/main/our_advantages";
import OurSalesPage from "@/wigets/layouts/ui/main/our_sales";
import UniqeMeal from "@/wigets/layouts/ui/main/uniqe_meal";
import { useState, useEffect } from 'react'
import "./globals.css";

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <main>
      <UniqeMeal />

      <OurSalesPage />

      <HowItWorks />

      <DoForU />

      <OurAdvantages />

      <button
        className={`scroll-top-button ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Наверх"
      >
        ⭡
      </button>
    </main>
  )
}