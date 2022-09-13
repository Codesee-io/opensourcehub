import { ProjectSortOrder } from "./utils/constants";

export type ProjectAttributes = {
  description?: string;
  repoUrl: string;
  name: string;
  languages?: string[];
  tags?: string[];
  currentlySeeking?: string[];
  contributionOverview?: {
    mainLocation?: string;
    idealEffort?: string;
    isMentorshipAvailable?: boolean;
    automatedDevEnvironment?: string;
    extras?: string[];
  };
  websiteUrl?: string;
  twitterUrl?: string;
  avatar?: string;
  featuredMap?: {
    url: string;
    description: string;
  };
  maps?: {
    url: string;
    description: string;
    subTitle?: string;
  }[];
  learnLinks?: {
    title?: string;
    url?: string;
  }[];
  maintainer: string;
  created: string;
};

export type ProjectCategory = {
  fieldValue: string;
  totalCount: number;
};

export type Project = {
  attributes: ProjectAttributes;
  body: {
    contributing: string;
    overview: string;
  };
  slug: string;
  organization: string;
};

export type GitHubIssueData = {
  id: string;
  number: number;
  publishedAt: string;
  title: string;
  url: string;
  labels: {
    nodes: Array<{ name: string }>;
    totalCount: number;
  };
};

export type GitHubMetric = {
  count: number;
  maybeMore: boolean;
};

export type GitHubData = {
  prsMerged: GitHubMetric;
  prsCreated: GitHubMetric;
  totalContributors: number;
  contributors: GitHubMetric;
  totalOpenIssues: number;
  helpIssues: GitHubIssueData[];
  hacktoberfestIssues: GitHubIssueData[];
};

export type CodeSeeMapMetadata = {
  id: string;
  name: string;
  entityRoleEveryone: string;
  featured: boolean;
  insights: {
    lastCommitDate: string;
    commitCountLast30Days: string;
    createDate: string;
    linesOfCode: string;
  };
  changed: string;
  repos: Array<{
    url: string;
    defaultBranch: string;
    isPublic: boolean;
  }>;
  hasPrivateRepos: false;
  thumbnail: string;
};

export type SelectOption = { label: string; value: ProjectSortOrder };

export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
};

export type User = {
  uid: string;
  githubLogin: string;
  displayName: string;
  email?: string | null;
  createdAt: string;
  updatedAt: string;
  discordUserId?: string | null;
  pictureUrl?: string;
};

export type UserInfo = Pick<User, "githubLogin" | "displayName" | "pictureUrl">;

export type UserProfile = {
  userId: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  pictureUrl?: string;
  intro?: string;
  techInterests?: string[];
  subjectInterests?: string[];
  roleInterests?: string[];
  portfolioItems?: string[];
};

export type Tag = {
  id: string;
  label: string;
  color: string;
};

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  pullRequestUrl: string;
  createdAt: string;
  updatedAt: string;
  /**
   * An ISO 8601 date like YYYY-MM-DD. Does not include time
   */
  dateCompleted: string;
  reviewMapImageUrl?: string;
  userId: string;
};

export type CreatePortfolioItemPayload = Pick<
  PortfolioItem,
  | "title"
  | "description"
  | "pullRequestUrl"
  | "dateCompleted"
  | "reviewMapImageUrl"
  | "userId"
>;

export type UpdatePortfolioItemPayload = Pick<
  PortfolioItem,
  "title" | "description" | "dateCompleted"
>;

export type PullRequestDetails = {
  title: string;
  author: {
    login: string;
    url: string;
  };
  url: string;
  number: number;
  merged: boolean;
  participants: {
    nodes: Array<{ login: string }>;
  };
  repository: {
    nameWithOwner: string;
    url: string;
  };
};
