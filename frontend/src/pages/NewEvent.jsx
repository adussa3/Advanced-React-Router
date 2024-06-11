import { json, redirect } from "react-router-dom";
import EventForm from "../components/EventForm";

export default function NewEventPage() {
    /*
        How do we send data to the Backend API?

        APPROACH 1: Add a function

        function submitHandler(event) {
            event.preventDefault();

            // extract data from the form with 2-way binding, refs, or formData

            // manually send out HTTP request with fetch() or axios()

            // manage some loading and error state

            // ultimately navigate way from this page once we're done!
            // we could navigate away with imperative navigation with
            // the help of the useNavigate() hook
        }

        APPROACH 2: better approach with React Router
        Just like how we can add loaders to load data with React Router,
        we can also add actions to send data
    */
    return <EventForm />;
}

/*
    We're are sending request to the Backend API to add a new event
    RECALL: this is code that executes in the browser, this is NOT backend code
    You can access any browser API here like localStorage

    But very often, we want to use the fetch() function
*/

/*
    To a hold of that request that is captured by React Router (in EventForm's <Form>)
    and is forward to the action

    We have to use the data that's passed into the action function, because just as the
    loader function  the action function is executed by React Router, and it receives
    an object that includes a couple of helpful properties:

    (1) request
    (2) params
*/
export async function action({ request, params }) {
    /*
        This time, we're not interested in the params, instead we will focus on the request object
        because the request object will contain the form data

        request.formData() will give us a data object with the form data with the input "name"
        attribute as the keys
    */
    const data = await request.formData();

    // How to get one input value
    const enteredTitle = data.get("title");

    // How to get multiple input values
    const eventData = {
        title: data.get("title"),
        image: data.get("image"),
        date: data.get("date"),
        description: data.get("description"),
    };

    const response = await fetch("http://localhost:8080/events", {
        method: "POST",
        headers: {
            // We set Content-Type to application/json so that the data
            // is handled and extracted correctly on the backend
            "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
    });

    /*
        We don't want to throw a generic error response, but instead we want to show validations errors
        above the form for when the user inputs blank or incorrect data

        We're not returning or redirecting and we're not throwing an error response. Instead we're returning
        the response we got beck from the backend if we got the 422 status code on the response

        What does returning a response in an action do? Well just like loaders where we can use the returned
        response and use the response data in our components and pages, we can also use returned action data
        in our components and pages too!

        This is less common, but it's very common for validation error responses where we DON'T want to show
        an error page
    */
    if (response.status === 422) {
        return response;
    }

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
    if (!response.ok) {
        throw json({ message: "Could not save event." }, { status: 500 });
    }

    /*
        redirect, like json(), is a special function from react-router-dom which creates
        a special response object that redirects users to a different page
        
        We need to specify the path were we want to redirect the user and React Router
        will take care of the rest
    */
    return redirect("/events");
}
