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
import { loader as eventDetailLoader, action as deleteEventAction } from "./pages/EventDetail";
import EventDetailPage from "./pages/EventDetail";
import NewEventPage from "./pages/NewEvent";
import EditEventPage from "./pages/EditEvent";
import RootLayout from "./layouts/Root";
import EventLayout from "./layouts/Event";
import ErrorPage from "./pages/Error";
import { action as manipulateEventAction } from "./components/EventForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    /*
      errorElement is used as a fallback page that's displayed for 404 errors (navigating to paths that aren't supported)

      But that's not it's only usecase. The errorElement is also shown to the screen whenever an error is generated in
      any route related code, including loaders!

      ErrorPage will be displayed whenever we have any kind of error anywhere in our routes

      NOTE:
      errors in routes will bubble up to the CLOSEST errorElement
    */
    errorElement: <ErrorPage />,
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
          {
            path: ":eventId",
            // We add a special id property so that the children route definition can
            // access this route
            id: "event-detail",
            loader: eventDetailLoader,
            children: [
              { index: true, path: "", element: <EventDetailPage />, action: deleteEventAction },
              { path: "edit", element: <EditEventPage />, action: manipulateEventAction }
            ]
          },
          // To submit a form to update data in the Backend API, we can use the "action" property
          // and just like the "loader" property, action wants a function 
          { path: "new", element: <NewEventPage />, action: manipulateEventAction },
        ]
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
