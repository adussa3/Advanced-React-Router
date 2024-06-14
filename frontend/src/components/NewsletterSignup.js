import { useFetcher } from 'react-router-dom';
import classes from './NewsletterSignup.module.css';
import { useEffect } from 'react';

function NewsletterSignup() {
  /*
    PROBLEM:
    We want to trigger the newsletterAction whenever the newsletter form is submitted.

    This works when we're on the newsletter page, BUT this form is included on all routes
    because it's a part of MainNavigation.js

    Therefore, we would have to add the newsletterAction on all routes, but this will be a
    lot of code duplication and clash with other actions that we might need for out routes
    
    OR we can target a single route by setting the Form's "action" attribute, but this will
    initialize a transition to this route and leave the current route! In this case, we want
    to stay on the current route

    SOLUTION:
    This is such a common usecase that React Route has a solution for it. They provide a special
    hook called useFetcher

    The useFetcher hook, when executed, gives you an object with a bunch of useful properties and
    methods

    For example,it gives you another form component (which is different from the <Form> component)
    it also gives you a submit() function (which is different from the submit function from useSubmit)

    But what is the difference with the useFetcher's form and submit function compared to the <Form>
    component and the useSubmit hook's submit function?

    If we use the <fetcher.Form> component, it still triggers an action (just like with <Form> component)
    but it will NOT initialize a route transition!

    So fetcher should be used whenever we want to trigger an action - or also a loader - without actually
    navigating to the page to which the action or loader belongs to
  */
  const fetcher = useFetcher();

  // We can get form feedback using other properties provided by fetcher!
  // because the useFetcher hook is the tool we should use to interact with an action or a loader without transitioning
  //
  // In other words, if we want to send requests behind the scenes without triggering any route changes. Therefore,
  // fetcher also includes a bunch of properties that help you know whether the action or loader is triggered successfully
  //
  // You also get access to any data returned by the action or loader
  //
  // NOTE: the data object is the data that's being returned by the action or loader
  //       we can also get a hold of the state value which is equal to "idle", "loading", or "submitting" 
  const { data, state } = fetcher;

  // We can useEffect to update the UI accordingly when the data or state changes
  useEffect(() => {
    // idle means we're not executing an action or loader anymore
    // here we're checking if the "newsletter" action returns an object with a message property
    if (state === "idle" && data && data.message) {
      window.alert(`Signup successful! \n data.message: ${data.message}`);
    }
  }, [data, state])

  return (
    // We add the "action" attribute and set it to "/newsletter" because we want to trigger the action of the newsletter route
    // But we don't want to load the "/newsletter" route's component
    //
    // NOTE: if we use the default <Form> component, we would be forwarded/navigated to the "/newsletter" route component
    <fetcher.Form method="post" action="/newsletter" className={classes.newsletter}>
      <input
        type="email"
        placeholder="Sign up for newsletter..."
        aria-label="Sign up for newsletter"
      />
      <button>Sign up</button>
    </fetcher.Form>
  );
}

export default NewsletterSignup;
