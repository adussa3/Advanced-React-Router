import { useRouteError } from "react-router-dom";
import PageContent from "../components/PageContent";
import MainNavigation from "../components/MainNavigation";

export default function ErrorPage() {
    /*
        Because we returned a Response when we get an error for fetching events (in Events.jsx),
        we can get hold of the data that's being thrown inside the Response as an error inside
        of the componenet that's being rendered as an error element

        The useRouteError() Hook gives us an error object, and the shape of the object depends
        on whether you threw a response or any other kind of object or data

        If you threw a response (like in Events.jsx), the "error" object will include a "status"
        field which reflects the status of the response we threw

        If we threw any other type of object (like a regular JavaScript object), then the "error"
        object would already be that thrown object and we would not have the speical "status"
        property

        This is one reason why we might want to throw Responses instead of regular JavaScript
        objects, because it does allow you to include this extra status property which helps
        with building a generic error handling component 
    */
    const error = useRouteError();
    const status = error.status;

    let title = "An error ocurred";
    let message = "Something went wrong!";

    if (status === 500) {
        /*
            NOTE:
            "error.data" gets access to the data in the error response that was thrown in Events.jsx: { message: "Could not fetch events." }
            and this object has a "message" property, and we can assume that most objects included in error responses will have a message
            property

            ALSO NOTE:
            The data object was stringified in Events.jsx, so we need to convert it back to an object
        */
        console.log("error", error);
        console.log("error.data", error.data);

        // You need to parse the JSON format if you throw a Response object as an error! (refer back to Events.jsx)
        // message = JSON.parse(error.data).message;

        // Instead, since we threw json() from react-router-dom to return the error, React Router automatically parses
        // the data for us! We don't need to manually change the code!
        message = error.data.message;
    }

    // NOTE: 404 error is the default status set by React Router if you enter a path that's not supported
    if (status === 404) {
        title = "Not found";
        message = "Could not find resource or page.";
    }

    return (
        <>
            <MainNavigation />
            <PageContent title={title}>
                <p>{message}</p>
            </PageContent>
        </>
    );
}
