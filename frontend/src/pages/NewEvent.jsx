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
    return <EventForm method="post" />;
}
