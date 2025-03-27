# Restaurant-System

## About the project
A restaurant system that intends to work substituting all the pen and paper from the process of a restaurant by implementing a mobile restaurant app
<br/>
## Main Features
- **Authentication system**: the system has two roles: admin and employe, each one with its own functions;
- **JWT Authorization**: all application endpoints requires the JWT authorization;
- **Order by table**: with this system is possible to create an order by a table, select its items and at the end generate its bill;
- **Orders Queue**: all the orders appears in a queue. Explicitly showing the order's position;
- **Thermal Printer Integration**: this system has an integration with POS Printers along with a print server. The integration works in order to print the customers bills and the end of the order

## Description
This application is designed for restaurants to manage table orders efficiently. It includes a secure authentication system with two user roles: admin, who has access to management functions (like register items, tables and employees) and employee, who handles day-to-day operations.
Employees and admins can create orders by selecting a table and choosing items for that table. Once the order is placed, it enters an order queue that shows the position of each order, helping staff track progress in real-time.
At the end of the order, once the system users request the order's finalization, the system automatically generate and print a bill using a thermal POS printer. This printing process is handled through an integrated print server, streamlining the workflow from order placement to billing.
All parts of the system are protected by JWT-based authorization, ensuring that only authenticated users can access its features.


## Techonoglies Applied
- **Back end:** JavaScript/TypeScript; Express.js; Node.js, JWT Auth, JWT Refresh Token, Printer Integration
- **Front end:** React Native; EXPO (for native mobile features); Storage system
- **Database:** PostgreSQL
