import React, { useContext } from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';

export const ActivityDetails: React.FC = () => {

    const activityStore = useContext(ActivityStore);
    const {selectedActivity: activity, openEditForm, cancelSelectedActivity} = activityStore;

    return (
        
        activity! ?
        (<Card fluid>
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
                    <Button onClick={() => openEditForm(activity!.id)} basic color='blue' content='Edit' />
                    <Button onClick={cancelSelectedActivity} basic color='red' content='Cancel' />
                </Button.Group>
            </Card.Content>
        </Card>)
        : <></>
        
    )
}

export default observer(ActivityDetails);
