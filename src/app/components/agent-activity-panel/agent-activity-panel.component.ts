import { Component } from '@angular/core';
import { CareerAgentService } from '../../services/career-agent.service';

@Component({
  selector: 'app-agent-activity-panel',
  standalone: true,
  imports: [],
  templateUrl: './agent-activity-panel.component.html',
  styleUrl: './agent-activity-panel.component.css'
})
export class AgentActivityPanelComponent {
  constructor(protected agent: CareerAgentService) {}
}
