import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CareerAgentService } from '../../services/career-agent.service';

@Component({
  selector: 'app-gaps',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './gaps.component.html',
  styleUrl: './gaps.component.css'
})
export class GapsComponent {
  constructor(protected agent: CareerAgentService) {}
}
