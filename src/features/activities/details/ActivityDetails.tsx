import React, { useContext, useEffect, useState } from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps, Link } from 'react-router-dom';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';

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
        <Card fluid>
            <Image src={`/assets/categories/${activity!.category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{activity!.title != null ? activity!.title : "No Title"}</Card.Header>
                <Card.Meta>
                    <span>{activity!.date != null ? activity!.date : "No date specified"}</span>
                </Card.Meta>
                <Card.Description>
                    {activity!.description != null ? activity!.description : "No description specified"}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={2}>
                    <Button as={Link} to={`/manage/${activity!.id}`} basic color='blue' content='Edit' />
                    <Button onClick={() => history.push('/activities')} basic color='red' content='Cancel' />
                </Button.Group>
            </Card.Content>
        </Card>
        )
    }

    return <h1>Error... Something went wrong.</h1> // TODO: make this route back to activities
}

export default observer(ActivityDetails);
