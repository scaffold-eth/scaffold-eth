import {
  Link as ChakraLink,
  LinkProps,
  useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

interface NavLinkProps extends LinkProps {
  children?: string | React.ReactNode
  to: string
  activeProps?: LinkProps
  _hover?: LinkProps
}

function NavLink({
  to,
  activeProps,
  children,
  _hover,
  ...props
}: NavLinkProps): JSX.Element {
  const router = useRouter()
  const isActive = router.pathname === to
  const color = useColorModeValue('black', 'selected')

  return (
    <Link href={to} passHref>
      <ChakraLink
        {...props}
        {...activeProps}
        _hover={{ color: 'selected' }}
        style={{ position: 'relative' }}
        color={color}
      >
        {children}
        <div
          style={{
            content: '',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '.7rem',
            height: '.15rem',
            background: isActive ? '#000' : 'transparent',
          }}
        ></div>
      </ChakraLink>
    </Link>
  )
}

export default NavLink
