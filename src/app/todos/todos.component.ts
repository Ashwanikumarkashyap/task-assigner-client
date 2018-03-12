import { Component, OnInit, Input } from '@angular/core';
import { TodoService } from '../services/todo.service';
import {Todo} from '../shared/todo';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TodoDetailComponent } from '../todo-detail/todo-detail.component';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {

  @Input()
  username: string;

  @Input()
  todos: Todo[];

  @Input()
  todoRequest: boolean;
  errMess: string;
  constructor(public dialog: MatDialog, private todoService: TodoService) { }

  ngOnInit() {
  }

  openTodoDetail(todo: Todo) {
    if (this.todoRequest) {
      // console.log("A request is already pending");
      return;
    }
    let todoDetial = this.dialog.open(TodoDetailComponent,  {width: '500px', height: '475px',
    data: {"todo": todo, "username": this.username} });

    todoDetial.afterClosed()
      .subscribe(result => {
        // console.log(result);
      });
  }

  finishTodo(todo: Todo) {
    if (this.todoRequest) {
      // console.log("A request is already pending");
      return;
    }
    this.todoRequest = true;
    this.todoService.finishTodo(todo).subscribe(resp => {
      if (resp.success) {
        console.log("successfully marked as finished");
        //get for todos | refresh
        this.todoService.getTodos().subscribe(todos => {
          this.todoRequest = false
        }, errmess => {
          this.todoRequest = false;
          this.errMess = <any>errmess
        });
      } else if (!resp.success) {
        this.todoRequest = false;
        console.log("todo does'nt exist");
      }
    }, errmess => {
      this.todoRequest = false;
      this.errMess = <any>errmess
    });
  }

  unfinishTodo(todo: Todo) {
    if (this.todoRequest) {
      // console.log("A request is already pending");
      return;
    }
    this.todoRequest = true;
    this.todoService.unFinishTodo(todo).subscribe(resp => {
      if (resp.success) {
        console.log("successfully marked unFinished");
        
        //get for todos | refresh
        this.todoService.getTodos().subscribe(todos => {
          this.todoRequest = false;
        }, errmess => {
          this.todoRequest = false;
          this.errMess = <any>errmess
        });

      } else if (!resp.success) {
        this.todoRequest = false;
        console.log("todo does'nt exist");
      }
    }, errmess =>  {
      this.todoRequest = false;
      this.errMess = <any>errmess
    });
  }

}