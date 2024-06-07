import { Outlet, useLoaderData } from "react-router-dom";
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

    return (
        <>
            <MainNavigation />
            <main>
                {/* This is the marker/place where child routes should be rendered to */}
                <Outlet />
            </main>
        </>
    );
}
