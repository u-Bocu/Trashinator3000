import {Component, OnInit} from '@angular/core';
import {PeopleService} from "../../services/people.service";

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit{
  constructor(
    private peopleService: PeopleService) { }

  ngOnInit() {
    this.getPeople();
  }

  getPeople() {
    this.peopleService.getPeople().subscribe(data => {
      console.log(data)
    });
  }
}
