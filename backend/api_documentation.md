# AutiCare API Documentation

## Overview: Session and Progress System

AutiCare implements a two-level session system:

1. **App Sessions**: Track daily app usage (one per child per day)
2. **Game Sessions**: Track individual gameplay interactions

App sessions automatically reset at midnight Pakistan time (Asia/Karachi timezone). When any API endpoint is called:
- If a child has no active session, a new one is created
- If a child has an active session from a previous day, it is automatically ended and a new one is created

This documentation covers the API endpoints, parameters, and sample responses for managing sessions and tracking progress.

---

## 1. App Session Management

### 1.1 Start App Session
```bash
curl -X POST http://localhost:8000/api/children/1/app-usage/start/ -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Required Values:**
- `child_id` (in URL): ID of the child
- JWT token for authentication

**Sample Response:**
```json
{
  "session_id": 42,
  "active": true,
  "session_date": "2023-05-15",
  "child_id": 1,
  "duration": 0,
  "limit_crossed": false,
  "game_sessions": []
}
```

### 1.2 Check Active App Session
```bash
curl -X GET http://localhost:8000/api/children/1/app-usage/check/ -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Required Values:**
- `child_id` (in URL): ID of the child
- JWT token for authentication

**Sample Response:**
```json
{
  "active_session": true,
  "session_id": 42,
  "session_date": "2023-05-15",
  "duration": 15,
  "limit_crossed": false
}
```

### 1.3 Update App Session Duration
```bash
curl -X PUT http://localhost:8000/api/app-usage/42/update-duration/ -H "Authorization: Bearer YOUR_JWT_TOKEN" -H "Content-Type: application/json" -d '{"duration": 20}'
```
**Required Values:**
- `session_id` (in URL): ID of the app session to update
- `duration`: Time spent in minutes for this session so far

**Sample Response:**
```json
{
  "id": 42,
  "child": 1,
  "child_name": "Alex",
  "duration": 20,
  "limit_crossed": false,
  "session_date": "2023-05-15",
  "active": true,
  "game_sessions": [71, 73],
  "daily_progress": {
    "MATCHSORT": {
      "current_difficulty": 2,
      "correct_answers": 30,
      "incorrect_answers": 10,
      "total_games_played": 5,
      "score_percentage": 75.0
    }
  },
  "game_usage": {
    "MATCHSORT": {
      "correct_answers": 15,
      "incorrect_answers": 5,
      "total_plays": 2
    }
  }
}
```

### 1.4 End App Session
```bash
curl -X PUT http://localhost:8000/api/app-usage/42/end/ -H "Authorization: Bearer YOUR_JWT_TOKEN" -H "Content-Type: application/json" -d '{"duration": 25, "limit_crossed": false}'
```
**Required Values:**
- `session_id` (in URL): ID of the app session to end
- `duration`: Total time spent in minutes for this session

**Optional Values:**
- `limit_crossed`: Boolean indicating if daily usage limit was crossed (default: false)

**Sample Response:**
```json
{
  "id": 42,
  "child": 1,
  "duration": 25,
  "limit_crossed": false,
  "session_date": "2023-05-15",
  "active": false,
  "game_sessions": [71, 73, 75],
  "daily_progress": {
    "MATCHSORT": {
      "current_difficulty": 2,
      "correct_answers": 42,
      "incorrect_answers": 12,
      "total_games_played": 6,
      "score_percentage": 77.8
    },
    "FACIAL": {
      "current_difficulty": 1,
      "correct_answers": 28,
      "incorrect_answers": 7,
      "total_games_played": 4,
      "score_percentage": 80.0
    }
  },
  "game_usage": {
    "MATCHSORT": {
      "correct_answers": 20,
      "incorrect_answers": 8,
      "total_plays": 3
    },
    "FACIAL": {
      "correct_answers": 15,
      "incorrect_answers": 5,
      "total_plays": 2
    }
  }
}
```

### 1.5 Get App Session History
```bash
curl -X GET http://localhost:8000/api/children/1/app-usage/ -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Required Values:**
- `child_id` (in URL): ID of the child
- JWT token for authentication

**Optional Parameters:**
- `?limit=7`: Limit to last 7 sessions (default is 10)
- `?active_only=true`: Show only active sessions

**Sample Response:**
```json
{
  "count": 5,
  "results": [
    {
      "id": 42,
      "child": 1,
      "duration": 25,
      "limit_crossed": false,
      "session_date": "2023-05-15",
      "active": false,
      "game_sessions": [71, 73, 75],
      "game_usage": {
        "MATCHSORT": {
          "correct_answers": 20,
          "incorrect_answers": 8,
          "total_plays": 3
        },
        "FACIAL": {
          "correct_answers": 15,
          "incorrect_answers": 5,
          "total_plays": 2
        }
      }
    },
    {
      "id": 41,
      "child": 1,
      "duration": 35,
      "limit_crossed": false,
      "session_date": "2023-05-14",
      "active": false,
      "game_sessions": [68, 69, 70],
      "game_usage": {
        "MATCHSORT": {
          "correct_answers": 18,
          "incorrect_answers": 6,
          "total_plays": 2
        },
        "SOCIAL": {
          "correct_answers": 7,
          "incorrect_answers": 3,
          "total_plays": 1
        }
      }
    }
  ]
}
```

---

## 2. Game Session Management

### 2.1 Start Game Session (Explicit)
```bash
curl -X POST http://localhost:8000/api/children/1/start-session/MATCHSORT/ -H "Authorization: Bearer YOUR_JWT_TOKEN" -H "Content-Type: application/json"
```
**Required Values:**
- `child_id` (in URL): ID of the child
- `game_code` (in URL): Game type code (MATCHSORT, FACIAL, SOCIAL)
- JWT token for authentication

**Sample Response:**
```json
{
  "session_id": 75,
  "difficulty_level": 2,
  "game_type": "Match and Sort",
  "game_code": "MATCHSORT"
}
```

### 2.2 Play Game (Automatic Session Creation)
```bash
curl -X GET http://localhost:8000/api/children/1/match-and-sort/ -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Required Values:**
- `child_id` (in URL): ID of the child
- JWT token for authentication

**Optional URL Parameters:**
- `/difficulty/1`: Specify difficulty level (1, 2, or 3)
- `/session/123`: Use existing game session

**Sample Response:**
```json
{
  "age_group": "6-8",
  "difficulty": 2,
  "buckets": [
    {
      "id": "bucket_1",
      "shape_type": "triangle",
      "image_url": "http://localhost:8000/api/game-assets/matchandsort/buckets/general_buckets/triangle.svg"
    },
    {
      "id": "bucket_2",
      "shape_type": "pentagon",
      "image_url": "http://localhost:8000/api/game-assets/matchandsort/buckets/general_buckets/pentagon.svg"
    },
    {
      "id": "bucket_3",
      "shape_type": "semicircle",
      "image_url": "http://localhost:8000/api/game-assets/matchandsort/buckets/general_buckets/semicircle.svg"
    }
  ],
  "falling_objects": [
    {
      "id": "object_1",
      "color": "blue",
      "shape_type": "triangle",
      "target_bucket_id": "bucket_1",
      "image_url": "http://localhost:8000/api/game-assets/matchandsort/shapes/triangle/blue.svg"
    }
  ],
  "session_id": 75,
  "session_created": true
}
```

### 2.3 End Game Session
```bash
curl -X PUT http://localhost:8000/api/sessions/75/end/ -H "Authorization: Bearer YOUR_JWT_TOKEN" -H "Content-Type: application/json" -d '{"correct_answers": 8, "incorrect_answers": 2, "session_data": {"time_spent": 120}}'
```
**Required Values:**
- `session_id` (in URL): ID of the game session to end
- `correct_answers`: Number of correct answers during gameplay
- `incorrect_answers`: Number of incorrect answers during gameplay

**Optional Values:**
- `session_data`: JSON object with additional game-specific information (time spent, levels completed, etc.)

**Sample Response:**
```json
{
  "session": {
    "id": 75,
    "child": 1,
    "game_type": 2,
    "game_type_name": "Match and Sort",
    "difficulty_level": 2,
    "correct_answers": 8,
    "incorrect_answers": 2,
    "total_questions": 10,
    "score_percentage": 80.0,
    "completed": true,
    "session_data": {"time_spent": 120}
  },
  "progress": {
    "id": 5,
    "child": 1,
    "game_type": 2,
    "game_type_name": "Match and Sort",
    "current_difficulty": 2,
    "correct_answers": 42,
    "incorrect_answers": 12,
    "total_games_played": 6,
    "score_percentage": 77.8
  },
  "difficulty_changed": false,
  "difficulty_increased": false,
  "difficulty_decreased": false,
  "app_session": {
    "id": 42,
    "game_sessions": [71, 73, 75],
    "game_usage": {
      "MATCHSORT": {
        "correct_answers": 20,
        "incorrect_answers": 8,
        "total_plays": 3
      }
    },
    "daily_progress": {
      "MATCHSORT": {
        "current_difficulty": 2,
        "correct_answers": 42,
        "incorrect_answers": 12,
        "total_games_played": 6,
        "score_percentage": 77.8
      }
    }
  }
}
```

### 2.4 Get Child's Game Sessions
```bash
curl -X GET http://localhost:8000/api/children/1/sessions/ -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Required Values:**
- `child_id` (in URL): ID of the child
- JWT token for authentication

**Optional Parameters:**
- `?game_code=MATCHSORT`: Filter by game type
- `?limit=5`: Limit number of results (default is 10)

**Sample Response:**
```json
{
  "count": 3,
  "results": [
    {
      "id": 75,
      "child": 1,
      "game_type": 2,
      "game_type_name": "Match and Sort",
      "difficulty_level": 2,
      "correct_answers": 8,
      "incorrect_answers": 2,
      "total_questions": 10,
      "score_percentage": 80.0,
      "completed": true,
      "session_data": {"time_spent": 120}
    },
    {
      "id": 73,
      "child": 1,
      "game_type": 2,
      "game_type_name": "Match and Sort",
      "difficulty_level": 2,
      "correct_answers": 7,
      "incorrect_answers": 3,
      "total_questions": 10,
      "score_percentage": 70.0,
      "completed": true,
      "session_data": {"time_spent": 110}
    },
    {
      "id": 71,
      "child": 1,
      "game_type": 2,
      "game_type_name": "Match and Sort",
      "difficulty_level": 2,
      "correct_answers": 5,
      "incorrect_answers": 3,
      "total_questions": 8,
      "score_percentage": 62.5,
      "completed": true,
      "session_data": {"time_spent": 95}
    }
  ]
}
```

---

## 3. Progress Tracking

### 3.1 Get Child's Progress (All Games)
```bash
curl -X GET http://localhost:8000/api/children/1/progress/ -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Required Values:**
- `child_id` (in URL): ID of the child
- JWT token for authentication

**Sample Response:**
```json
{
  "MATCHSORT": {
    "id": 5,
    "child": 1,
    "game_type": 2,
    "game_type_name": "Match and Sort",
    "current_difficulty": 2,
    "correct_answers": 42,
    "incorrect_answers": 12,
    "total_games_played": 6,
    "score_percentage": 77.8
  },
  "FACIAL": {
    "id": 3,
    "child": 1,
    "game_type": 1,
    "game_type_name": "Facial Expressions",
    "current_difficulty": 1,
    "correct_answers": 28,
    "incorrect_answers": 7,
    "total_games_played": 4,
    "score_percentage": 80.0
  },
  "SOCIAL": {
    "id": 8,
    "child": 1,
    "game_type": 3,
    "game_type_name": "Social Scenarios",
    "current_difficulty": 1,
    "correct_answers": 14,
    "incorrect_answers": 6,
    "total_games_played": 2,
    "score_percentage": 70.0
  }
}
```

### 3.2 Get Progress for a Specific Game
```bash
curl -X GET http://localhost:8000/api/children/1/progress/MATCHSORT/ -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Required Values:**
- `child_id` (in URL): ID of the child
- `game_code` (in URL): Code of the game (MATCHSORT, FACIAL, SOCIAL)
- JWT token for authentication

**Sample Response:**
```json
{
  "id": 5,
  "child": 1,
  "game_type": 2,
  "game_type_name": "Match and Sort",
  "current_difficulty": 2,
  "correct_answers": 42,
  "incorrect_answers": 12,
  "total_games_played": 6,
  "score_percentage": 77.8,
  "game_sessions": [
    {
      "id": 75,
      "difficulty_level": 2,
      "correct_answers": 8,
      "incorrect_answers": 2,
      "score_percentage": 80.0,
      "completed": true
    },
    {
      "id": 73,
      "difficulty_level": 2,
      "correct_answers": 7,
      "incorrect_answers": 3,
      "score_percentage": 70.0,
      "completed": true
    },
    {
      "id": 71,
      "difficulty_level": 2,
      "correct_answers": 5,
      "incorrect_answers": 3,
      "score_percentage": 62.5,
      "completed": true
    }
  ]
}
```

---

## 4. Frontend Integration Flow

### 4.1 Basic Usage Flow

1. **When app starts**: 
   - Call the app session start endpoint
   - Store the returned session ID

2. **When user selects a game**:
   - Call the game endpoint directly (Match and Sort, Facial Expressions, etc.)
   - The backend automatically creates a game session
   - Frontend receives game content and session ID

3. **When game finishes**:
   - Call the end game session endpoint with performance results
   - Backend calculates progress and adjusts difficulty
   - Frontend can show progress/achievements

4. **When user exits app**:
   - Call the end app session endpoint
   - Pass total usage duration

### 4.2 Reporting Flow

1. **For daily activity dashboard**:
   - Call the app session history endpoint with a limit of recent days
   - Display daily usage times, game distribution, and limit crossing patterns
   - Show which days had the most engagement

2. **For game-specific progress reports**:
   - Call the specific game progress endpoint
   - Display score percentage trends, difficulty progression
   - Show improvement over time with charts

3. **For overall progress overview**:
   - Call the all-progress endpoint
   - Compare performance across different game types
   - Highlight areas of strength and areas for improvement

4. **For detailed session analysis**:
   - Call the game sessions endpoint filtered by game type
   - Show individual session performance
   - Track time spent per session and improvement patterns

---

## 5. Implementation Notes

1. App sessions represent a child's usage for a single day. Only one active app session can exist per child per day.

2. Game sessions track individual gameplay instances and are automatically linked to the active app session.

3. Progress records track a child's overall performance in each game type and control the adaptive difficulty.

4. Difficulty levels increase when:
   - Child maintains at least 75% correct answers
   - Child reaches progression threshold (default: 10 correct answers)

5. Difficulty levels decrease when:
   - Child performs below 40% correct answers
   - Poor performance occurs for 2 consecutive sessions 