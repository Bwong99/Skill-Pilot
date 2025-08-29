import Image from "next/image"
import Link from "next/link"

const NAV_LINKS = [
  { href: '/', key: 'home', label: 'Home' },
  { href: '/', key: 'explore', label: 'Explore' },
];

const Navbar = () => {
  return (
    <nav className="flexBetween max-container padding-container relative z-30 py-5">
      <Link href="/">
        <Image src="/assets/icons/SkillPilotIcon.png" alt="logo" width={74} height={74} />
      </Link>

      <ul className="flex h-full gap-12 items-center">
        {NAV_LINKS.map((link) => (
          <Link href={link.href} key={link.key} className="text-2xl font-bold">
            {link.label}
          </Link>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar