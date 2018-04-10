import React from 'react'
import ViewHeader from './viewHeader'
import { Card, Grid } from 'semantic-ui-react'

class StoreHome extends React.Component {
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
            />
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default StoreHome