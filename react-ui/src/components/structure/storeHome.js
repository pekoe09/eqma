import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ViewHeader from './viewHeader'
import { Card, Grid } from 'semantic-ui-react'
import { setFilter } from '../../reducers/filterReducer'

class StoreHome extends React.Component {

  handleCardClick = (typeName) => {
    const equipmentType = this.props.equipmentTypes.find(t => t.name === typeName)
    this.props.setFilter({
      key: 'equipmentType',
      value: equipmentType ? equipmentType._id : ''
    })
    this.props.setFilter({
      key: 'priceFrom',
      value: 0
    })
    this.props.setFilter({
      key: 'priceTo',
      value: 0
    })
    this.props.history.push('/equipment/forrent')
  }

  render() {
    return (
      <div>
        <ViewHeader text={'EqMa - Best equipment for you!'} />
        <Grid columns={3}>
          <Grid.Column>
            <Card
              image='/img/excavator_crop.png'
              header='Heavy excavators'
              meta='For huuuge projects'
              description="Need to dig a giant hole? With one of these, it's a breeze!"
              centered
              fluid
              onClick={() => this.handleCardClick('Heavy excavators')}
            />
          </Grid.Column>
          <Grid.Column>
            <Card
              image='/img/drill_cropped.jpg'
              header='Drills'
              meta='Mining and exploration'
              description="Digging for gold? Can't miss these!"
              centered
              fluid
              onClick={() => this.handleCardClick('Drills')}
            />
          </Grid.Column>
          <Grid.Column>
            <Card
              image='/img/shovel.jpg'
              header='Shovels'
              meta='Gardening tools'
              description="Burying something? We got you covered!"
              centered
              fluid
              onClick={() => this.handleCardClick('Hand tools')}
            />
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    equipmentTypes: store.equipmentTypes
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    setFilter
  }
)(StoreHome)) 