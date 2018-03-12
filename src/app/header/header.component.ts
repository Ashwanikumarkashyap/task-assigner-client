import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../services/auth.service'
import { TodoService } from '../services/todo.service';
import { Subscription } from 'rxjs/Subscription';
import {NotificationCount} from '../shared/notificationCount';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  username: string = undefined;
  response: boolean = undefined;
  subscription: Subscription;
  notificationCount: NotificationCount;
  NotificationCountSubscription : Subscription;

  constructor(
    private authService: AuthService, private todoService: TodoService) { }

  ngOnInit() {
    this.subscription = this.authService.getUsername()
      .subscribe(name => {
        this.username = name;
        this.response = true;
      });

    this.NotificationCountSubscription = this.todoService.getNotificationCountObs()
    .subscribe(notificationCount => { 
      this.notificationCount = notificationCount;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logOut() {
    this.username = undefined;
    this.authService.logOut();
  }

  resetTotalCount() {
    this.notificationCount.totalTodosCount = 0;
  }

  resetAssignedCount() {
    this.notificationCount.assignedTodosCount = 0;
  }
}
