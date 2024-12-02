# Cryptocurrency Portfolio Tracker

## Table of Contents
- [Cryptocurrency Portfolio Tracker](#cryptocurrency-portfolio-tracker)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Step 1](#step-1)
  - [Step 2](#step-2)
  - [Usage](#usage)
  - [Additional Features and Enhancements](#additional-features-and-enhancements)
  - [Project Structure](#project-structure)

## Overview

Cryptocurrency Portfolio Tracker is a web application designed to help users manage and track their cryptocurrency holdings effortlessly.Users can add, edit, and delete their holdings, view real-time prices, and analyze historical performance through interactive charts.

## Features

- **Add/Edit/Delete Holdings:** Manage your cryptocurrency portfolio with ease.
- **Real-time Price Fetching:** Get up-to-date prices for your selected cryptocurrencies.
- **Historical Price Charts:** Visualize the performance of your holdings over various timeframes.
- **Responsive Design:** Optimised for both desktop and mobile devices.
- **State Persistence:** Your portfolio data is saved and persists across sessions.
- **Search and Sort:** Easily filter and organize your holdings based on different criteria.
- **Dark/Light Mode:** Toggle between themes for comfortable viewing in any environment.

## Technologies Used

- **React:** Frontend library for building user interfaces.
- **Redux Toolkit:** Efficient state management solution.
- **React Redux:** Official React bindings for Redux.
- **Redux Persist:** Persist and rehydrate the Redux store.
- **React Router:** Declarative routing for React applications.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
- **React Query (@tanstack/react-query):** Data fetching and caching.
- **Axios:** Promise-based HTTP client for the browser and Node.js.
- **TypeScript:** Superset of JavaScript that adds static typing.
- **React Icons:** Popular icon library for React projects.

## Installation

### Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js:** Install the latest LTS version from [Node.js Official Website](https://nodejs.org/).
- **npm or yarn:** Package manager that comes with Node.js. Alternatively, install yarn from [Yarn Official Website](https://yarnpkg.com/).

### Steps

## Step 1
 
 ```bash
    git clone https://github.com/Liron-Toledo/crypto-portfolio-tracker.git
    cd crypto-portfolio-tracker
    npm install
    npm start
  ``` 
The application will start on http://localhost:5173.

## Step 2

You will also need to run the proxy server to access coin data pulled from the CoinGecko API. To do this:

 ```bash
    cd crypto-portfolio-tracker
    cd backend
    npm install
    npm start
  ``` 
Thi will run the server on http://localhost:3000.
  
---

## Usage

1. **Add a New Holding**
   - Navigate to the “Add Holding” page.
   - Search for a cryptocurrency by name or symbol.
   - Select the desired cryptocurrency and enter the quantity you hold.
   - Submit the form to add it to your portfolio.

2. **Edit an Existing Holding**
   - In the holdings list, click the edit icon next to the holding you wish to modify.
   - Update the necessary details and save the changes.

3. **Delete a Holding**
   - In the holdings list, click the delete icon next to the holding you wish to remove.
   - Confirm the deletion to remove it from your portfolio.

4. **View Holding Details**
   - Click the details icon next to a holding to view more information, including historical price charts.

5. **Toggle Dark/Light Mode**
   - Use the theme toggle switch (if implemented) to switch between Dark and Light modes.

6. **Search and Sort Holdings**
   - Use the search bar to filter holdings by name or symbol.
   - Sort holdings by name, symbol, quantity, current price, or total value using the sort controls.

---

## Additional Features and Enhancements

- **Optimised Performance:**
  - Utilises `react-query` for efficient data fetching, caching, and state management, minimising unnecessary network requests.

- **State Persistence:**
  - Employs `redux-persist` to save and rehydrate the Redux store, ensuring that user data persists across sessions.

- **Error Boundary:**
  - An error boundary wraps the app to gracefully handle any unexpected errors and display fallback UI. This can be extended to wrap individual components as a future enhancement.

- **View Coin History:**
  - Users can view the price history of cryptocurrencies across multiple timeframes (e.g., 1D, 7D, 1M, 3M, 1Y).

- **Dark and Light Mode:**
  - The app includes a theme toggle, allowing users to switch between Dark and Light modes for a comfortable viewing experience.

- **Proxy Server for API Calls:**
  - Implements a proxy server to handle API calls and bypass CORS restrictions, ensuring secure communication with external data providers (e.g CoinGecko).

- **Server-Side API Caching:**
  - Data fetched from the CoinGecko API is cached on the server using `node-cache`, reducing redundant requests and improving performance.

---

## Project Structure

```bash
crypto-portfolio-tracker/
├── src/
│   ├── components/
│   │   ├── HoldingDetails.tsx
│   │   ├── HoldingForm.tsx
│   │   └── HoldingsList.tsx
│   ├── features/
│   │   └── holdings/
│   │       └── holdingsSlice.ts
│   ├── hooks/
│   │   └── useFetchCryptoData.ts
│   ├── pages/
│   │   ├── AddEditHolding.tsx
│   │   └── Details.tsx
│   ├── store.ts
│   ├── types.ts
│   └── index.tsx
├── public/
│   └── index.html
├── package.json
├── tailwind.config.js
└── README.md
```
