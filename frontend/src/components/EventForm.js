import { Form, json, redirect, useActionData, useNavigate, useNavigation } from 'react-router-dom';

import classes from './EventForm.module.css';

function EventForm({ method, event }) {
  /*
    The useActionData hook is similar to useLoaderData (it basically does the same thing)

    It gives us access to the data returned by the action (instead of the loader like in useLoaderData)!
    And it gives us access to the CLOSEST action!

    Also, just like loaders, this response is automatically parsed by React Router for us (just as it is
    the case for loaders)

    And therefore, this data is the data we returned in our backend in case of validation errors
  */
  const data = useActionData();

  /*
    useNavigation is provided by react-router-dom and gives us access to a navigation object
    which we can extract various pieces of information from that object
    
    For example, all the data that was submitted. But we can also find out what the current 
    state of the currently active transition is
    
    We have a transition from one route to another, if we click a Link, But we also have a
    transition if we submit a form! therefore, we also get information about the current data
    submission process and whether the action that was triggered is completed already
  */
  const navigation = useNavigation();

  // the current state is currently submitting data!, so that the action that was triggered
  // is currently still active
  //
  // We can use this the isSubmitting value to disable the "Save" button to prevent the user
  // from clicking the "Save" button multiple times when submitting a new event
  //
  // We can also do the same for the "Cancel" button
  const isSubmitting = navigation.state === "submitting";

  const navigate = useNavigate();
  function cancelHandler() {
    navigate('..');
  }

  return (
    /*
        The great thing about React Router is that is makes handling form submissions a breeze!
        And it helps with extracting data from the form

        For this, we need to go to the form and and make sure all the inputs have the "input"
        attribute, because these names will later be used for extracting the data

        Next we need to replace the form element with the special "Form" component from
        react-router-dom

        This "Form" tag will make sure that the browser default of sending a request to the backend
        will be OMMITED

        BUT it will take that request that would've been sent and GIVE it to your action!

        This is pretty useful, because that request will contain all the data that was submitted
        as part of the form

        Therefore, we need to specify the "method" property 

        NOTE:
        This request will NOT be sent to the backend automatically! Instead it will automtatically
        send it to our action, and it will include all of the form data!
    */

    /*
      This is the default way to trigger action functions - using the special <Form> component offered by React Router

      this is the standard way, this form will AUTOMATICALLY trigger the action function of the currently active route

      NOTE:
      you could send the request to a different route but adding the "action" property and setting it to another path
      ex: <Form method="post" acton="/another-path" className={classes.form}>

      This triggers the "action" of another route! (defined in the route defintion in app.js)
    */
    <Form method={method} className={classes.form}>
      {/* Validation errors */}
      {data && data.errors &&
        (<ul>
          {/* Object.values(data.errors) - a function built into JavaScriptot basically loop through all the keys in the data.errors object */}
          {Object.values(data.errors).map((error) => {
            return <li key={error}>{error}</li>
          })}
        </ul>)
      }
      <p>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" name="title" required defaultValue={event ? event.title : ""} />
      </p>
      <p>
        <label htmlFor="image">Image</label>
        <input id="image" type="url" name="image" required defaultValue={event ? event.image : ""} />
      </p>
      <p>
        <label htmlFor="date">Date</label>
        <input id="date" type="date" name="date" required defaultValue={event ? event.date : ""} />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows="5" required defaultValue={event ? event.description : ""} />
      </p>
      <div className={classes.actions}>
        <button type="button" onClick={cancelHandler} disabled={isSubmitting}>
          Cancel
        </button>
        <button disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Save"}</button>
      </div>
    </Form>
  );
}

export default EventForm;

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
  const method = request.method;

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

  let url = "http://localhost:8080/events";

  if (method === "PATCH") {
    const eventId = params.eventId;
    url = "http://localhost:8080/events/" + eventId;
  }

  const response = await fetch(url, {
    method: method,
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