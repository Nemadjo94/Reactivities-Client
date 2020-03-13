import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({enforceActions: 'always'}); // use mobx strict mode

class ActivityStore {
  // Set our initial application state
  @observable activityRegistry = new Map(); // for storing activities
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = '';

  // Sort activities by date
  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values())
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  // action to load our activities from api
  @action loadActivities = async () => {
    // MobX allows us to mutate our state while Redux and React doesnt
    this.loadingInitial = true; // starts loading indicator

    try {
      const activities = await agent.Activities.list()
      runInAction('loading activities', () => { // 'loading activities' is just the name of action, useful for mobx dev tools
        activities.forEach(activity => {
        activity.date = activity.date.split(".")[0];
        this.activityRegistry.set(activity.id, activity);
      });
        this.loadingInitial = false;
      });
    } catch (error){
      runInAction('load activities error', () => {
        this.loadingInitial = false;
      });
      console.log(error);    
    }
  };

  // action to create activity
  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.create(activity);
      runInAction('creating activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.editMode = false;
        this.submitting = false;
      })
      
    } catch (error){
        runInAction('create activity error', () => {
           this.submitting = false;
        })
      console.log(error);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.update(activity);
      runInAction('editing activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      })   
    } catch (error) {
      runInAction('edit activity error', () => {
        this.submitting = false;
      })
      console.log(error);
    }
  }

  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;

    try {
      await agent.Activities.delete(id);
      runInAction('deleting activity', () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      })
    } catch (error) {
      runInAction('delete activity error', () => {
        this.submitting = false;
        this.target = '';
      })
      console.log(error);
    }
  }

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  }

  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  }

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  }

  @action cancelFormOpen = () => {
    this.editMode = false;
  }

  @action selectActivity = (id: string) => {
      this.selectedActivity = this.activityRegistry.get(id);
      this.editMode = false;
  };
}

export default createContext(new ActivityStore());
