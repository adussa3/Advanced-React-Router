import { useLoaderData } from "react-router-dom";
import EventsList from "../components/EventsList";

function EventsPage() {
    /*
        PROBLEM:
        The fetch request is only send once we navigate to the Events page

        this means that the entire EventsPage component must be rendered
        before the fetch request is sent

        This isn't necessarily a problem now because EventsPage is a simple
        component

        However, in more complex application, this component could be more
        complex and have a bunch of nested child components that need to be
        rendered BEFORE we send the fetch request and retreive the data

        This is suboptimal!

        Instead, we can use React Router (version 6 and higher) to initiate
        data fetching as soon as we start navigating to the EventsPage!

        In other words, we can initiate data fetching as soon as, or even
        BEFORE, we render the EventsPage component

        And then we render the component with the fetched data!
    */

    /*
        useLoaderData() is a special hook that we can use to get access to the
        "closest" loader data

        NOTE: we can use useLoaderData() directly inside the EventList component
    */
    const events = useLoaderData();

    return <EventsList events={events} />;
}

export default EventsPage;

export async function loader() {
    const response = await fetch("http://localhost:8080/events");

    if (!response.ok) {
        // ...
    } else {
        const resData = await response.json();

        // NOTE: when we define a loader function, React Router will
        // automatically take any value you return in the function
        // and make it available in the page being rendered, as well
        // as any other components that need it!
        //
        // In this example, resData.events is being sent to the EventsPage!
        //
        // NOTE: usually, anything that's returned in an async function wraps
        //       it in a promise! But React Router is will actually check if
        //       a promise is returned and automaticalyl get the resolved data
        //       from that promise for us!
        return resData.events;
    }
}
