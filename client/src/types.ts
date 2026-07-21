export type Media = {
  type: "image" | "video";
  url: string;
  order: number;
};

export type PostAuthor = {
  _id: string;
  name: string;
  profileImageURL: string;
};

export type Post = {
  _id: string;
  author: PostAuthor;
  title: string;
  media: Media[];
  likes: string[];
  likesCount: number;
  comments: Comment[];
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  isFollowingAuthor?: boolean;
  __v?: number;
};

export type Comment = {
  _id: string;
  comment: string;
  commentImage?: string;
  userid: {
    _id: string;
  };
};

export type LikeUser = {
  _id: string;
  name: string;
  profileImageURL: string;
};

export type SearchUser = {
  _id: string;
  name: string;
  username: string;
  email: string;
  profileImageURL?: string;
};

export type FollowUser = {
  _id: string;
  username: string;
  profileImageURL: string;
};

export type ProfileUser = {
  _id: string;
  name: string;
  username: string;
  email: string;
  profileImageURL: string;
  role: string;
  posts: Post[];
};

export type ProfileData = {
  user: ProfileUser;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowingAuthor?: boolean;
};

export type SiteStatistics = {
  totalUsers: number;
  blockedUsers: number;
  activeUsers: number;
  admins: number;
  newUsersLastWeek: number;
  totalPosts: number;
};

export type AdminUser = {
  _id: string;
  name: string;
  username: string;
  email: string;
  profileImageURL: string;
  isBanded: boolean;
  role: string;
};
