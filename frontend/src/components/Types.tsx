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