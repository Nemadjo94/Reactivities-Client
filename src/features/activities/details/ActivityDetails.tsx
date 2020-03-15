import React, { useContext, useEffect, useState } from 'react'
import { Grid } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

interface DetailParams {
    id: string
}

export const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {

    const activityStore = useContext(ActivityStore);
    const { activity, loadActivity, loadingInitial } = activityStore;
    const [loaded, isLoaded] = useState(false); // 

    useEffect(() => {
        loadActivity(match.params.id).then( // Since load activity is async it goes to detail on second refresh, so I added callback to promise
            () => isLoaded(true) // Treba staviti da ako ne postoji ta aktivnost da se vrati nazad na activities
        )                       // Ovako ce samo da ga vrti u krug ako nema ta aktivnost
    }, [loadActivity, match.params.id])

    if (loadingInitial || !activity ){
        return <LoadingComponent content='Loading activity...' />
    }

    if (loaded){
         return (
            <Grid>
                <Grid.Column width={10}>
                    <ActivityDetailedHeader activity={activity} />
                    <ActivityDetailedInfo activity={activity}/>
                    <ActivityDetailedChat />
                </Grid.Column>
                <Grid.Column width={6}>
                    <ActivityDetailedSidebar />
                </Grid.Column>
            </Grid>
        )
    }

    return <h1>Error... Something went wrong.</h1> // TODO: make this route back to activities
}

export default observer(ActivityDetails);
