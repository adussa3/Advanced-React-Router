import { Outlet, useLoaderData, useNavigation } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";

export default function RootLayout() {
    /*
        NOTE:
        once place where we CANNOT get events using useLoaderData() is in a higher-level route,
        for example in the RootLayout!

        The problem is that we're trying to get data from a route that's actually defined on a
        lower level

        NOTE:
        We can use useLoaderData() in the element that's assigned to a route AND in all components
        that might be used inside that element
    */
    const events = useLoaderData();
    console.log(events); // this is undefined!

    /*
        We can give user some feedback after we click on "Events"

        React Router gives us the useNavigation hook - a special hook that checks the current route transition's state
        This helps us find out if:
        (1) We're currently in an active transition
        (2) If we're loading data
        (3) Or if we have no active transition going on

        It gives us a navigation object with properties. Right now, we'll use its "state" property which is a string
        set to either:
        "idle" - don't have any active route transition
        "loading" - if we're having an active transition and we're loading data
        "submitting" - or if we're submitting data
    */
    const navigation = useNavigation();

    return (
        <>
            <MainNavigation />
            <main>
                {/*
                    NOTE:
                    the loading indicator won't be added to the page which we're transitioning to
                    It will be added to the the current/visible page that we're on!
                */}
                {navigation.state === "loading" && <p>loading...</p>}
                {/* This is the marker/place where child routes should be rendered to */}
                <Outlet />
            </main>
        </>
    );
}
