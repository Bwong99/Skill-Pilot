'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Hide navbar on welcome page
  if (pathname === '/welcome') {
    return null
  }
  
  return <Navbar />
}
