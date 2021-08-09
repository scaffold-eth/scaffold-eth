import styled from 'styled-components'

function ModalCloseButton({ onClick } : { onClick: any}): JSX.Element {

  return (
    <Button type="button" onClick={onClick}>
      <svg
        id="Group_38"
        data-name="Group 38"
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 62.962 62.962"
      >
        <path
          id="Path_78"
          data-name="Path 78"
          d="M0,0H62.962V62.962H0Z"
          fill="none"
        />
        <rect
          id="Rectangle_28"
          data-name="Rectangle 28"
          width="42.562"
          height="42.562"
          rx="2"
          transform="translate(9.822 9.822)"
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <path
          id="Path_79"
          data-name="Path 79"
          d="M10,10,20.494,20.494m0-10.494L10,20.494"
          transform="translate(16.234 16.234)"
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      </svg>
    </Button>
  )
}

const Button = styled.button`
  padding: 0.5rem;
  position: absolute;
  top: 1rem;
  right: 1rem;
  outline: none;
  border: none;
`

export default ModalCloseButton
