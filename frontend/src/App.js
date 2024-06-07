// Challenge / Exercise

// 1. Add five new (dummy) page components (content can be simple <h1> elements)
//    - HomePage
//    - EventsPage
//    - EventDetailPage
//    - NewEventPage
//    - EditEventPage
//
// 2. Add routing & route definitions for these five pages
//    - / => HomePage
//    - /events => EventsPage
//    - /events/<some-id> => EventDetailPage
//    - /events/new => NewEventPage
//    - /events/<some-id>/edit => EditEventPage
//
// 3. Add a root layout that adds the <MainNavigation> component above all page components
//
// 4. Add properly working links to the MainNavigation
//
// 5. Ensure that the links in MainNavigation receive an "active" class when active
//
// 6. Output a list of dummy events to the EventsPage
//    Every list item should include a link to the respective EventDetailPage
//
// 7. Output the ID of the selected event on the EventDetailPage
//
// BONUS: Add another (nested) layout route that adds the <EventNavigation> component above all /events... page components

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import EventsPage, { loader as eventsLoader } from "./pages/Events";
import EventDetailPage from "./pages/EventDetail";
import NewEventPage from "./pages/NewEvent";
import EditEventPage from "./pages/EditEvent";
import RootLayout from "./layouts/Root";
import EventLayout from "./layouts/Event";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, path: "", element: <HomePage /> },
      {
        path: "events",
        element: <EventLayout />,
        children: [
          /*
            We can use React Router (version 6 and higher) to initiate
            data fetching as soon as we start navigating to the EventsPage!

            In other words, we can initiate data fetching as soon as, or even
            BEFORE, we render the EventsPage component

            And then we render the component with the fetched data!

            React Router gives you the "loader" property which that takes a
            function as a value and executes it when we're about to visit a
            route!

            So just before the EventsPage component gets rendered, the loader
            function is executed and gets the fetched data
          */
          { index: true, path: "", element: <EventsPage />, loader: eventsLoader },
          { path: ":eventId", element: <EventDetailPage /> },
          { path: "new", element: <NewEventPage /> },
          { path: ":eventId/edit", element: <EditEventPage /> }
        ]
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
