# Tennis Experience Board 🎾

A community platform designed specifically for international tennis players in the USA to share experiences, connect with others, and support each other's journey in American college tennis.

## 📱 Demo

Here's a walkthrough of implemented features:

[Watch the walkthrough video](https://www.loom.com/share/dfb58245ecac4d4f81a9c1d15cc68e19?sid=828840d7-153f-4385-801d-af3769ce8d57)

## 🌟 Features

### User Authentication

- **Secure Registration & Login**: Create accounts with encrypted passwords
- **User Profiles**: Personal profiles with university information
- **Session Management**: Secure login sessions with logout functionality

### Experience Sharing

- **Submit Tennis Experiences**: Share stories about tournaments, practices, and challenges
- **Categorized Content**: Organize experiences by type (College Tournament, Practice, etc.)
- **Community Responses**: Reply to others' experiences and build connections

### Community Features

- **Recent Experiences**: View the latest stories from the community
- **Interactive Responses**: Engage with fellow tennis players through comments
- **Founder Story**: Learn about the platform's mission and creator

### User Experience

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Guest Preview**: Non-registered users can view limited content
- **Encouraging Registration**: Clear calls-to-action to join the community

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: Passport.js with local strategy
- **Templating**: EJS (Embedded JavaScript)
- **Styling**: CSS with responsive design
- **Security**: bcrypt for password hashing
- **Environment Management**: dotenv

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/Maflores1/Tennis-Experience-Platform.git
cd Tennis-Experience-Platform
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/myTennis
```

4. **Set up the database**

```bash
# Create PostgreSQL database
createdb myTennis

# Run the database seeding script
node models/populatedb.js
```

5. **Start the application**

```bash
node app.js
```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 🎮 Usage

### For New Users

1. **Explore**: Browse recent experiences without registering
2. **Register**: Create a free account to unlock full features
3. **Share**: Submit your tennis experiences and stories
4. **Connect**: Respond to others' experiences and build community

### Test Accounts

The seeded database includes test accounts for demo purposes:

- **Username**: `mateo` | **Password**: `mateo123`
- **Username**: `arthur` | **Password**: `arthur123`
- **Username**: `testuser` | **Password**: `test123`

### Key Features Demo

- **Home Page**: View community experiences and founder information
- **Registration**: Secure account creation with validation
- **Experience Submission**: Share categorized tennis stories
- **Community Interaction**: Reply to and engage with other users
- **Profile Management**: View personal submissions and account details

## 🎯 Project Goals

This platform aims to help international tennis players by:

- Creating a supportive community environment
- Sharing valuable experiences and insights
- Reducing the isolation felt by international student-athletes
- Building connections between players facing similar challenges

## 🤝 Contributing

This is a student project, but feedback and suggestions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is created for educational purposes as part of a web development course.

---

**Created by Mateo Flores** - Connecting International Tennis Players 🎾
