import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'

interface NavLinkProps {
  children?: string | React.ReactNode,
  to: string,
  as?: string,
  style?: any,
}

function NavLink({ to, children, as, style, ...props }: NavLinkProps): JSX.Element {
  const router = useRouter()
  const isActive = router.pathname.includes(to) || router.asPath === to

  return (
    <Link href={to} as={as}>
      <Button
        type="button"
        className={`btn ${isActive ? 'btn-black is-active' : 'btn-white'}`}
        style={style}
        {...props}
      >
        {children}
      </Button>
    </Link>
  )
}

const Button = styled.div`
  display: inline-flex;
  appearance: none;
  align-items: center;
  justify-content: center;
  -webkit-transition: all 250ms;
  transition: all 250ms;
  user-select: none;
  position: relative;
  white-space: nowrap;
  vertical-align: middle;
  outline: 2px solid transparent;
  outline-offset: 2px;
  width: auto;
  line-height: 1.2;
  border-radius: var(--chakra-radii-md);
  font-weight: var(--chakra-fontWeights-semibold);
  height: var(--chakra-sizes-10);
  min-width: var(--chakra-sizes-10);
  font-size: var(--chakra-fontSizes-md);
  padding-inline-start: var(--chakra-space-4);
  padding-inline-end: var(--chakra-space-4);
  cursor: pointer;

  &:hover:not(.is-active) {
    background: var(--chakra-colors-gray-200);
  }

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 0.7rem;
    height: 0.15rem;
  }

  &.btn-black {
    &::before {
      background: #fff;
    }
  }
  &.btn-white {
    &::before {
      background: transparent;
    }
  }
`
export default NavLink
