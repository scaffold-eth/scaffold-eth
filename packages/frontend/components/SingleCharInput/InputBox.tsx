import React from 'react'
import PropTypes from 'prop-types'

// const Input = styled.input`
//   justify-content: space-between;
//   width: 45px;
//   height: 45px;
//   margin: 5px;
//   border-radius: 5px;
//   text-align: center;
//   font-size: 34px;
//   font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
//     Arial sans-serif;
// `

const InputBox = ({type, handleKeyDown, handleChange, handleFocus, name, inputRef, inputProps}) => {
  return (
    <Input
      {...inputProps}
      type={type}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onFocus={handleFocus}
      maxLength='1'
      name={name}
      ref={inputRef}
    />
  )
  
}

InputBox.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  handleKeyDown: PropTypes.func,
  handleFocus: PropTypes.func,
  handleChange: PropTypes.func,
  inputRef: PropTypes.func,
  inputProps: PropTypes.object
}

export default InputBox