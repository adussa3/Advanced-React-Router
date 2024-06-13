import { Link, useSubmit } from 'react-router-dom';
import classes from './EventItem.module.css';

function EventItem({ event }) {
  // We need to trigger the action and submit the data programatically
  // and just as we can navigate programatically using useNavigate, we
  // can also submit data and trigger an action programatically with the
  // special useSubmit hook!
  //
  // The useSubmit hook, is imported from react-router-dom, and it gives
  // you a submit function which we can call to proceed and trigger an
  // action
  const submit = useSubmit();

  /*
    There is another way to trigger the action function of a route (defined in the route defintions - in app.js)
  */
  function startDeleteHandler() {
    // prompt the user to confirm if they really want to delete the event
    const proceed = window.confirm("Are you sure?");

    if (proceed) {
      // In this submit function, we can pass in two arguments:
      // (1) form data object - the data that we want to submit
      // (2) allows us to set the same values that we can set on a form
      //
      // NOTE: we can also set our action key on a different route path
      // ex: submit(null, { method: "delete", action: "/a-different-path" });
      submit(null, { method: "delete" });
    }
  }


  return (
    <article className={classes.event}>
      <img src={event.image} alt={event.title} />
      <h1>{event.title}</h1>
      <time>{event.date}</time>
      <p>{event.description}</p>
      <menu className={classes.actions}>
        <Link to="edit">Edit</Link>
        <button onClick={startDeleteHandler}>Delete</button>
      </menu>
    </article>
  );
}

export default EventItem;
