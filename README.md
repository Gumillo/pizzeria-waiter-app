# Pizzeria Waiter App

Application for restaurant staff to manage table status and details.

## Features

- Home page with list of all tables and current status.
- Details page for a single table with editable fields.
- Status workflow: `Free`, `Reserved`, `Busy`, `Cleaning`.
- Business rules for people amount and max people amount.
- Bill visible only when status is `Busy`.
- Data loading and updates synchronized with API.
- Redux + Redux Thunk for state and async requests.
- React Router for navigation.
- React Bootstrap for UI.

## Tech Stack

- React 18
- Redux + React Redux + Redux Thunk
- React Router v6
- React Bootstrap + Bootstrap 5
- JSON Server

## Run Locally

Install dependencies:

```bash
npm install
```

Run app and API together (development):

```bash
npm start
```

Frontend runs on:

`http://localhost:3000`

API endpoint:

`http://localhost:3131/api/tables`

## Production Build

```bash
npm run build
```

Run production server:

```bash
npm run start:prod
```

## Repository

https://github.com/Gumillo/pizzeria-waiter-app

## Published App

Add your Replit/Heroku URL here.
