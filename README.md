# CommonCents - Trading Information Hub

CommonCents is a comprehensive Trading Information Hub designed to help beginners and anyone interested in trading learn more about trading through various features. This web application and mobile device application provide access to Trading News, Trading Guidelines, Trading Simulation, Market Overview, and a Forum. The project focuses on Stock Indices and Volatility Market, with a trading simulation that uses live data and virtual currency for options trading. Users can share a single account on both platforms, and they are ranked on a leaderboard based on their net worth, creating a gamified aspect to attract and engage users.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Details](#project-details)
3. [Technologies Used](#technologies-used)
4. [Features](#features)
5. [Sources Used](#sources-used)
6. [Project Links](#project-links)
7. [Code Structure](#code-structure)
8. [Challenges Faced](#challenges-faced)
9. [Future Improvements](#future-improvements)

## Getting Started

To install the CommonCents app, follow these steps:

1. Clone the repository: `git clone git@github.com:muhdlubega/DRC-CommonCents-WebApp.git`
2. Change into the project directory: `cd DRC-CommonCents-WebApp`
3. Install dependencies: `npm install`
4. Start the development server using vite: `npm run dev`
5. Open your web browser and navigate to: `http://localhost:3000` to access the app.

## Project Details

CommonCents is an educational Trading Information Hub that aims to provide accessible and comprehensive trading knowledge for aspiring and ongoing traders. The project focuses on option trading and covers Stock Indices and Volatility Market. With features such as Trading News, Trading Guidelines, Trading Simulation, Market Overview, and Forum, users can gain valuable insights and improve their trading skills.

## Technologies Used

CommonCents is built using the following technologies:

- **React**: A popular JavaScript library for building user interfaces.
- **TypeScript**: A superset of JavaScript that adds static typing to the language, providing better code quality and improved developer experience.
- **SASS**: A CSS preprocessor that enhances the styling capabilities of CSS with variables, nested rules, and more.
- **Mobx**: A state management library that makes it easy to manage the application's state and keep components in sync with the data.
- **Framer Motion**: A powerful animation library for creating smooth and interactive animations in React applications used to integrate simple animations into the website.
- **MUI (Material-UI)**: A popular React UI framework that provides pre-designed components following the Material Design guidelines used to improve overall design and functionalities.
- **Vite**: A fast and efficient build tool that enhances the development experience for modern JavaScript applications used to increase build and development speed/performance.
- **Axios**: A JavaScript library used for making HTTP requests to fetch data from APIs used to call Rest API data from Alpha Vantage News API.
- **Firebase**: A comprehensive platform by Google for building web and mobile applications, providing authentication, database, and hosting services used as a pseudo backend database for storing client data.
- **Highcharts**: A powerful charting library used to visualize data in interactive and customizable charts used to display the live market data in line as well as candlestick format.
- **Iconsax**: A collection of high-quality icons for web projects used to supply icons across the web app.
- **React Alice Carousel**: A React carousel component for showcasing images and content in a carousel format used to display components such as news cards and trading info cards in a more interactive way.
- **React Date Picker**: A simple and customizable date picker component for React applications used to filter trade history for the trading simulation history.
- **React DOM**: A package providing DOM-specific methods that can be used at the top level of a web application.
- **React Router DOM**: A library that enables navigation and routing functionality for React applications.

## Features

- Options Trading Simulation: Provides a simulated trading experience for CALL/PUT options in the synthetics market. It includes Continuous Indices (Volatility 10-100 Index), Jump Indices (Jump 10-100 Index), and Daily Reset Indices (Bear/Bull Market Index).
- Live Data: The trading simulation uses real-time data to make the experience as close to real trading as possible.
- Latest Trading and Market News: Stay updated with the latest news related to trading and market trends.
- Simple Forum: Users can engage in discussions, ask questions, and share insights on the platform's forum.
- Trade History: Keeps track of users' trading history for analysis and learning.
- Leaderboard: Users are ranked based on their net worth in the trading simulation, adding a competitive aspect to the platform.
- Light/Dark Mode: Offers a choice of light and dark themes for user preference.

## Sources Used

- **Deriv API**: Used for trading data, chart data, and price proposals for the trading simulation. [Deriv API Documentation](https://developers.deriv.com/)
- **AlphaVantage API**: Utilized as a source for trading news. [AlphaVantage API Documentation](https://www.alphavantage.co/documentation/)

## Project Links

- Website: [https://commoncents.vercel.app/](https://commoncents.vercel.app/)
- GitHub Repository: [https://github.com/muhdlubega/DRC-CommonCents-WebApp](https://github.com/muhdlubega/DRC-CommonCents-WebApp)

## Code Structure

The CommonCents project is structured as follows:

```
-src
   -App.tsx
   -firebase.tsx
   -main.tsx
   -arrays
      -FAQArray.tsx
      -MarketArray.tsx
      -NewsTopicsArray.tsx
      -TradeTypeArray.tsx
   -assets
      -/* Image and video assets */
   -components
      -authentication
         -Alert.tsx
         -AuthModal.tsx
         -Login.tsx
         -SignUp.tsx
         -LogoutDialog.tsx
         -PasswordChange.tsx
         -ResetBalanceDialog.tsx
         -UserSidebar.tsx
      -homepage
         -Banner.tsx
         -Header.tsx
         -LiveData.tsx
         -LatestNews.tsx
         -TradingType.tsx
         -TradeIntro.tsx
         -Footer.tsx
      -navbar
         -Navbar.tsx
      -newspage
         -NewsTopic.tsx
      -trade
         -Chart.tsx
         -DerivAPIBasic.d.ts
         -Price.tsx
         -Proposal.tsx
   -config
      -NewsApi.tsx
   -pages
      -AboutPage.tsx
      -AccountPage.tsx
      -Enquiry.tsx
      -Error.tsx
      -FAQ.tsx
      -FavouritesPage.tsx
      -ForumPage.tsx
      -HomePage.tsx
      -LeaderboardPage.tsx
      -LoginAccess.tsx
      -NewsPage.tsx
      -TradeHistory.tsx
      -TradePage.tsx
   -store
      -ApiStore.tsx
      -AuthStore.tsx
      -ChartsStore.tsx
      -ContractStore.tsx
      -ForumStore.tsx
      -NewsStore.tsx
      -ProposalStore.tsx
      -ThemeStore.tsx
   -styles
      -/* .scss files for styling */
-.env
```

The structure is divided into various folders for better organization:

- `src`: The main source folder containing all the application's code.
  - `App.tsx`: The app file where all pages are routed, and the theme provider is included.
  - `firebase.tsx`: The Firebase config file with details taken from the `.env` file.
  - `main.tsx`: The main file where the React app is initialized and rendered.
  - `arrays`: Contains different data and information arrays for display or data rendering.
    - `FAQArray.tsx`: An array of FAQ questions and answers included for the FAQ page.
    - `MarketArray.tsx`: An array of market endpoint details used as connection tools with the Deriv API to call their data and/or display respective names/images.
    - `NewsTopicsArray.tsx`: An array of news topics used to call the AlphaVantage API categories.
    - `TradeTypeArray.tsx`: A data array to display different trading type information on the homepage.
  - `assets`: Contains all the images/videos used as assets across the webpage and the asset documentation document.
  - `components`: Contains various components used across the webpage.
    - `authentication`: Contains authentication-related components.
      - `Alert.tsx`: An alert snackbar for global alerts for different success/error messages.
      - `AuthModal.tsx`: An authentication modal popup for user login and signup.
      - `Login.tsx`: Login structure for the auth modal using Firebase.
      - `SignUp.tsx`: Signup structure for the auth modal using Firebase.
      - `LogoutDialog.tsx`: A logout confirmation dialog structure on click of the logout button in the accounts page and user sidebar.
      - `PasswordChange.tsx`: A password change confirmation dialog structure on click of the change password button in the accounts page.
      - `ResetBalanceDialog.tsx`: A reset balance confirmation dialog structure on click of the reset balance button in the accounts page and user sidebar.
      - `UserSidebar.tsx`: A user sidebar structure for logged-in users.
    - `homepage`: Contains all components for the homepage.
      - `Banner.tsx`: An intro banner for the homepage.
      - `Header.tsx`: An intro header for the homepage describing the website's features.
      - `LiveData.tsx`: Charts of different synthetic markets for comparison and a link to the trade page.
      - `LatestNews.tsx`: The latest trading news from the AlphaVantage API.
      - `TradingType.tsx`: A carousel of infographics on different market types.
      - `TradeIntro.tsx`: The bottom of the homepage with a call-to-action to link users to the trade page.
      - `Footer.tsx`: The website footer.
    - `navbar`: Contains the navbar for global use.
      - `Navbar.tsx`: A navbar to link all the pages and the user sidebar.
    - `newspage`: Contains a component for the newspage.
      - `NewsTopic.tsx`: Contains news page content.
    - `trade`: Contains components for the trade page.
      - `Chart.tsx`: Contains a chart for the trading simulation with market type, chart type, and duration choices using data from the Deriv API.
      - `DerivAPIBasic.d.ts`: A module declaration for the Deriv API.
      - `Price.tsx`: A current price display for market live data.
      - `Proposal.tsx`: A proposal structure for contract buy/sell logic in the trading simulation.
  - `config`: Contains a config folder for API call logic.
    - `NewsApi.tsx`: AlphaVantage API endpoints import using Axios.
  - `pages`: Contains files for the different pages:
    - `AboutPage.tsx`: A page containing info on the webpage, features, and the team.
    - `AccountPage.tsx`: Users' account page for account details and updating account info.
    - `Enquiry.tsx`: The help and support page to send feedback to the client.
    - `Error.tsx`: An error 404 page.
    - `FAQ.tsx`: The FAQ page for usual questions.
    - `FavouritesPage.tsx`: Contains favorited posts from the forums page.
    - `ForumPage.tsx`: Contains forum posts for users to upload, comment, and favorite.
    - `HomePage.tsx`: The main landing page.
    - `LeaderboardPage.tsx`: The leaderboard page for users where they are sorted according to net worth gained from the trading simulation.
    - `LoginAccess.tsx`: An error 401 page for users who are not logged in.
    - `NewsPage.tsx`: The newspage containing the latest trading news for different categories with a search function.
    - `TradeHistory.tsx`: The history of trading simulation results for the buy/sell system.
    - `TradePage.tsx`: The trading simulation page.
  - `store`: Contains Mobx stores for state management, storing values and functions for global uses.
    - `ApiStore.tsx`: Contains main trading data from the Deriv API for charts and buy/sell function.
    - `AuthStore.tsx`: Contains authentication-related services related to Firebase for user data.
    - `ChartsStore.tsx`: Contains charts data for live data on the homepage.
    - `ContractStore.tsx`: Contains buy/sell logic for the trading process.
    - `ForumStore.tsx`: Contains forum data with forum fetch and update functions.
    - `NewsStore.tsx`: Contains newspage data for AlphaVantage API fetch.
    - `ProposalStore.tsx`: Contains data for trading simulation proposals fetched from the Deriv API.
    - `ThemeStore.tsx`: Global theme settings for light/dark mode.
  - `styles`: Contains all .scss files for styling.
- `.env`: Contains private credentials for Firebase and AlphaVantage API keys.

## Challenges Faced

During the development of CommonCents, several challenges were encountered:

1. Understanding the Data Output and API Response Type: Integrating with external APIs, such as the Deriv API and AlphaVantage API, required understanding the data output and response types to properly structure and handle the data within the application.

2. Complications with Websocket Calls and Data Storing: Implementing websocket calls and managing data storage for different endpoints and clashing sources posed challenges in handling real-time data updates and keeping the application synchronized.

3. Limited API Calls and Resources for News: The limited API calls and resources for news from the AlphaVantage API resulted in slower response times, affecting the performance of the news-related features.

4. No Core Backend Feature: CommonCents lacked a core backend feature, leading to limited and simple functionalities for server rendering and data storage. This limitation affected the scalability and complexity of certain features.

5. Structuring the Database and Authentication for Mobile App Alignment: Ensuring that the database and authentication mechanisms align well with the mobile app's requirements presented challenges in creating a seamless user experience across platforms.

6. Storing Data for Price Display and Buy/Sell Logic: Storing data for price display and implementing the buy/sell logic, including trade history tracking, required careful data management and storage strategies.

## Future Improvements

To enhance CommonCents and provide a better user experience, the following improvements are planned:

1. Adding More Markets: Expanding the range of markets and trading options available on the platform will attract a wider audience and increase engagement.

2. Cleaner and More Interesting UI: Enhancing the user interface with a clean and visually appealing design will improve user engagement and overall satisfaction.

3. Improved Responsiveness: Ensuring the application is fully responsive across various devices and screen sizes will enhance accessibility and user experience.

4. More Complex Trading System with Proper Backend Structure: Implementing a more complex trading system with a robust backend structure will allow for advanced trading features and improved performance.

5. Cleaner and More Structured Code: Continuously refactoring and optimizing the codebase will lead to improved maintainability, easier collaboration among developers, and a more efficient development process.

By addressing these challenges and implementing the planned improvements, CommonCents aims to provide a better trading information hub for users, making it an attractive and reliable platform for aspiring and ongoing traders.
