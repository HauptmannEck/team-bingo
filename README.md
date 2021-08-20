# Team Bingo

Ever get stuck in a long or frequent meeting and noticed that the same buzzwords or phrases are used a lot? 
Help yourself focus and complete with your colleges with a Bingo game built by your team, for your team.

Prod: https://team-bingo.vercel.app/

## Features
* Select your own list of words (min 24).
* Game and Boards are disposable and will live unused for up to 30 days.
* If you want to hold onto a board, a link can be emailed to you.
* Marked boxed persist for a board.

## Technology
All technologies were chosen for ease of use and scale of free tier.
* [Next.js](https://nextjs.org/) For Foundation of React and Serverless API logic.
* [Vercel](https://vercel.com/) Hosts Next.js projects easily and with a free tier.
* [PlanetScale](https://planetscale.com/) Distributed MySQL service.
* [EasyCron](https://www.easycron.com/) Simple and Free CRON job triggers (used to help with DB cleaning).
* [SendGrid](https://sendgrid.com/) Free email sending with simple API.

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Will need an `.env.local` file or Env Variables to connect to PlanetScale and SendGrid services. 
```
PLANETSCALE_DB_HOST=<>
PLANETSCALE_DB_PASSWORD=<>
PLANETSCALE_DB_USERNAME=<>
PLANETSCALE_DB=<>
PLANETSCALE_ORG=<>
PLANETSCALE_TOKEN=<>
PLANETSCALE_TOKEN_NAME=<>
SENDGRID_API_KEY=<>
```
