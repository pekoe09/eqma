import React from 'react'
import ViewHeader from '../structure/viewHeader'
import { Grid } from 'semantic-ui-react'
import MapContainer from './mapContainer'
import ContactDetails from './contactDetails'
import ContactForm from './contactForm'

class ContactView extends React.Component {
  render() {
    return (
      <div>
        <ViewHeader text={'Contact us - 24/7!'} />
        <Grid columns={2}>
          <Grid.Column>
            <ContactDetails />
            <MapContainer />
          </Grid.Column>
          <Grid.Column>
            <ContactForm />
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default ContactView