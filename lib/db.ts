export type PostStatus = 'UNDER_REVIEW' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  upvotes: number;
  isOfficialResponse?: boolean;
}

export interface FeedbackPost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: PostStatus;
  upvoteCount: number;
  commentCount: number;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  createdAt: string;
  isPublicRoadmap: boolean;
}

export interface UserVote {
  userId: string;
  postId: string;
}

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER' | 'USER';
  organizationName: string;
}

class DatabaseStore {
  public posts: FeedbackPost[] = [];
  public comments: Comment[] = [];
  public votes: Set<string> = new Set(); // format: `${userId}:${postId}`

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    this.posts = [
      {
        id: 'post-1',
        title: 'Better API documentation',
        content:
          'The current API docs are hard to navigate. More examples, clear authentication steps and auto-generated references would be helpful.\n\nThis would make it easier for new developers to get started and reduce the number of support requests we receive.',
        category: 'API',
        tags: ['API', 'Documentation', 'Developer Experience'],
        status: 'PLANNED',
        upvoteCount: 128,
        commentCount: 32,
        authorName: 'John Carter',
        authorRole: 'Admin',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isPublicRoadmap: true,
      },
      {
        id: 'post-2',
        title: 'Dark mode improvements',
        content:
          'The current dark mode is too light in some areas. It would be great to have a true dark experience across the entire product, including better contrast on secondary text elements.',
        category: 'UI',
        tags: ['UI', 'Accessibility', 'Theme'],
        status: 'IN_PROGRESS',
        upvoteCount: 129,
        commentCount: 28,
        authorName: 'Elena Rostova',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        isPublicRoadmap: true,
      },
      {
        id: 'post-3',
        title: 'Slack integration',
        content:
          'Allow us to receive notifications in Slack when there are new comments or status changes on our feedback, as well as trigger upvotes directly via slash commands.',
        category: 'Integrations',
        tags: ['Integrations', 'Slack', 'Notifications'],
        status: 'UNDER_REVIEW',
        upvoteCount: 84,
        commentCount: 19,
        authorName: 'David Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isPublicRoadmap: false,
      },
      {
        id: 'post-4',
        title: 'SSO support',
        content:
          'We need SAML 2.0 and OAuth support for enterprise team security, with automated SCIM user provisioning and group mapping.',
        category: 'Security',
        tags: ['Security', 'Enterprise', 'SAML'],
        status: 'COMPLETED',
        upvoteCount: 342,
        commentCount: 41,
        authorName: 'Marcus Vance',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        isPublicRoadmap: true,
      },
      {
        id: 'post-5',
        title: 'Mobile app',
        content:
          'A native mobile app would make it easier to stay updated on the go and respond quickly to urgent customer feedback items.',
        category: 'Mobile',
        tags: ['Mobile', 'iOS', 'Android'],
        status: 'PLANNED',
        upvoteCount: 72,
        commentCount: 18,
        authorName: 'Aisha Patel',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        isPublicRoadmap: true,
      },
      {
        id: 'post-6',
        title: 'API v2',
        content: 'A more powerful and flexible API with better developer experience, GraphQL and REST endpoints.',
        category: 'API',
        tags: ['API', 'Developer'],
        status: 'PLANNED',
        upvoteCount: 128,
        commentCount: 32,
        authorName: 'Alex Mercer',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        isPublicRoadmap: true,
      },
      {
        id: 'post-7',
        title: 'Advanced analytics',
        content: 'Deeper insights into user feedback volume, sentiment analysis, and product usage correlation.',
        category: 'Analytics',
        tags: ['Analytics', 'BI'],
        status: 'PLANNED',
        upvoteCount: 96,
        commentCount: 21,
        authorName: 'Sophie Taylor',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        isPublicRoadmap: true,
      },
      {
        id: 'post-8',
        title: 'Custom themes',
        content: 'Allow teams to create custom branded feedback portals with customized CSS variables.',
        category: 'UI',
        tags: ['Customization', 'Theming'],
        status: 'PLANNED',
        upvoteCount: 54,
        commentCount: 14,
        authorName: 'Carlos Gomez',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        isPublicRoadmap: true,
      },
      {
        id: 'post-9',
        title: 'Team permissions',
        content: 'More granular control over team access, roles, and status update approval workflows.',
        category: 'Administration',
        tags: ['Administration', 'Roles'],
        status: 'IN_PROGRESS',
        upvoteCount: 61,
        commentCount: 12,
        authorName: 'Rachel Green',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        isPublicRoadmap: true,
      },
      {
        id: 'post-10',
        title: 'Bulk actions',
        content: 'Manage multiple feedback items at once: bulk tag, bulk status assignment, and export to CSV.',
        category: 'Productivity',
        tags: ['Productivity', 'Admin'],
        status: 'IN_PROGRESS',
        upvoteCount: 48,
        commentCount: 9,
        authorName: 'Liam Wilson',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        isPublicRoadmap: true,
      },
      {
        id: 'post-11',
        title: 'Vote on comments',
        content: 'Let users upvote helpful comments and ideas within discussion threads.',
        category: 'Community',
        tags: ['Community', 'Discussion'],
        status: 'COMPLETED',
        upvoteCount: 210,
        commentCount: 26,
        authorName: 'Emma Watson',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        isPublicRoadmap: true,
      },
      {
        id: 'post-12',
        title: 'Real-time updates',
        content: 'Live updates for new comments and status changes using server-sent events.',
        category: 'Performance',
        tags: ['Performance', 'Realtime'],
        status: 'COMPLETED',
        upvoteCount: 176,
        commentCount: 22,
        authorName: 'Lucas Grey',
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        isPublicRoadmap: true,
      },
      {
        id: 'post-13',
        title: 'Public changelog',
        content: 'Automatically publish product updates and release notes to your public changelog.',
        category: 'Product',
        tags: ['Product', 'Changelog'],
        status: 'COMPLETED',
        upvoteCount: 143,
        commentCount: 17,
        authorName: 'Chloe Bennett',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        isPublicRoadmap: true,
      },
    ];

    this.comments = [
      {
        id: 'c-1',
        postId: 'post-1',
        authorName: 'Sarah Kim',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        content:
          '+1 This would save our team a lot of time. The current docs are still confusing even after reading the guides.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        upvotes: 12,
        isOfficialResponse: false,
      },
      {
        id: 'c-2',
        postId: 'post-1',
        authorName: 'Mike Johnson',
        authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
        content: 'This would be a huge improvement. Please prioritize this!',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        upvotes: 7,
        isOfficialResponse: false,
      },
      {
        id: 'c-3',
        postId: 'post-1',
        authorName: 'Product Team',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        content:
          "We're currently working on this and it's planned for the next release. Thanks for the feedback!",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        upvotes: 24,
        isOfficialResponse: true,
      },
    ];
  }
}

// GlobalThis singleton according to Section 5 of AGENTS.md
const globalForDb = globalThis as unknown as {
  dbStore: DatabaseStore | undefined;
};

export const db = globalForDb.dbStore ?? new DatabaseStore();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.dbStore = db;
}
