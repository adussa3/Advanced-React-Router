import { Link } from "react-router-dom";
import EventDetailPage from "./EventDetail";

const EVENTS = [
    { id: "e1", name: "Event 1" },
    { id: "e2", name: "Event 2" },
    { id: "e3", name: "Event 3" },
];

export default function EventsPage() {
    return (
        <>
            <h1>Events Page</h1>
            <ul>
                {EVENTS.map((event) => {
                    return (
                        <li key={event.id}>
                            <Link to={event.id}>{event.name}</Link>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
