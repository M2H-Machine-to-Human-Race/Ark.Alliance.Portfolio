import { BaseComponentModel } from '../../components/base/BaseComponent.model';

export class ArchitecturePageViewModel extends BaseComponentModel {
    public mermaidSource: string = '';
    public graphData: any = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{ label: 'Sales', data: [100, 200, 150] }]
    };

    public componentColumns = [
        { field: 'name', header: 'Component', width: 200 },
        { field: 'status', header: 'Status', width: 100 },
        { field: 'loc', header: 'LoC', width: 80 }
    ];

    public componentData = [
        { id: '1', name: 'DataGrid', status: 'Ready', loc: 450 },
        { id: '2', name: 'Graph', status: 'Beta', loc: 230 },
        { id: '3', name: 'GlassCard', status: 'Ready', loc: 85 }
    ];

    constructor() {
        super();
        this.mermaidSource = `
graph TD
    User((User))
    LB[Load Balancer]
    F[Frontend UI]
    B[Backend API]
    DB[(Database)]
    Cache[(Redis Cache)]

    User --> LB
    LB --> F
    F --> B
    B --> DB
    B --> Cache
        `;
    }

    public onInit(): void { }
    public onDestroy(): void { }

    public getArchitectureDiagram(): string {
        return this.mermaidSource;
    }

    public getTreeData(): any[] {
        return [
            {
                id: '1', label: 'src', children: [
                    {
                        id: '2', label: 'components', children: [
                            { id: '3', label: 'generic' }
                        ]
                    }
                ]
            }
        ];
    }
}

