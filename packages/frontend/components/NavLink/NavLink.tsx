import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import styles from "./NavLink.module.scss"

interface NavLinkProps {
  children?: string | React.ReactNode
  to: string,
  as?: string
}

function NavLink({
  to,
  children,
  as,
  ...props
}: NavLinkProps): JSX.Element {
  const router = useRouter()
  const isActive = router.pathname === to

  return (
    <Link href={to} as={as}>
      <button
        type="button"
        className={`btn ${isActive ? 'btn-black' : 'btn-white'} ${styles["nav-link"]}`}
        {...props}
      >
        {children}
      </button>
    </Link>
  )
}

export default NavLink
