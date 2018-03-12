import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo } from '../shared/todo'
import { TodoService } from '../services/todo.service'
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss']
})

export class TodoDetailComponent implements OnInit {
  
  editTodoForm: FormGroup;
  todo: Todo;
  errMess: string;
  users: any;
  disabled : boolean = true;
  assignToString : string = "";
  selectedTodo : any;
  username : string;
  todoEditRequest : boolean = false;

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

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TodoDetailComponent>,
    private todoService: TodoService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUsers().subscribe(users => this.users = users, 
      errmess => this.errMess = <any>errmess);
    this.selectedTodo = this.data.todo;
    this.username = this.data.username;
    this.setAssignToString();
    this.createForm();
  }

  createForm() {
  
    this.editTodoForm = this.fb.group({
    title: [{value: this.selectedTodo.title, disabled: true}, [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
    // title: [this.selectedTodo.title, [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
    description: [{value: this.selectedTodo.description, disabled: true}],
    priority: [{value: this.selectedTodo.priority, disabled: true}, Validators.required],
    assignTo: [{value: this.selectedTodo.assignTo, disabled: true}],
    author: [{value: this.selectedTodo.author, disabled: true}],
    comments: [{value: this.selectedTodo.comments, disabled: true}]
    });
    
    this.editTodoForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  setAssignToString() {
    // console.log("assigned to todo is: ",this.selectedTodo);
    if(this.selectedTodo.assignTo==null || this.selectedTodo.assignTo.length==0) {
        this.assignToString = "This task is freely assigned to everyone!"
    } else {
      for (var i=0; i<this.selectedTodo.assignTo.length;i++) {
        if (i==this.selectedTodo.assignTo.length-1) {
          this.assignToString+=this.selectedTodo.assignTo[i] + ".";  
        } else {
          this.assignToString+=this.selectedTodo.assignTo[i] + ", ";
        }
      }
    }
  }

  editTodo() {
    if (this.todoEditRequest) {
      // console.log("A request is already pending");
      return;
    }

    this.todoEditRequest = true;
    this.todo = this.editTodoForm.value;
    this.todo._id=this.selectedTodo._id;
    console.log("todo put req with todo: ", this.todo);
    this.todoService.putTodo(this.todo).subscribe(res => {
      if (res.success) {
        console.log("successfully edited");
        //get for todos | refresh
        this.todoService.getTodos().subscribe(todos => {
          this.todoEditRequest = false;
          this.dialogRef.close(res.success);          
        }, errmess => this.errMess = <any>errmess);

        
      }
      else {
        this.todoEditRequest = false;
        this.formErrors.title = res.err;
        this.editTodoForm.controls['title'].setErrors({'incorrect': true});
        console.log("error in posting ", res);
      }
    },
    error => {
      this.todoEditRequest = false;
      this.editTodoForm.reset({
        title: this.selectedTodo.title,
        description: this.selectedTodo.description,
        priority: this.selectedTodo.priority,
        assignTo: this.selectedTodo.assignTo,
        author: this.selectedTodo.author,
        comments: this.selectedTodo.comments
      });

      console.log("error in posting todo : "+ error);
      this.errMess = error;
      
    });
  }

  onValueChanged(data?: any) {
    if (!this.editTodoForm) { 
      return; 
    }
    const form = this.editTodoForm;
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

  edit() {
    if (this.todoEditRequest) {
      // console.log("A request is already pending");
      return;
    }
    this.disabled = false;
    Object.keys(this.editTodoForm.controls).forEach(key => {
      this.editTodoForm.get(key).enable();
    });
  }

  deleteTodo(todo: Todo) {
    if (this.todoEditRequest) {
      // console.log("A request is already pending");
      return;
    }
    this.todoEditRequest = true;
    this.todoService.deleteTodo(todo).subscribe(resp => {
      if (resp.success) {
        console.log("successfully deleted");
        //get for todos | refresh
        this.todoService.getTodos().subscribe(todos => {
          this.todoEditRequest = false;
          this.dialogRef.close(resp.success);
        }, errmess => {
          this.todoEditRequest = false;
          this.errMess = <any>errmess
        });
      } else if (!resp.success) {
        console.log("todo does'nt exist");
        this.todoEditRequest = false;
      }
    }, errmess => this.errMess = <any>errmess);
  }

}
