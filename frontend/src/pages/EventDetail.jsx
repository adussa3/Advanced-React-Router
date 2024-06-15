import { Await, defer, json, redirect, useLoaderData, useParams, useRouteLoaderData } from "react-router-dom";

import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";
import { Suspense } from "react";

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
    const events = data.events;

    /*
        The Await component, povided by react-router-dom, has a special "resolve" property
        which takes in a deferred value

        Between the opening and closing tags of the Await component, we MUST define a function
        that will be executed by React Router once the promise is resolved and we have the data!

        NOTE:
        We need to wrap the <Await> component inside the <Suspense> component

        The <Suspense> component is a component which can be used in certain situations to show a
        fallback while we're waiting for other data to arrive!

        Now we load the EventsPage component BEFORE we have the data

        NOTE:
        If a page makes multiple requests, then each request need to have its own Await and Suspense component

        ALSO NOTE:
        Technically, you could wrap the all the Await components in one Suspense component, but it would then wait
        for both Await components to resolve before showing anything!

        We don't want to do that, we want to show the parts of the data immediately as soon as they resolve. Therefore,
        we would need to wrap each Await in a Suspense
    */

    return (
        <>
            <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
                <Await resolve={event}>{(loadedEvent) => <EventItem event={loadedEvent} />}</Await>
            </Suspense>
            <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
                <Await resolve={events}>{(loadedEvents) => <EventsList events={loadedEvents} />}</Await>
            </Suspense>
        </>
    );
}

async function loadEvent(id) {
    const response = await fetch("http://localhost:8080/events/" + id);

    if (!response.ok) {
        throw json({ message: "Could not fetch details for selected event." }, { status: 500 });
    } else {
        /*
            NOTE:
            when using defer, we CANNOT directly return the response
            instead, you need to manually parse the response
        */
        // return response; - does NOT work with defer()
        const resData = await response.json();
        return resData.event;
    }
}

async function loadEvents() {
    const response = await fetch("http://localhost:8080/events");

    if (!response.ok) {
        // Error Handling
        // return { isError: true, message: "Could not fetch events." };
        /*
            Constructing responses manually by throwing a Response is possible, but annoying
            ex: throw new Response(JSON.stringify({ message: "Could not fetch events." }), { status: 500 });

            That's why React Router gives you the "utility" helper (shown below)

            We can import json() from react-router-dom which is a function that creates a Response object that
            includes data in the JSON format!

            We simply pass our data to this json() function that should be included in the response
            We can also pass in a second argument where we can set that extra response metadata like "status"

            With the json() function, not only do we write less code, but also, in the place where we use that
            response data, you also don't have to parse the JSON format manually!
        */
        throw json({ message: "Could not fetch events." }, { status: 500 });
    } else {
        /*
            NOTE: when we define a loader function, React Router will
            automatically take any value you return in the function
            and make it available in the page being rendered, as well
            as any other components that need it!
            
            In this example, resData.events is being sent to the EventsPage!
            
            NOTE: usually, anything that's returned in an async function wraps
                it in a promise! But React Router is will actually check if
                a promise is returned and automaticalyl get the resolved data
                from that promise for us!
        */
        // const resData = await response.json();
        // return resData.events;

        /*
            Creating a new Response object
            We can create a Response here because the browser supports the Response constructor and Response object
            The Response constructor takes in any data of your choice as a first argument, and you can set an object
            as the second argument to provide greater detail
            
            Whenever you return a Response in your loaders, the React Router package will AUTOMTICALLY extract data
            from your Response when using the useLoaderData() hook - it returns the response data (the first argument)
            
            Now the question is, why would we return the Response object instead of directly returning the data? It's
            because it's common in loader functions to reach out to a backend with the browser's built-in fetch function
            This fetch function actually returns a promise that's resolves to a response!
            
            Now combining React Router's support for these Response objects and its automatic data extraction, it means
            that we can take the Response and directly return it! We don't need to manually extract data from the Response
            const res = new Response("any data", { status: 201 });
        */

        /*
            NOTE:
            when using defer, we CANNOT directly return the response
            instead, you need to manually parse the response
        */
        // return response; - does NOT work with defer()
        const resData = await response.json();
        return resData.events;
    }
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

    return defer({
        // NOTE: we execute loadEvent and loadEvents and store the result as the value
        //       which is a promise because loadEvent and loadEvents is an async function
        //
        // we MUST have a promise! Otherwise, we would have nothing to defer - the idea of defer is
        // that we have a promise that will eventually be resolved to a value
        //
        // We want to load and render the component even though the future value isn't there yet
        /*
            NOTE: this isn't the perfect solution:

            event: loadEvent(id),
            events: loadEvents(),

            When the page loads, you see the loading message (even though it's a short time) for loadEvent(id)!
            This is because we are deferring BOTH the "event" and "events" values!
            
            Now, it would make sense to tell React Router that it should WAIT (not defer!) when it displays the
            event detail page until the event details have been loaded, in terms of user experience!

            So that the navigation should only start when the details are fully loaded! But then it should DEFER
            the list events after we navigate to the EventDetailPage

            WE CAN DO THIS!
            Defer gives us this fine-grain control! If we have an async loader with the "async function" at the
            beginning, we can add the "await" keyword infront of the function!

            This make sure that React Router WAITS for the event data to be loaded BEFORE loading the page component at all
            (like how it was originally)

            However, it DEFERS the events data AFTER the page is loaded

            So "await" is our toggle for controlling which data should be awaited before navigating to the page
            and which data should be deferred (load the data AFTER navigating to the page)
        */

        event: await loadEvent(id),
        events: loadEvents(),
    });
}

export async function action({ request, params }) {
    const id = params.eventId;
    // this gets the 2nd paramter object from the submit function in EventItems.js
    const response = await fetch("http://localhost:8080/events/" + id, { method: request.method });

    if (!response.ok) {
        throw json({ message: "Could not delete event." }, { status: 500 });
    }

    /*
        redirect, like json(), is a special function from react-router-dom which creates
        a special response object that redirects users to a different page
        
        We need to specify the path were we want to redirect the user and React Router
        will take care of the rest
    */
    return redirect("/events");
}
