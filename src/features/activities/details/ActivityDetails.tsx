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
    const { activity, loadActivity, loadingInitial } = activityStore; // TODO: Vidi zasto loadingInitial ne radi
    const [loaded, isLoaded] = useState(false);

    useEffect(() => {
        loadActivity(match.params.id)
        
        .then( // Since load activity is async it goes to detail on second refresh, so I added callback to promise
            () => isLoaded(true)
        )                       
    }, [loadActivity, match.params.id, history])

    // if (loadingInitial ){ // loading initial zeza. activity radi
    //     return <LoadingComponent content='Loading activity...' />
    // }

    // if (!activity){
    //     return history.push('/notfound');
    // }
 
    while(loaded === false){
        return <LoadingComponent content='Loading activity...' /> 
    }

    // if (!activity && loaded) // problem sto uvek vraca na ovo prvo pa tek onda ucita. meni treba loading animacija dok je activity null
    //     return <NotFound />

    if (activity){
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

    return <LoadingComponent content='Loading activity...' />
}

export default observer(ActivityDetails);
