import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import {observer} from 'mobx-react-lite';
import { Route, withRouter, RouteComponentProps, Switch } from 'react-router-dom';
import { HomePage } from '../../features/home/HomePage';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activities/form/ActivityForm';
import { ActivityDetails } from '../../features/activities/details/ActivityDetails';
import { NotFound } from './NotFound';
import { ToastContainer } from 'react-toastify';

// This is how component looks using react hooks
const App: React.FC<RouteComponentProps> = ({location}) => {
  // This is how state is defined in react hooks
  //const activityStore = useContext(ActivityStore);

  // // This is a lifecycle method in react hooks, this is like 3 lifecycle methods rolled into one
  // useEffect(() => {
  //   activityStore.loadActivities();
  // }, [activityStore]); // By adding a second parameter we ensure that useEffect is only calling once (doesn't call again on re-render)
  //         // Without []. it goes into a loop!!! inside [] we specify dependencies

  // if (activityStore.loadingInitial) 
  //   return <LoadingComponent content={'Loading activities...'} />

  return (
      <Fragment>
        <ToastContainer position='bottom-right' />
        <Route exact path='/' component={HomePage} />
        <Route path={'/(.+)'} render={() => (
          <Fragment> 
            <NavBar />
            <Container style={{marginTop: '7em'}}>
              <Switch>
                <Route exact path='/activities' component={ActivityDashboard} />
                <Route path='/activities/:id' component={ActivityDetails} />
                <Route 
                  key={location.key}
                  path={['/createActivity', '/manage/:id']} 
                  component={ActivityForm} 
                />
                <Route path='/notfound' component={NotFound} />
              </Switch>
            </Container>
          </Fragment>  
        )}/>
        
      </Fragment>
  );     
 
};

export default withRouter(observer(App)); // Observers are higher order apps needed for mobX 
