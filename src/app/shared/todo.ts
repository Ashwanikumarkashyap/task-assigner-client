export class Comment {
    comment: string;
    author: string;
}

export class Todo {
    author: string;
    title: string;
    description: string;
    image: string;
    category: string;
    priority: number;
    finishedBy: string;
    assignTo: string;
    _id: string;
    comments: [Comment];
}