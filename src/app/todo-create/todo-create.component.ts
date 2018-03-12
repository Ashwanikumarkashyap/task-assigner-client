import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo } from '../shared/todo'
import { TodoService } from '../services/todo.service'
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../services/auth.service'
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss']
})
export class TodoCreateComponent implements OnInit {

  todoForm: FormGroup;
  todo: Todo;
  errMess: string;
  users: any;
  todoCreateRequest: boolean = false;


  formErrors = {
    'title': '',
  };

  validationMessages = {
    'title': {
      'required':      'Title is required.',
      'minlength':     'Title must be at least 2 characters long.',
      'maxlength':     'Title cannot be more than 25 characters long.'
    }
  };

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<TodoCreateComponent>,
     private todoService: TodoService,  private authService: AuthService,
     @Inject(MAT_DIALOG_DATA) public username: string) { 
      
     }

  ngOnInit() {
    this.authService.getUsers().subscribe(users => this.users = users, 
      errmess => this.errMess = <any>errmess);
      this.createForm();
  }

  ngOnDestroy() {
  }

  createForm() {
  
    this.todoForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
    description: '',
    priority: [3 , Validators.required],
    assignTo: [],
    author: this.username,
    comments: []
    });

    this.todoForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onSubmit() {
    if (this.todoCreateRequest) {
      // console.log("A request is already pending");
      return;
    }
    this.todo = this.todoForm.value;
    this.todoCreateRequest = true;
    this.todoService.postTodo(this.todo).subscribe(res => {
      if (res.success) {
        // console.log("successfully posted");
        //get for todos | refresh
        this.todoService.getTodos().subscribe(todos => {
          this.todoCreateRequest = false;
          this.dialogRef.close(res.success);
        }, errmess => this.errMess = <any>errmess);
      }
      else {
        this.todoCreateRequest = false;
        this.formErrors.title = res.err;
        this.todoForm.controls['title'].setErrors({'incorrect': true});
        console.log("error in posting ", res);
      }
    },
    error => {
      this.todoCreateRequest = false;
      this.todoForm.reset({
        title: '',
        description: '',
        priority: 3,
        assignTo: [],
        author: this.username,
        comments: []
      });

      console.log("error in posting todo : "+ error);
      this.errMess = error;
      
    });
  }

  onValueChanged(data?: any) {
    if (!this.todoForm) { 
      return; 
    }
    const form = this.todoForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

}
