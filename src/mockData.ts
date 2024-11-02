import { Developer, Repository, Branch, CommitStats } from './types';

export const developers: Developer[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: '2',
    name: 'Alex Kumar',
    email: 'alex.kumar@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    email: 'maria.r@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  },
];

export const repositories: Repository[] = [
  {
    id: '1',
    name: 'frontend-app',
    description: 'Main frontend application',
  },
  {
    id: '2',
    name: 'api-service',
    description: 'Core API service',
  },
  {
    id: '3',
    name: 'data-pipeline',
    description: 'Data processing pipeline',
  },
];

export const branches: Branch[] = [
  { id: '1', name: 'main', repositoryId: '1' },
  { id: '2', name: 'develop', repositoryId: '1' },
  { id: '3', name: 'feature/auth', repositoryId: '1' },
  { id: '4', name: 'main', repositoryId: '2' },
  { id: '5', name: 'develop', repositoryId: '2' },
  { id: '6', name: 'main', repositoryId: '3' },
];

function generateRandomStats(startDate: Date, endDate: Date): CommitStats[] {
  const stats: CommitStats[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    developers.forEach(dev => {
      repositories.forEach(repo => {
        branches
          .filter(b => b.repositoryId === repo.id)
          .forEach(branch => {
            if (Math.random() > 0.7) {
              stats.push({
                date: currentDate.toISOString().split('T')[0],
                additions: Math.floor(Math.random() * 200),
                deletions: Math.floor(Math.random() * 100),
                changes: Math.floor(Math.random() * 50),
                developerId: dev.id,
                repositoryId: repo.id,
                branch: branch.name,
              });
            }
          });
      });
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return stats;
}

const endDate = new Date();
const startDate = new Date();
startDate.setDate(startDate.getDate() - 30);

export const commitStats = generateRandomStats(startDate, endDate);