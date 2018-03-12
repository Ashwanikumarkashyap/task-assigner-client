import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TodoCreateComponent } from '../todo-create/todo-create.component';
import {Todo} from '../shared/todo';
// import {NotificationCount} from '../shared/notificationCount';
import { TodoService } from '../services/todo.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  todos: Todo[];
  todosUnfinished: Todo[];
  todosFinished: Todo[];
  todosByUserUnfinished: Todo[];
  todosByUserFinished: Todo[];
  todosToUserUnfinished: Todo[];
  todosToUserFinished: Todo[];
  userRequest: boolean = false;
  todoRequest: boolean = false;

  username: string = undefined;

  UserSubscription: Subscription;
  errMess: string;

  constructor(public dialog: MatDialog, private authService: AuthService,
    private todoService: TodoService) {
  }

  ngOnInit() {

    this.UserSubscription = this.authService.getUsername()
    .subscribe(name => { 
      this.username = name;
      if (name!=undefined) {
        this.todoService.getTodosObs()
        .subscribe(todosObs => {
          this.todoRequest = false;
          this.todos = todosObs;
          this.seperateTodos(this.username);
        }, (error) => {
          this.todoRequest = false;
          console.log("Error in getting todo");
        });

        this.todoRequest = true;
        this.getTodos();
      }
      this.userRequest = true;
    });

    this.authService.loadUserCredentials();  
  }

  ngOnDestroy() {
    this.UserSubscription.unsubscribe();
  }

  openTodoCreateForm() {
    let todoCreate = this.dialog.open(TodoCreateComponent, {width: '500px', height: '475px', data: this.username});

    todoCreate.afterClosed()
      .subscribe(result => {
        // console.log(result);
      });
  }

  getTodos() {
    this.todoService.getTodos().subscribe(resp => {
    }, errmess => this.errMess = <any>errmess);
  }

  seperateTodos(username: string) {

    var todosUnfinished: Todo[] = [];
    var todosFinished: Todo[] = [];

    var todosByUserUnfinished: Todo[] = [];
    var todosByUserFinished: Todo[] = [];

    var todosToUserUnfinished: Todo[] = [];
    var todosToUserFinished: Todo[] = [];
    
    for (var i = 0; i< this.todos.length;i++) {
        
      if (this.todos[i].finishedBy == "") {
        todosUnfinished.push(this.todos[i]);
        if ( this.todos[i].author == username ) {
          todosByUserUnfinished.push(this.todos[i]);  
        }
        if (this.todos[i].assignTo==null || this.todos[i].assignTo.length == 0 || 
            (this.todos[i].assignTo!=null && this.todos[i].assignTo.indexOf(username)!= -1 )) {
          todosToUserUnfinished.push(this.todos[i]);
        }
      } else {
        todosFinished.push(this.todos[i]);
        if ( this.todos[i].author == username ) {
          todosByUserFinished.push(this.todos[i]);  
        }
        if (this.todos[i].assignTo==null || this.todos[i].assignTo.length == 0 || 
            (this.todos[i].assignTo!=null && this.todos[i].assignTo.indexOf(username)!= -1 )) {
          todosToUserFinished.push(this.todos[i]);
        }
      }

    }

    this.todosUnfinished = todosUnfinished;
    this.todosFinished = todosFinished;

    this.todosByUserUnfinished = todosByUserUnfinished;
    this.todosByUserFinished = todosByUserFinished;

    this.todosToUserUnfinished = todosToUserUnfinished;
    this.todosToUserFinished = todosToUserFinished;

  }

}
