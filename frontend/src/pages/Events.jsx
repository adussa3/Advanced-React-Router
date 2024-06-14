import { Await, defer, json, useLoaderData } from "react-router-dom";
import EventsList from "../components/EventsList";
import { Suspense } from "react";

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

        NOTE: 
        Now that we're using defer, "data" will now bae an object that gives us access to the
        deferred value that we defined in the loader() function below 
    */
    const data = useLoaderData();

    // the deferred events value (it's a promise)
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
    */
    return (
        <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
            <Await resolve={events}>{(loadedEvents) => <EventsList events={loadedEvents} />}</Await>
        </Suspense>
    );

    // OLD CODE
    // if (data.isError) {
    //     // One way to handle errors
    //     // return <p>{data.message}</p>;

    //     // Another way to handle errors
    //     // you can use the Error() constructor or throw an object as an error
    //     //
    //     // NOTE:
    //     // When an error gets thrown in a loader, React Router will simply render
    //     // the closest error element!
    //     //
    //     throw { message: "Could not fetch events." };
    // }

    // const events = data.events;

    // return <EventsList events={events} />;
}

export default EventsPage;

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

// This loader code does NOT execute in a server! It all happens on a browser!
// This is still client-side code! This means we can use brower APIs in our
// loader function:
// You can access localStorage, cookies, etc.
// But you CANNOT use React Hooks inside of the loader function! (This is because React Hooks can only be accessed in React Components!)
export function loader() {
    /*
        You can defer when the data is loaded, but what does this mean?

        For example, if you add a setTimeout to the default "/" event route () in the backend
        then Root.jsx will use the useNavigation hook to display a "loading..." text on the screen
        
        However, there are times where we want to load the EventsPage component before the data is
        finished loading, and instead, show parts of the page (like EventsNavigation) and wait until
        the data is fully loaded

        This is where we can defer loading and tell React Router that we DO want to render the component
        already even though the data isn't fully there/finished loading

        The defer() function must be executed and in defer() we pass an object where we bundle all the
        different HTTP requests we have going on in this page
    */
    return defer({
        // NOTE: we execute loadEvents and store the result as the value
        //       which is a promise because loadEvents is an async function
        //
        // we MUST have a promise! Otherwise, we would have nothing to defer - the idea of defer is
        // that we have a promise that will eventually be resolved to a value
        //
        // We want to load and render the component even though the future value isn't there yet
        events: loadEvents(),
    });
}
