# Trade-In Vision

This is a Next.js application for vehicle appraisals, designed to be deployed on modern serverless hosting platforms like Vercel or Cloudflare Pages.

## Getting Started

Follow these instructions to set up and run the project on your local machine for development.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or newer recommended)
- [npm](https://www.npmjs.com/) (which comes with Node.js)

### 1. Set Up Environment Variables

This project uses the Resend API to send emails. You will need to create a file named `.env` in the root of your project directory to store your API keys.

1.  Create a new file named `.env` at the root of your project.
2.  Add the following lines to the file, replacing the placeholder values with your actual Resend information:

    ```
    # Your Resend API key
    RESEND_API_KEY="re_xxxxxxxxxxxxxxxx"

    # The email address you want appraisal submissions sent TO
    APPRAISAL_TO_EMAIL="your-email@example.com"

    # The email address you want submissions to come FROM.
    # This must be a domain you've verified with Resend (e.g., "appraisal@your-verified-domain.com")
    # For local testing, you can often use "delivered@resend.dev"
    APPRAISAL_FROM_EMAIL="delivered@resend.dev"
    ```

### 2. Clean Installation of Dependencies

If you've encountered errors with `npm install`, it's best to start fresh. This process ensures you don't have any corrupted packages.

1.  **Delete existing `node_modules` and `package-lock.json`**: This is a critical step to resolve installation errors. If these exist, delete them from your project folder.

2.  **Install packages**: Open your terminal in the project's root directory and run the following command:
    ```bash
    npm install
    ```
    This will read the `package.json` file and install all the required dependencies for Next.js, React, and other libraries.

### 3. Run the Development Server

Once the installation is complete, you can start the local development server.

1.  Run the following command in your terminal:
    ```bash
    npm run dev
    ```

2.  You will see output in your terminal indicating that the server is running. It will look something like this:
    ```
    - ready in 475ms
    - Local:    http://localhost:9002
    ```

3.  Open your web browser and navigate to **http://localhost:9002**. You should now see the application running. Any changes you make to the code will automatically reload the page.

That's it! You now have the application running locally.