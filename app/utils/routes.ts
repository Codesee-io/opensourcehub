import { User } from "~/types";

export function getProfileRouteForUser(user: User) {
  return `/u/github/${user.githubLogin}`;
}

export function getProfileEditRouteForUser(user: User) {
  return `/u/github/${user.githubLogin}/edit`;
}
