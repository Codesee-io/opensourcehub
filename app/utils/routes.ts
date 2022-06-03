import { PortfolioItem, User } from "~/types";

export function getProfileRouteForUser(user: User) {
  return `/u/github/${user.githubLogin}`;
}

export function getProfileEditRouteForUser(user: User) {
  return `/u/github/${user.githubLogin}/edit`;
}

export function getPortfolioItemEditRoute(user: User, item: PortfolioItem) {
  return `/u/github/${user.githubLogin}/contribution/${item.id}`;
}
