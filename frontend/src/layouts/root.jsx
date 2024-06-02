import { Outlet } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";

export default function RootLayout() {
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
