# Eqma instructions

## 1. Installation

This repository contains both the front-end and the back-end for Eqma. Eqma can be installed on Heroku by cloning this repository to your local machine, navigating to the local repository folder and issuing the following commands (assuming Heroku client has been installed): `heroku create` and `git push heroku master`.

Eqma requires access to a MongoDB database; this needs to be set up manually. In addition, first admin user needs to be created manually in the database, with the following fields: username, passwordHash, lastName, firstName, email and status; status must be 'admin'. 

After installing Eqma, the following config vars need to be set:
- MONGO_URI full URI, including username, password and database name to a MongoDB database
- PORT port for the API
- SECRET secret key for verifying jsonwebtokens

## 2. Functionality for customer

### 2.1. Registration

An unlogged user can register as a customer by clicking on the "Register" link in the navbar and filling out the details in 
the registration window that appears. After registration, the customer is directed back to the home page; he/she needs to log 
in from the navbar in order to access functionality that is available only to logged-in customers.

### 2.2. Browsing equipment

Customers, whether logged in or not, can browse the equipment available for rent. The equipment list can be accessed from the 
navbar: Equipment -> Browse.

The list shows all equipment that the store rents. Clicking on a row shows a detail view of the equipment, where a logged-in 
customer can reserve the equipment for rent.

Customer can filter the list by equipment type and price range by entering the desired filters in the input fields above the 
list. Type selection can be cleared by selecting the "<not selected>" option in the dropdown.

The cards on the home page are links to the equipment list with preset filters: clicking on a card removes price filters, sets 
type filter to correspond to the equipment type that the card refers to and the equipment list is brought up.

### 2.3. Reserving equipment for rent

In the equipment detail view, a logged-in customer can reserve the equipment for rent. For customers not logged in, in place of 
the reservation form there is just a simple prompt to log in in order to make reservations. When the user logs in, the form is 
shown.

When making a reservation, the system checks whether any units of the equipment in question are available for the whole time 
period specified by the customer. If no units are available, an error message is briefly shown and the customer can then change 
the dates and try again. If units are available, a rental reservation is made and the system reverts to the equipment list, 
displaying briefly a succes message.

### 2.4. Viewing own rentals and cancelling reservations

When a customer is logged in, he/she can view a list of his/her own rentals and rental reservations from navbar: <Customer name>
-> My rentals.

### 2.5. Sending messages to staff

Customers can send messages to staff from the contact view (accessible from navbar: Contact us). If the customer is logged in, 
name and email fields are populated, otherwise they must be filled in. Sent messages can be viewed and replied to by staff, as 
described in section 3.5.

## 3. Functionality for staff

### 3.1. Managing Equipment Types, Equipment and Equipment Units

First, a short comment on terminology is in order. In Eqma system, "equipment" represents a particular kind of item, like a Volvo 
L150 wheel loader. The equipment are categorized into "equipment types" such as wheel loaders or heavy excavators. The actual 
physical inventory is represented by "equipment units", e.g. a two-year-old Volvo L150 wheel loader with registration number ABC-123.

When customers view equipment available for rent, they are viewing, well, equipment. But when they make a reservation or when 
the staff creates a rental, this is attached to an equipment unit.



### 3.2. Creating Asset Transactions

### 3.3. Managing Customers

### 3.4. Managing Rentals

Staff users are able to manage rentals (short for "rental agreement"): create, list and delete them. Rentals list view can be 
accessed from navbar: Customers -> Rentals/Browse. The list shows all rentals agreements as well as reservations and it can be 
sorted by clicking on the column headers.

Clicking on a row in the rentals list opens a detail view of the rental.

Rentals can be deleted from the rentals list by clicking the "Delete" button and confirming the operation in the modal view that 
opens.

### 3.5. Managing Customer Messages

As described in section 2.5., customers (whether logged in or not) can send messages that are viewable by staff members when they 
are logged in. A list of these messages can be opened from navbar: Customers -> Customers/Messages. The list shows all customer 
messages and it can be sorted by clicking on the column headers. 

When a customer message is created, it is not automatically allocated to any particular staff member to handle. Staff members 
can volunteer to handle a messsage by clicking the "Pick up" button in the customer message list. This will update the current 
user as the handler for the message, indicated by handler name appearing on the message row. The handler info can be cleared by 
clicking the "Drop" button on the row.

Clicking on a row in the message list opens a detail view of the message, where the user can also write a reply to the customer. 
NB!!! There is currently no functionality for actually sending the message! All messages with a reply are ticked as "replied" in 
the message list view.

Customer messages can be deleted either from the message list view or detail view by clicking "Delete" button and confirming the 
operation in the modal view that opens.

### 3.6. Managing Users

There are two staff roles: "user" and "admin". Currently, the only difference between these is that only admins are authorized 
to manage users, i.e. create, view, edit and delete them. In addition, there is a third role, "customer"; all Customers, whether 
self-registered or created by admin, are automatically created as users with this role.

When an admin has logged in, user list can be opened from navbar: Basic data -> Users/Browse. The user list shows all users, 
staff and customers alike. List can be sorted in ascending/descending order by clicking a column header. Clicking on a row opens 
a detail view of that particular user.

Users can be added by clicking either "Add a user" button on user list or from navbar: Basic data -> Users/Create new. All fields 
are mandatory. When user has been added, system reverts to user list and displays for a while a success message.

User information can be edited by opening the user detail view and clicking the "Edit" button. A user can be deleted in the user 
list by clicking "Delete" button of the appropriate user row and confirming the operation in the modal window that appears. The 
admin performing the operation cannot delete him/herself; this is to ensure that there is always at least one admin-level user in 
the system.
