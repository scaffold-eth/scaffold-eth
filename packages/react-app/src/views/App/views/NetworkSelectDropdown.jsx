import React from 'react'
import { Select } from 'antd'

const NetworkSelectDropdown = ({ networkOptions, targetNetwork }) => {
  const createNetworkSelectOptions = _networkOptions => {
    const options = []
    for (const id in _networkOptions) {
      options.push(
        <Select.Option key={id} value={_networkOptions[id].name}>
          <span style={{ color: _networkOptions[id].color }}>{_networkOptions[id].name}</span>
        </Select.Option>
      )
    }
    return options
  }

  const options = createNetworkSelectOptions(networkOptions)

  return (
    <Select
      defaultValue={targetNetwork.name}
      style={{ textAlign: 'left', width: 200 }}
      onChange={value => {
        if (targetNetwork.chainId !== networkOptions[value].chainId) {
          window.localStorage.setItem('network', value)
          setTimeout(() => {
            window.location.reload()
          }, 1)
        }
      }}
    >
      {options}
    </Select>
  )
}

export default NetworkSelectDropdown
