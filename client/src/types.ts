type UserData = {

  userName: string | null;
  email: string | null;
  id: string | null;
  photo: string | null;

  setUserName: (userName: string | null) => void;
  setEmail: (email: string | null) => void;
  setId: (id: string | null) => void;
  setPhoto: (avatar: string | null) => void;

  clearUserData: () => void;
};
type Post = {
    _id: string;

    author: {
        _id: string;
        profileImageURL: string;
        name: string;
    };

    title: string;

    images: string[];

    likes: string[];

    likesCount: number;

    comments: string[];

    createdAt: string;

    updatedAt: string;

    __v: number;
};