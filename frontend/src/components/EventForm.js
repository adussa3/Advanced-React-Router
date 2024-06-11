import { Form, useNavigate, useNavigation } from 'react-router-dom';

import classes from './EventForm.module.css';

function EventForm({ method, event }) {
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
    <Form method="post" className={classes.form}>
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
