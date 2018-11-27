import React, { Component, Fragment } from 'react'


import PropTypes from 'prop-types'
import {  DropTarget } from 'react-dnd'
import {ItemTypes, FormItemConfigurable } from './FormField'

//app modules
const boxTarget = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem(), {pos: props.pos})
  }
}
class BordSectorPrototype extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    onDrop: PropTypes.func.isRequired,

  }
  render() {
    const { canDrop, isOver, connectDropTarget, fields, spec } = this.props
    const isActive = canDrop && isOver

    let backgroundColor = '#fff'
    if (isActive) {
      backgroundColor = 'rgba(130,130,130,0.1)'
    } else if (canDrop) {
      backgroundColor = 'rgba(130,130,130,0.3)'
    }

    return connectDropTarget(
      <div
        style={{...{
          flex: 1,
          padding: '10px',
          minHeight: '950px',
          paddingBottom: '180px',
          height: '100%'
        }, backgroundColor }}
      >
        {fields.length ? (
          <div>
            {fields.map(spec => (
              <FormItemConfigurable
                key={spec.tuid}
                spec={spec}
                onRemove={this.props.onRemove}
                onConf={this.props.onConf}
                style={{ marginBottom: '10px' }}
              />
            ))}
          </div>
        ) : isActive ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '5%',
              fontSize: '20px'
            }}
          >
            <div>Release to drop</div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '5%',
              fontSize: '20px'
            }}
          >
            <div>Drag Form Item here</div>
          </div>
        )}
      </div>
    )
  }
}

const BordSector = DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}) ( BordSectorPrototype)

class Bord extends Component {
  render() {
    const { spec } = this.props
    const leftSector = Object.values(spec).filter(field => field.aux.pos.toString() === [0,0].toString() )
    const rightSector = Object.values(spec).filter(field => field.aux.pos.toString() === [0,1].toString() )

    return (
      <div style={{display: 'flex',border: '1px dashed #212121',}}>
        <BordSector fields={leftSector} {...this.props} pos={[0,0]}/>
        <BordSector fields={rightSector} {...this.props} pos={[0,1]}/>
      </div>)
  }
}



export default Bord