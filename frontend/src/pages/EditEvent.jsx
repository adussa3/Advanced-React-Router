import { useLoaderData, useRouteLoaderData } from "react-router-dom";
import EventForm from "../components/EventForm";

export default function EditEventPage() {
    /*
        useLoaderData() is a special hook that we can use to get access to the
        "closest" loader data

            const data = useLoaderData();

        ALSO NOTE:
        So when we call useLoaderData() it searches for the CLOSEST loader available data,
        and the highest level at which it looks for data is the route definition of the
        route for which EditEventPage component was loaded
        
        const data = useLoaderData();

        So in this case, the highest level it looks for data is the EditEventPage component
        but we actually want loader data from its parent route, (with path: ":eventId")

        Therefore, use use the useRouteLoaderData() to directly get the loader data from the parent!
        It hook works almost like useLoaderData(), but it takes a route ID as an argument!
    */
    const data = useRouteLoaderData("event-detail");
    const event = data.event;

    return <EventForm method="patch" event={event} />;
}
