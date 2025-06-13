import {
  type RouteConfig,
  index,
  route,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default (
  [
    layout("components/Layout.tsx", [
      index("routes/home.tsx"),

      route("login", "routes/auth/login.tsx"),
      route("register", "routes/auth/register.tsx"),

      ...prefix("quiz", [
        route("list", "routes/quiz/list.tsx"),
        route("create", "routes/quiz/create.tsx"),
        route(":quizId", "routes/quiz/detail.tsx"),
      ]),
      ...prefix("room", [
        route(":code", "routes/room/lobby.tsx"),
        route(":code/question/:questionId", "routes/room/question.tsx"),
        route(":code/result", "routes/room/result.tsx"),
      ]),
      // route("room/:roomId", "routes/waiting-in-room.tsx"),
    ])
  ] satisfies RouteConfig
);

/*[
  index("./home.tsx"),
  route("about", "./about.tsx"),

  layout("./auth/layout.tsx", [
    route("login", "./auth/login.tsx"),
    route("register", "./auth/register.tsx"),
  ]),

	route("teams/:teamId", "./team.tsx"),

  ...prefix("concerts", [
    index("./concerts/home.tsx"),
    route(":city", "./concerts/city.tsx"),
    route("trending", "./concerts/trending.tsx"),
  ]),
]*/

/*[
  // parent route
  route("dashboard", "./dashboard.tsx", [
    // child routes
    index("./home.tsx"),
    route("settings", "./settings.tsx"),
  ]),
]*/