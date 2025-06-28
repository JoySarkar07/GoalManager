// Type declaratios

type works = {
    id:string,
    title:string,
    description?:string,
    completed:boolean,
}

type Singlegoal ={
    id:string,
    title:string,
    works?:works[]
}

export interface Groupgoal extends Singlegoal{
    isGroup:boolean,
    goals?: (Singlegoal | Groupgoal) [],
}

export type goalType = (Singlegoal | Groupgoal);

export type sideBarGoalType = {
    _id : string,
    title: string,
    isGroup: boolean,
    subGoals: sideBarGoalType[],
}


export type UpdateWorkType = {
    title?: string,
    description?: string,
    completed?: boolean,
}


export type User = {
    email: string,
    exp?: string, 
    iat?: string,
    id: string,
    name: string,
    notificationPreferences ?:{
        email?: boolean,
        push?: boolean,
    }
}

export type UpdateDataType = {
    name?: string;
    email?: string;
    emailNotification?: boolean;
    webNotification?: boolean;
}
