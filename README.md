# Online Examination System

A comprehensive web application for creating, administering, and grading online exams. Built with React frontend and Spring Boot backend.

## Features

- **User Authentication**: Secure login and registration system with role-based access control
- **Dashboard**: Intuitive interface for students and administrators
- **Exam Management**: Create, modify, and delete exams with various question types
- **Exam Taking**: Interactive interface for students to take exams with timer and progress tracking
- **Results & Analytics**: View detailed results and performance analytics
- **Profile Management**: Update user profile and account settings

## Technology Stack

### Frontend
- React.js for UI components
- Redux Toolkit for state management
- React Router for navigation
- Material-UI components
- CSS for custom styling

### Backend
- Spring Boot framework
- Spring Security for authentication
- JPA/Hibernate for database operations
- RESTful API design

### Database
- MySQL for data persistence

## Project Structure

### Frontend Structure
```
frontend/
├── public/             # Static files
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable UI components
│   ├── store/          # Redux store configuration
│   │   └── slices/     # Redux slices
│   ├── styles/         # CSS stylesheets
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
└── package.json        # Dependencies and scripts
```

### Backend Structure
```
src/main/
├── java/com/exam/onlineexam/
│   ├── config/         # Configuration classes
│   ├── controller/     # REST controllers
│   ├── dto/            # Data transfer objects
│   ├── model/          # Entity classes
│   ├── repository/     # Data access interfaces
│   ├── service/        # Business logic
│   │   └── impl/       # Service implementations
│   └── OnlineExamApplication.java  # Entry point
└── resources/
    ├── application.properties  # Application settings
    └── schema.sql              # Database schema
```

## Getting Started

### Prerequisites
- Node.js and npm
- Java JDK 11 or higher
- Maven
- MySQL database

### Installation & Setup

#### Frontend
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
   The application will be available at `http://localhost:3000`

#### Backend
1. Configure database connection in `src/main/resources/application.properties`:
   ```
   spring.datasource.url=jdbc:mysql://localhost:3306/exam_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

2. Build the application:
   ```
   mvn clean install
   ```

3. Run the application:
   ```
   mvn spring-boot:run
   ```
   The backend API will be available at `http://localhost:8080`

## User Roles and Permissions

### Student
- Register and login
- View available exams
- Take exams
- View results and performance analytics
- Update profile information

### Administrator
- All student permissions
- Create, modify, and delete exams
- Add and manage questions
- Review student submissions
- Generate reports
- Manage user accounts

## Development Status

The application is currently under active development. The frontend mock authentication is implemented for testing purposes until the backend services are fully integrated.

## Future Enhancements

- Support for different question types (multiple choice, true/false, short answer, essay)
- File upload capability for assignments
- Real-time chat support during exams
- Advanced analytics with visual representations
- Email notifications for exam schedules and results
- Time-bound exam availability
- Anti-cheating measures

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries or support, please contact [your contact information].