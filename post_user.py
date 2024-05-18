import requests

# Define the URL
url = 'http://127.0.0.1:3002/users'

def send_user_data(username):
    """
    Send a POST request with only the username.
    """
    payload = {
        "username": username
    }
    response = requests.post(url, json=payload)
    print_response(response)

def send_detailed_user_data(username, email, username_hash, high_score):
    """
    Send a POST request with username, email, username_hash, and high_score.
    """
    payload = {
        "username": username,
        "email": email,
        "username_hash": username_hash,
        "high_score": high_score
    }
    response = requests.post(url, json=payload)
    print_response(response)

def print_response(response):
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.json()}")

if __name__ == '__main__':

    send_user_data('testUser1')
    
    # send_detailed_user_data('testUser2', 'test22@example.com', '0xSomeHashValue', 12345)
