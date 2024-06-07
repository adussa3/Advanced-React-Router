const express = require('express');

const { getAll, get, add, replace, remove } = require('../data/event');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const events = await getAll();
    /*
      The response is only sent from the backend to the frontend after 1.5 seconds
      Now when we navigate to "Events", there is a 1.5 seconds delay
      
      This is just to prove that data fetching is initiated as soon as we initiate
      the route transition
      
      But by default, React Router will actually wait for the data to be fetched, so
      for the loader to be finished BEFORE it renders the page with the fetched data
      
      The advantage is that you can rely on teh data being there once the events page
      component is being rendered
      
      You don't need to worry about whether the data is there or not, and therfore,
      you don't eed to render a loading state on the EventsPage component
      
      The downside is that there's a delay where it looks to the user as if nothing is
      happening
      
      However, React Router gives us a tool to get the loading state while the page is
      loading
    */
    // setTimeout(() => {
    //   res.json({ events: events });
    // }, 1500);

    res.json({ events: events });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const event = await get(req.params.id);
    res.json({ event: event });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = 'Invalid title.';
  }

  if (!isValidText(data.description)) {
    errors.description = 'Invalid description.';
  }

  if (!isValidDate(data.date)) {
    errors.date = 'Invalid date.';
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = 'Invalid image.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'Adding the event failed due to validation errors.',
      errors,
    });
  }

  try {
    await add(data);
    res.status(201).json({ message: 'Event saved.', event: data });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = 'Invalid title.';
  }

  if (!isValidText(data.description)) {
    errors.description = 'Invalid description.';
  }

  if (!isValidDate(data.date)) {
    errors.date = 'Invalid date.';
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = 'Invalid image.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'Updating the event failed due to validation errors.',
      errors,
    });
  }

  try {
    await replace(req.params.id, data);
    res.json({ message: 'Event updated.', event: data });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await remove(req.params.id);
    res.json({ message: 'Event deleted.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
