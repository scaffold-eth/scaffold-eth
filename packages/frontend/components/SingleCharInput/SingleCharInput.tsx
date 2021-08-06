import React, { Component } from 'react'
import PropTypes from 'prop-types'
import fillPolyfill from './fillPolyfill'
import InputBox from './InputBox'

class SingleCharInput extends Component {
  constructor (props) {
    super(props)
    this.state = { characterArray: Array(props.amount).fill(null) }

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.inputElements = {}
    fillPolyfill
  }

  componentDidMount () {
    if (this.props.autoFocus) {
      this.inputElements['input0'].select()
    }
  }

  shouldComponentUpdate (nextProps) {
    if (
      this.props.amount !== nextProps.amount ||
      this.props.inputRegExp !== nextProps.inputRegExp
    ) {
      return true
    }
    return false
  }

  renderItems () {
    let items = []

    for (var i = 0; i < this.props.amount; i++) {
      items.push(
        <InputBox
          type={this.props.password ? 'password' : 'text'}
          key={i}
          handleKeyDown={this.handleKeyDown}
          handleFocus={this.handleFocus}
          handleChange={this.handleChange}
          name={'input' + i}
          inputProps={this.props.inputProps && this.props.inputProps[i]}
          inputRef={el => {
            if (!el) return
            this.inputElements[el.name] = el
          }}
        />
      )
    }

    return items
  }

  render () {
    return (
      <div>
        <div>{this.renderItems()}</div>
      </div>
    )
  }

  handleChange ({ target }) {
    if (target.value.match(this.props.inputRegExp)) {
      this.focusNextChar(target)
      this.setModuleOutput(target)
    } else {
      target.value = this.state.characterArray[target.name.replace('input', '')]
    }
  }

  handleKeyDown ({ target, key }) {
    if (key === 'Backspace') {
      if (target.value === '' && target.previousElementSibling !== null) {
        target.previousElementSibling.value = ''
        this.focusPrevChar(target)
      } else {
        target.value = ''
      }
      this.setModuleOutput(target)
    } else if (key === 'ArrowLeft') {
      this.focusPrevChar(target)
    } else if (key === 'ArrowRight' || key === ' ') {
      this.focusNextChar(target)
    }
  }

  handleFocus ({ target }) {
    var el = target
    // In most browsers .select() does not work without the added timeout.
    setTimeout(function () {
      el.select()
    }, 0)
  }

  focusPrevChar (target) {
    if (target.previousElementSibling !== null) {
      target.previousElementSibling.focus()
    }
  }

  focusNextChar (target) {
    if (target.nextElementSibling !== null) {
      target.nextElementSibling.focus()
    }
  }

  setModuleOutput () {
    this.setState(prevState => {
      let updatedCharacters = prevState.characterArray.map((character, number) => {
        return this.inputElements['input' + number].value
      })
      return {characterArray: updatedCharacters}
    }, () => this.props.handleOutputString(this.state.characterArray.join('')))
  }
}

SingleCharInput.defaultProps = {
  amount: 5,
  autoFocus: false,
  inputRegExp: /^[0-9]$/,
  password: false
}
SingleCharInput.propTypes = {
  amount: PropTypes.number,
  autoFocus: PropTypes.bool,
  inputRegExp: PropTypes.instanceOf(RegExp),
  password: PropTypes.bool,
  handleOutputString: PropTypes.func.isRequired
}

export default SingleCharInput