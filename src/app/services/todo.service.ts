import { Injectable } from '@angular/core';
import {Todo} from '../shared/todo';
import {TODOS} from '../shared/todos';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl'
import { Subject } from 'rxjs/Subject';
import {NotificationCount} from '../shared/notificationCount';


import {ProcessHttpmsgService} from './process-httpmsg.service';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class TodoService {

  todos: Subject<Todo[]> = new Subject<Todo[]>();
  notificationCount: Subject<NotificationCount> = new Subject<NotificationCount>();

  constructor(private http: HttpClient, 
    private processHttpMsgService: ProcessHttpmsgService,
    private restangular: Restangular) { }

  sendTodosObs(resp: any) {
    // console.log("todo object has been sent");
    this.todos.next(resp.todos);
  }

  getTodosObs(): Observable<Todo[]> {
    return this.todos.asObservable();
  }

  sendNotificationCountObs(resp: any) {
    this.notificationCount.next(resp.notificationCount);
  }

  getNotificationCountObs(): Observable<NotificationCount> {
    return this.notificationCount.asObservable();
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get(baseURL + 'todos')
      .map(res => {
        // console.log("response is: ", res);
        this.sendTodosObs(res);
        this.sendNotificationCountObs(res);
        return res;
        })
      .catch(error => 
        {
          this.sendTodosObs(error);
          return this.processHttpMsgService.handleError(error);
        });
  }

  getTodosByUser(author: String) {
    return this.http.get(baseURL + 'todos/author/' + author)
      .map(res => { return res })
      .catch(error => { return this.processHttpMsgService.handleError(error); });
  }

  postTodo(todo: Todo):Observable<any> {
    return this.http.post(baseURL + 'todos', todo)
      .map(res => {
         
        // console.log("todos get are", res);
        return res })
      .catch(error => { return this.processHttpMsgService.handleError(error); });
  }

  putTodo(todo: Todo): Observable<any> {
    return this.http.put(baseURL + 'todos/'+todo._id , todo)
      .map(res => { return res })
      .catch(error => { return this.processHttpMsgService.handleError(error); });
  }

  deleteTodo(todo: Todo): Observable<any> { 
    return this.http.delete(baseURL + 'todos/'+todo._id)
      .map(res => { return res })
      .catch(error => { return this.processHttpMsgService.handleError(error); });
  }

  finishTodo(todo: Todo):Observable<any> {
    return this.http.post(baseURL + 'todos/finish/'+ todo._id, todo)
      .map(res => {
        // console.log("todos get are", res);
        return res })
      .catch(error => { return this.processHttpMsgService.handleError(error); });
  }

  unFinishTodo(todo: Todo):Observable<any> {
    return this.http.post(baseURL + 'todos/unfinish/'+ todo._id, todo)
      .map(res => {
        // console.log("todos get are", res);
        return res })
      .catch(error => { return this.processHttpMsgService.handleError(error); });
  }
}