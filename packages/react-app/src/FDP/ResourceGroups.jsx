import React, { Component } from "react";

export class ResourceGroups extends Component {
  constructor(props) {
    super(props);
    this.selectRef = React.createRef();
  }

  find(id) {
    if (!this.props.items) {
      return null;
    }
    return this.props.items.find(item => item.id === id);
  }

  componentDidMount() {
    if (this.props.items && this.props.items.length > 0) {
      setTimeout(() => this.doOnChange(this.props.items[0]), 0);
    }
  }

  render() {
    return (
      <span>
        Group: &nbsp;
        <select onChange={ev => this.change(ev)} ref={this.selectRef}>
          {this.props.items.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </span>
    );
  }

  change(ev) {
    const value = ev.target.value;
    const item = this.find(value);
    this.doOnChange(item);
  }

  doOnChange(location) {
    const args = { selected: location };
    if (this.props.onChange) {
      this.props.onChange(args);
    }
  }

  get selectedValue() {
    return this.selectRef.current.value;
  }
}

export default ResourceGroups;
