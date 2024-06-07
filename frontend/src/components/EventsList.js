import { useLoaderData } from 'react-router-dom';
import classes from './EventsList.module.css';

function EventsList({ events }) {
  /*
    We can call useLoaderData() here even if it's not a page component!
    (technically there's no difference between a page component and other components)

    NOTE:
    once place where we CANNOT get events using useLoaderData() is in a higher-level route,
    for example in the RootLayout!
  */
  const eventsLoaderData = useLoaderData();
  console.log(eventsLoaderData)

  return (
    <div className={classes.events}>
      <h1>All Events</h1>
      <ul className={classes.list}>
        {events.map((event) => (
          <li key={event.id} className={classes.item}>
            <a href="...">
              <img src={event.image} alt={event.title} />
              <div className={classes.content}>
                <h2>{event.title}</h2>
                <time>{event.date}</time>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsList;
