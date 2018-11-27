import React, { Component, } from 'react'
import {  Button, Modal } from 'antd'
import {  DragDropContext, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import uuidv4 from 'uuid/v4'
import { GenerateFieldSpec } from './FieldSpec'
import ConfigureItem from './ConfigureField'
import SidePanel from './SidePanel'
import Bord from './Bord'

@DragDropContext(HTML5Backend)
class FormBuilder extends Component {
  state = {
    spec: {},
    editItemSpec: null
  }

  onDrop = (item, opt) => {
    const newSpec = {...this.state.spec}
    const newItem = GenerateFieldSpec[item.type](opt)
    newSpec[newItem.tuid] = newItem
    this.setState({
      spec: newSpec,
      editItemSpec: {...newItem}
    })
  }

  onRemove = tuid => {
    const newSpec = {...this.state.spec}
    delete newSpec[tuid]
    this.setState({editItemSpec: null, spec: newSpec })
  }

  onConf = tuid => {
    const { spec } = this.state
    const newSpec = {...spec}
    this.setState({ editItemSpec: { ...newSpec[tuid]}, spec: newSpec })
  }
  onDoneConf = ( errors, values) => {
    if(errors) {
      console.warn(errors)
      return
    }
    const { spec, editItemSpec } = this.state

    const newSpec = {...spec }
    if(values.options){
      values.options = Object.values(values.options)
    }
    const newEditItemSpec = {...editItemSpec, ...values}
    if(newEditItemSpec){
      if( Object.values(spec).some( ({tuid, key}) =>
        key === newEditItemSpec.key &&
        tuid !== newEditItemSpec.tuid )) {
        Modal.warning({
          title: 'Duplicated key',
          content: 'Item with this key already exists',
        })
        return
      }
      const itemSpec = {...newEditItemSpec}

      newSpec[editItemSpec.tuid] = itemSpec
    }
    this.setState({ editItemSpec: null, spec: newSpec })
  }
  onCancelConf = tuid => {
    this.setState({ editItemSpec: null})
  }
  onOk = () => {
    return this.props.onOk( this.state.spec )
  }

  render() {
    const { spec, editItemSpec } = this.state
    return (
      <div>
        <div style={{ display: 'flex', minHeight: '400px' }}>
          <div  style={{width:'100%', paddingRight: '10px'}}>
            <Bord
              spec={spec}
              allowedDropEffect
              onDrop={this.onDrop}
              onRemove={this.onRemove}
              onConf={this.onConf}
            />
          </div>
          <div
            style={{
              minWidth: '180px',
              width: '320px'
            }}
          >
            {editItemSpec ? (
              <ConfigureItem
                editItemSpec={editItemSpec}
                onDone={this.onDoneConf}
                onCancel={this.onCancelConf}
              />
            ) : (
              <SidePanel />
            )}
          </div>


        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '20px'
          }}
        >
          <Button type="primary" ghost onClick={this.onOk}>
           Save
          </Button>
        </div>
      </div>
    )
  }
}

export default FormBuilder
