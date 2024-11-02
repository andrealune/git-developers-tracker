export interface Developer {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Repository {
  id: string;
  name: string;
  description: string;
}

export interface Branch {
  id: string;
  name: string;
  repositoryId: string;
}

export interface CommitStats {
  date: string;
  additions: number;
  deletions: number;
  changes: number;
  developerId: string;
  repositoryId: string;
  branch: string;
}