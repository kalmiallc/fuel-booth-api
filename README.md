# Fuel API

Simple API for exposition game. API has no authentication and is used to store emails and create fuel transactions.

To run local:
1. Make the ```.env``` file  
2. ```nvm use 18```  
3. ```npm run dev```  
  
ENDPOINTS:
1. **register new user**:  
    *POST* -> body: (username, email)  
    ```/users```
1. new finish Score:  
    *POST* -> body: (username, time_seconds, damage)  
    ```/final-score-user```
1. new live track Score (called on Boost):  
    *GET* -> url params:  username & time_seconds, damage, distance, speed  
    ```/track-score-user/:username?time_seconds=120&damage=15&distance=300&speed=300```
2. list DB users:  
    *GET* -> ```/users```
2. get DB user:  
    *GET* -> ```/users/:userId```
2. **list BC players**:  
    *GET* -> ```/players```