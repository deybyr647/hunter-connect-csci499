export interface FriendRequestData {
  outgoingRequests: string[];
  incomingRequests: string[];
}

export interface FriendsList {
  friends: string[];
}

export interface UserSearchResult {
  uid: string;
  name: string;
  email: string;
}
