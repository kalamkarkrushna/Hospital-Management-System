# Hospital Management System

This project is a **Hospital Management System** developed in Java. It provides core functionalities for managing patients, doctors, and appointments in a hospital setting using a MySQL database.

## Features

- **Add Patient:** Add new patients to the system.
- **View Patients:** Retrieve and display a list of all patients in the database.
- **View Doctors:** Retrieve and display a list of all doctors in the database.
- **Book Appointment:** Schedule appointments between patients and doctors, ensuring availability.
- **View Appointment:** Display all booked appointments.

## Project Structure

The project consists of the following main components:

### Source Code
- `src/HospitalManagementSystem.java`: The entry point for the application, containing the main menu and logic flow.
- `src/Doctor.java`: Handles doctor-related operations, such as viewing doctors and retrieving details by ID.
- `src/Patient.java`: Handles patient-related operations, including adding and viewing patients.

### Output
- Compiled `.class` files located in `out/production/Hospital`.

### Configuration
- `Hospital.iml`: IntelliJ IDEA module configuration file.

## Database

The application uses MySQL as the database. Below are the required tables:

### Patients Table
| Column  | Type    |
|---------|---------|
| Id      | INT     |
| Name    | VARCHAR |
| Age     | INT     |
| Gender  | VARCHAR |

### Doctors Table
| Column        | Type    |
|---------------|---------|
| Id            | INT     |
| Name          | VARCHAR |
| Specialization| VARCHAR |

### Appointments Table
| Column           | Type    |
|------------------|---------|
| Id               | INT     |
| Patient_Id       | INT     |
| Doctor_Id        | INT     |
| Appointment_Date | DATE    |

## Setup Instructions

### Prerequisites

- Java Development Kit (JDK) installed (version 8 or higher).
- MySQL database server installed.
- IntelliJ IDEA (optional, for development).

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/kalamkarkrushna/Hospital-Management-System.git
   ```
2. Import the project into IntelliJ IDEA (if using).
3. Configure the MySQL database:
   - Create a database named `Hospital`.
   - Run the SQL scripts to create the required tables.
4. Update database credentials in `HospitalManagementSystem.java`:
   ```java
   private static final String url = "jdbc:mysql://localhost:3306/Hospital";
   private static final String username = "root";
   private static final String password = "YourPassword";
   ```
5. Compile and run the application:
   ```bash
   javac -d out src/*.java
   java -cp out HospitalManagementSystem
   ```

## Usage

1. Run the application.
2. Select the desired option from the menu:
   - Add new patients.
   - View existing patients and doctors.
   - Schedule and view appointments.
3. Follow the prompts to interact with the system.

## License

This project is open-source and available under the [MIT License](LICENSE).

---

### Author

- **Krushna Kalamkar**
