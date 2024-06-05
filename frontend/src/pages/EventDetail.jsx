import { useParams } from "react-router-dom";

export default function EventDetailPage() {
    // This hook gives us a params object which is a simple JavaScript object
    // which contains every dynamic path segment that we defined in our route
    // definition as a property
    //
    // Ex: for http://localhost:3000/root/products/:productId
    //         http://localhost:3000/root/products/p1
    //
    // params.productId is equal to "p1"
    const params = useParams();

    return (
        <>
            <h1>Event Detail Page</h1>
            <p>{params.eventId}</p>
        </>
    );
}
