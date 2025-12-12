Installment
npm install animejs
npm install @emoji-mart/react @emoji-mart/data --force
npm run dev

Description of Functionality

This platform is a web-based application, for disaster reporting and management aimed at enabling users to report, monitor and confirm disaster-related events while offering administrators features to oversee users, disaster information and system security. Additionally it contains a concealed gamified component to boost user involvement.

    1. User Authentication System

        Registration Page (/register)

        Users have the option to register using their email, username and password.

        Login Page (/signin)

        Both administrators and users are able to sign in via a login page (choice required).

        Upon logging in users are directed to various dashboards according to their role.

        Authentication APIs

        /api/register: Handles user registration.

        /api/login: Handles user authentication.

        Passwords are safely saved through scrypt hashing.

    2. User Features

        User Dashboard (/user/dashboard)

        Displays:

        User profile information

        Account status (Active, Banned, or Pending Review)

        Recent disaster reports submitted by the user

        The dashboard likewise includes a disaster map feature, for accessibility.

        Disaster Map (/user/map)

        Displays a map of Singapore using a MapView component.

        Users have the option to click on the map to pick a spot and send in a disaster report.

        Documents comprise:

        Description

        Severity level

        Geographic coordinates

        Report Management API (/api/user/reports)

        Enables users to access and oversee the disaster reports they have submitted.

        Account Status API (/api/user/status)

        Checks the current user’s account status and permissions.

    3. Administrator Features

        Admin Dashboard (/admin/dashboard)

        The main control panel for administrators, providing navigation to all management modules.

        Disaster Type Management (/admin/disaster-type)

        Administrators have the ability to establish and oversee disaster categories (earthquakes, floods) such, as:

        Name

        Description

        Emoji icon

        Disaster Management (/admin/disasters)

        Administrators can:

        View all disaster reports

        Check reports

        Mark declares it as misinformation

        Sort reports based on category or date

        User Management (/admin/users)

        Administrators have the ability to oversee user accounts, which includes:

        Activating users

        Banning users

        Admin APIs

        Specific API endpoints (such as /api//disasters) facilitate CRUD functions, for administrative purposes.

    4. Disaster Data Management

        Database Structure

        The system employs PostgreSQL hosted on Neon Cloud featuring the following tables:

        admin: Administrator accounts

        user: User accounts (including role and status)

        disaster_type: Disaster categories

        disaster: Disaster reports (location, severity, verification status, etc.)

        Data Operations

        Supports creating, reading, and updating disaster reports.

        The statuses of disasters encompass:

        Unverified

        Verified

        False Report

    5. Hidden / Gamified Module (Kaiju)

        Kaiju Page (/kaiju)

        A concealed amusement feature centered on Kaiju ( creatures).

        From the admin dashboard it can be accessed by engaging with a counter and typing, in the keyword "kaijuGo”.

        Subpages

        Synopsis (/kaiju/synopsis): Background story and Kaiju-related information

        Interaction (/kaiju/interaction): Interactive elements related to the Kaiju theme

        Assets

        Includes static resources such as images and background music under the Kaiju module.

    6. Other Pages

        Homepage (/)

        An introductory page displaying moving graphics that lead users into the platform.

        Main Page (/mainpage)

        Provides entry points for user registration and login.

        About Page (/info)

        An introductory page providing details, about the platform (currently holds placeholder text).

    7. Techniques implemented:

        Frontend

        Next.js 13+, client-side rendering and anime.js for animations.

        Backend

        Next.js API routes to handle logic and database operations.

        Database

        PostgreSQL hosted on Neon Cloud.

        Map Integration

        Interactive map component for disaster reporting and visualization.

        Security

        Passwords undergo hashing, with scrypt

Summary

This platform aims to improve disaster information sharing by allowing users to submit real-time disaster information and visualize it on a map, while administrators ensure data accuracy through verification and moderation. The hidden Kaiju module serves as a gamified Easter egg to enhance user engagement.

-------------------------------------------
Testing account:
Admins:  { email: 'yshisa001@mymail.sim.edu.sg', password: '123456' }, { email: 'monica.9.ais@gmail.com', password: 'Monicacheng' }
Users:  { email: 'shisa1@example.com', user_name: 'shisa1', password: '123456'}, { email: 'shisa2@example.com', user_name: 'shisa2', password: '123456'}, { email: '123@gmail.com', user_name: 'Jasmine', password: '123456'}
    
