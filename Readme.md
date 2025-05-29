![MIT License](https://img.shields.io/badge/license-MIT-green)

## Modular Event Registration Backend System

This project is a modular and extensible backend system designed to manage event registration workflows with clear domain boundaries. It utilizes raw PostgreSQL for database operations, custom migration and seed runners, and is structured with clean architecture principles for maintainability, scalability, and extensibility.

## Architecture Overview

The system is composed of dedicated modules following domain-driven design:

* **User Module** – Manages user data, security questions, and user-level permissions.
* **Auth Module** – Handles secure registration, login, password reset, and role-based JWT-based authentication.
* **Event Module** – Allows admins to create, update, and manage events.
* **Registration Module** – Handles user registration to events, enforcing validation rules and attendance tracking.
* **Waitlist Module** – Automatically manages waitlisting for full events and promotes users as slots become available.
* **Admin Module** – Grants elevated access to manage users, events, and registrations.

## Database Strategy with PostgreSQL

#### Raw SQL + Programmatic Control

Instead of using an ORM, this project leverages raw PostgreSQL queries via the `pg` client for full control and visibility over schema evolution and data manipulation. This supports:

* Performance optimizations
* Precise schema control
* Custom rollback logic for critical operations

#### Custom Migration System

A handcrafted migration system supports:

* `up/` and `down/` folders: for forward and rollback SQL scripts
* Local log tracking in `migration.history.json`
* PostgreSQL-backed migrations table for persistent history
* Graceful rollback if any migration step fails

```bash
npm run migrate     # Run all pending migrations
npm run rollback    # Revert the last migration applied
```

### Seed System

Also included is a robust seeding setup:

* `sql/` and `undo/` folders inside a `seeders/` directory
* Supports manual or automated population of test/dev data
* Can seed and rollback individual table data

```bash
npm run seed        # Runs all seed scripts
npm run seed:undo   # Reverts the most recent seeding action
```

## Features by Module

#### User Module

* Stores user profiles and metadata
* Handles security question setup for recovery flows
* Tracks `created_at` and `updated_at` timestamps

#### Auth Module

* JWT-based authentication via secure cookies
* Handles:

  * Registration
  * Login
  * Password reset via security questions
  * Password update
* Role-based access control (e.g., student, admin)

#### Event Module

* Admins can:

  * Create and manage event details
  * Set capacity and schedule
* Events track total registered users and availability

#### Registration Module

* Enforces one-user-per-event rules
* Tracks registration time
* Validates event capacity before assigning spots

#### Waitlist Module

* Automatically places users on a waitlist for full events
* Promotes users in order when slots open
* Admin tools for manual waitlist manipulation

#### Admin Module

* Elevated actions like:

  * Creating new admin accounts
  * Viewing all registrations
  * Managing users and event capacities
* Role-based route protection enforced across modules

## Engineering Principles & Efficiencies

* **Domain Modularity**: Each module has clearly scoped responsibility and uses dependency injection.
* **Raw SQL**: Offers granular performance tuning and database transparency.
* **Custom CLI Tools**:

  * Migration Runner: Tracks versioned schema changes
  * Seed Runner: Easily populate tables for dev/test
  * Rollback Support: Ensures production-safe scripts
* **Strict Separation**: `migrations/` and `seeders/` folders enforce discipline in data/schema changes

## Getting Started

#### Requirements

* Node.js (v18+ recommended)
* PostgreSQL (v14+)

#### Environment Variables

Create a `.env` file and configure the following:

```env
DATABASE_URL=postgres://user:pass@localhost:5432/dev_db
DATABASE_URL_TEST=postgres://user:pass@localhost:5432/test_db
DATABASE_URL_PROD=postgres://user:pass@localhost:5432/prod_db
JWT_SECRET=super_secure_key
NODE_ENV=development
```

#### Install & Run

```bash
npm install

# Run migrations and seeders
npm run migrate
npm run seed

# Start the backend server
npm run start:dev
```

## Project Structure

```plaintext
src/
├── modules/
│   ├── users/
│   ├── auth/
│   ├── events/
│   ├── registration/
│   ├── waitlist/
│   └── admin/
├── migrations/
│   ├── up/
│   ├── down/
│   └── migration-runner.ts
├── seeders/
│   ├── sql/
│   ├── undo/
│   └── seed-runner.ts
```

## Sample Flow

```bash
# Migration
npm run migrate
# Output: 🔄 Running migration: create-users-table.sql
#         ✅ Applied migration

# Seeder
npm run seed
# Output: ✅ Seeded users table with 5 default users
```

## Future Improvements

* Add Swagger docs for all endpoints
* Add testing with Jest and PostgreSQL containers
* Support for modular CLI commands for migrations/seeding
* Redis caching for frequently accessed user/event data


## Acknowledgements

Built to demonstrate clear understanding of domain-based modular design, raw SQL-based database operations, and robust migration/seeding strategies using handcrafted CLI tools.


## License

This project is licensed under the MIT License
