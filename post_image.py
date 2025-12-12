import os
import requests
import tweepy

def main():
    # Load API keys
    api_key = os.getenv("X_API_KEY")
    api_secret = os.getenv("X_API_SECRET")
    access_token = os.getenv("X_ACCESS_TOKEN")
    access_secret = os.getenv("X_ACCESS_SECRET")
    bearer = os.getenv("X_BEARER_TOKEN")  # needed for v2 tweet

    # Auth for v1.1 (media upload)
    auth_v1 = tweepy.OAuth1UserHandler(api_key, api_secret, access_token, access_secret)
    api_v1 = tweepy.API(auth_v1)

    # Rotating image logic
    images = sorted(os.listdir("images"))
    total = len(images)

    with open("state.txt", "r") as f:
        index = int(f.read().strip())

    next_index = (index + 1) % total
    filename = images[next_index]
    path = f"images/{filename}"

    print(f"Uploading image: {filename}")

    # Upload media via v1.1 (allowed)
    media = api_v1.media_upload(path)
    media_id = media.media_id

    print(f"Media uploaded, ID = {media_id}")

    # Post tweet via v2
    tweet_endpoint = "https://api.x.com/2/tweets"
    headers = {
        "Authorization": f"Bearer {bearer}",
        "Content-Type": "application/json"
    }
    json_data = {
        "text": "",
        "media": {
            "media_ids": [str(media_id)]
        }
    }

    print("Posting tweet with media...")

    response = requests.post(tweet_endpoint, headers=headers, json=json_data)
    print(response.text)

    if response.status_code != 201:
        raise Exception(f"Tweet failed: {response.text}")

    # Save new index
    with open("state.txt", "w") as f:
        f.write(str(next_index))

    print(f"Updated index → {next_index}")

if __name__ == "__main__":
    main()
