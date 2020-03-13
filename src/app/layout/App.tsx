import React, { useEffect, Fragment, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { LoadingComponent } from './LoadingComponent';
import ActivityStore from '../stores/activityStore';
import {observer} from 'mobx-react-lite';

// This is how component looks using react hooks
const App = () => {
  // This is how state is defined in react hooks
  const activityStore = useContext(ActivityStore);

  // This is a lifecycle method in react hooks, this is like 3 lifecycle methods rolled into one
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]); // By adding a second parameter we ensure that useEffect is only calling once (doesn't call again on re-render)
          // Without []. it goes into a loop!!! inside [] we specify dependencies

  if (activityStore.loadingInitial) 
    return <LoadingComponent content={'Loading activities...'} />

  return (
      <Fragment>
        <NavBar />
        <Container style={{marginTop: '7em'}}>
          <ActivityDashboard />
        </Container>
      </Fragment>
  );     
 
}

export default observer(App); // Observers are higher order apps needed for mobX 
