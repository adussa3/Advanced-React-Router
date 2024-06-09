import { json, useLoaderData, useParams, useRouteLoaderData } from "react-router-dom";

import EventItem from "../components/EventItem";

export default function EventDetailPage() {
    // This hook gives us a params object which is a simple JavaScript object
    // which contains every dynamic path segment that we defined in our route
    // definition as a property
    //
    // Ex: for http://localhost:3000/root/products/:productId
    //         http://localhost:3000/root/products/p1
    //
    // params.productId is equal to "p1"
    //const params = useParams();

    /*
        useLoaderData() is a special hook that we can use to get access to the
        "closest" loader data

        NOTE: we can use useLoaderData() directly inside the EventList component

        ALSO NOTE:
        So when we call useLoaderData() it searches for the CLOSEST loader available data,
        and the highest level at which it looks for data is the route definition of the
        route for which this EventDetailsPage component was loaded
        
        const data = useLoaderData();

        So in this case, the highest level it looks for data is the EventDetailsPage component
        but we actually want loader data from its parent route, (with path: ":eventId")

        Therefore, use use the useRouteLoaderData() to directly get the loader data from the parent!
        It hook works almost like useLoaderData(), but it takes a route ID as an argument!
    */
    const data = useRouteLoaderData("event-detail");

    const event = data.event;

    return <EventItem event={event} />;
}

/*
    We can get access to the route parameters!

    React Router (which calls the loader function for us) automatically passes an object
    to the loader function when executing it for us!

    The object it passes contains 2 important pieces of data:
    (1) a request property - contains a request object
    (2) a params property - contains an object with all your route parameters
*/
export async function loader({ request, params }) {
    // The request object can be used to access the URL to extract query parameters
    // (we don't need this for the loader, but it's good to know)
    // const url = request.url

    // for this loader, we want to use params to get the selected eventId
    const id = params.eventId;
    const response = await fetch("http://localhost:8080/events/" + id);

    if (!response.ok) {
        throw json({ message: "Could not fetch details for selected event." }, { status: 500 });
    } else {
        return response;
    }
}
