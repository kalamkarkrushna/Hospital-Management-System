CREATE TABLE IF NOT EXISTS hospitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

CREATE TABLE IF NOT EXISTS Patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(20),
    hospital_id INT NOT NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

CREATE TABLE IF NOT EXISTS Doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    hospital_id INT NOT NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

CREATE TABLE IF NOT EXISTS Appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Patient_Id INT NOT NULL,
    Doctor_Id INT NOT NULL,
    Appointment_Date VARCHAR(50),
    hospital_id INT NOT NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    description TEXT,
    amount DOUBLE,
    status VARCHAR(50),
    date VARCHAR(50),
    hospital_id INT NOT NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

CREATE TABLE IF NOT EXISTS medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    stock INT,
    price DOUBLE,
    expiry_date VARCHAR(50),
    hospital_id INT NOT NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

CREATE TABLE IF NOT EXISTS lab_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    test_name VARCHAR(255),
    result TEXT,
    notes TEXT,
    report_date VARCHAR(50),
    hospital_id INT NOT NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

CREATE TABLE IF NOT EXISTS inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    quantity INT,
    unit VARCHAR(50),
    reorder_level INT,
    hospital_id INT NOT NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

CREATE TABLE IF NOT EXISTS shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    date VARCHAR(50),
    start_time VARCHAR(50),
    end_time VARCHAR(50),
    hospital_id INT NOT NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

CREATE TABLE IF NOT EXISTS video_calls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    scheduled_date VARCHAR(50),
    status VARCHAR(50),
    meeting_link VARCHAR(500),
    hospital_id INT NOT NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT NOT NULL,
    plan VARCHAR(50),
    status VARCHAR(50),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);
