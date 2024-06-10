import { Form, useNavigate } from 'react-router-dom';

import classes from './EventForm.module.css';

function EventForm({ method, event }) {
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
        <button type="button" onClick={cancelHandler}>
          Cancel
        </button>
        <button>Save</button>
      </div>
    </Form>
  );
}

export default EventForm;
