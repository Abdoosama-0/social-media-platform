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