# 04 - Database Schema

# Monster Learning Center Database Schema

Version: 1.0 (V1)

Database: SQLite

---

# Overview

The Monster Learning Center database stores user accounts, learning progress, gameplay data, customization options, and rewards.

The schema is designed to support future expansion to PostgreSQL or another relational database with minimal changes.

---

# Entity Relationship Overview

```
Users
 ├── Settings
 ├── Progress
 ├── Garage
 ├── Inventory
 ├── Achievements
 ├── Story Progress
 ├── Race Progress
 ├── Learning Progress
 └── Rewards
```

---

# Users

Stores all registered users.

| Column    | Type     | Description          |
| --------- | -------- | -------------------- |
| id        | INTEGER  | Primary Key          |
| firstName | TEXT     | Child's first name   |
| lastName  | TEXT     | Child's last name    |
| email     | TEXT     | Unique login email   |
| password  | TEXT     | Hashed password      |
| level     | INTEGER  | Current player level |
| stars     | INTEGER  | Total stars earned   |
| createdAt | DATETIME | Account creation     |
| updatedAt | DATETIME | Last update          |

Relationships

* One User has one Settings record.
* One User has one Progress record.
* One User has one Garage.
* One User has many Achievements.
* One User has many Rewards.

---

# Settings

Stores application preferences.

| Column           | Type     |
| ---------------- | -------- |
| id               | INTEGER  |
| userId           | INTEGER  |
| soundEnabled     | BOOLEAN  |
| musicEnabled     | BOOLEAN  |
| narrationEnabled | BOOLEAN  |
| createdAt        | DATETIME |
| updatedAt        | DATETIME |

Foreign Key

userId → Users.id

---

# Progress

Tracks overall application progress.

| Column               | Type     |
| -------------------- | -------- |
| id                   | INTEGER  |
| userId               | INTEGER  |
| completedLessons     | INTEGER  |
| completedStories     | INTEGER  |
| completedRaces       | INTEGER  |
| completedPuzzles     | INTEGER  |
| completedGarageTasks | INTEGER  |
| totalStars           | INTEGER  |
| totalPlayTime        | INTEGER  |
| createdAt            | DATETIME |
| updatedAt            | DATETIME |

Foreign Key

userId → Users.id

---

# Garage

Stores truck customization.

| Column              | Type     |
| ------------------- | -------- |
| id                  | INTEGER  |
| userId              | INTEGER  |
| truckColor          | TEXT     |
| decal               | TEXT     |
| tiresInstalled      | BOOLEAN  |
| engineInstalled     | BOOLEAN  |
| suspensionInstalled | BOOLEAN  |
| bodyInstalled       | BOOLEAN  |
| createdAt           | DATETIME |
| updatedAt           | DATETIME |

Foreign Key

userId → Users.id

---

# Inventory

Tracks unlocked customization items.

| Column   | Type    |
| -------- | ------- |
| id       | INTEGER |
| userId   | INTEGER |
| itemType | TEXT    |
| itemName | TEXT    |
| unlocked | BOOLEAN |
| equipped | BOOLEAN |

Examples

* Tire Set
* Paint Color
* Decal
* Wheel Style
* Flag

---

# Learning Progress

Tracks educational mastery.

| Column           | Type     |
| ---------------- | -------- |
| id               | INTEGER  |
| userId           | INTEGER  |
| category         | TEXT     |
| completed        | INTEGER  |
| correctAnswers   | INTEGER  |
| incorrectAnswers | INTEGER  |
| masteryLevel     | INTEGER  |
| updatedAt        | DATETIME |

Example Categories

* Letters
* Numbers
* Colors
* Shapes
* Reading
* Memory
* Patterns

---

# Story Progress

Tracks books and stories.

| Column      | Type    |
| ----------- | ------- |
| id          | INTEGER |
| userId      | INTEGER |
| storyId     | TEXT    |
| completed   | BOOLEAN |
| pagesRead   | INTEGER |
| starsEarned | INTEGER |

---

# Race Progress

Tracks race completion.

| Column            | Type    |
| ----------------- | ------- |
| id                | INTEGER |
| userId            | INTEGER |
| raceId            | TEXT    |
| completed         | BOOLEAN |
| bestTime          | REAL    |
| starsEarned       | INTEGER |
| highestDifficulty | INTEGER |

---

# Achievements

Stores earned achievements.

| Column          | Type     |
| --------------- | -------- |
| id              | INTEGER  |
| userId          | INTEGER  |
| achievementName | TEXT     |
| description     | TEXT     |
| unlockedAt      | DATETIME |

Example Achievements

* First Victory
* Tire Expert
* Story Master
* Reading Champion
* Speed Racer

---

# Rewards

Stores earned rewards.

| Column     | Type     |
| ---------- | -------- |
| id         | INTEGER  |
| userId     | INTEGER  |
| rewardType | TEXT     |
| rewardName | TEXT     |
| claimed    | BOOLEAN  |
| createdAt  | DATETIME |

Example Rewards

* Paint
* Truck Body
* Decal
* Trophy
* Avatar Outfit

---

# Future Tables

These tables are planned but not part of Version 1.

## Parent Dashboard

* Child Reports
* Weekly Progress
* Screen Time
* Learning Analytics

---

## AI Learning Engine

* Generated Questions
* Difficulty History
* Learning Recommendations

---

## Voice System

* Voice Preferences
* Narration Cache
* Audio History

---

## Multiplayer

* Friends
* Shared Profiles
* Leaderboards

---

# Database Design Principles

* One user owns all learning data.
* Foreign keys maintain data integrity.
* Authentication data remains separate from gameplay data.
* Educational progress is independent from game progress.
* Schema is designed for future migration to PostgreSQL.
* Every major feature owns its own table to keep the database modular and easy to extend.
