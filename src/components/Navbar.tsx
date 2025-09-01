import Image from "next/image"
import Link from "next/link"
import Button from "./Button"

const NAV_LINKS = [
  { href: '/', key: 'home', label: 'Home' },
  { href: '/', key: 'explore', label: 'Explore' },
];

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 relative z-30 py-5">
      <Link href="/">
        <Image src="/assets/icons/SkillPilotIcon.png" alt="logo" width={74} height={74} />
      </Link>

      <ul className="hidden lg:flex h-full gap-12 items-center">
        {NAV_LINKS.map((link) => (
          <Link href={link.href} key={link.key} className="text-2xl font-bold">
            {link.label}
          </Link>
        ))}
      </ul>

      <div className="hidden lg:flex lg:items-center">
        <Button
          type="button"
          title="Login"
          icon="/assets/icons/menu.svg"
          variant="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
        />
      </div>

      <Image 
      src="/assets/icons/menu.svg"
      alt="menu"
      width={24}
      height={24}
      className="inline-block cursor-pointer lg:hidden"
      />

    </nav>
  )
}

export default Navbar