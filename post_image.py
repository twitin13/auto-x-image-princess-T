import os
import tweepy

def main():
    # Load secrets
    api_key = os.getenv("X_API_KEY")
    api_secret = os.getenv("X_API_SECRET")
    access_token = os.getenv("X_ACCESS_TOKEN")
    access_secret = os.getenv("X_ACCESS_SECRET")

    # OAuth1.0a for media upload (v1.1)
    auth_v1 = tweepy.OAuth1UserHandler(api_key, api_secret, access_token, access_secret)
    api_v1 = tweepy.API(auth_v1)

    # OAuth1.0a Twitter API v2 Client
    client = tweepy.Client(
        consumer_key=api_key,
        consumer_secret=api_secret,
        access_token=access_token,
        access_token_secret=access_secret
    )

    # Load images
    images = sorted(os.listdir("images"))
    total = len(images)

    # Load index
    with open("state.txt", "r") as f:
        index = int(f.read().strip())

    next_index = (index + 1) % total
    filename = images[next_index]
    path = f"images/{filename}"

    print(f"Uploading: {filename}")

    # Upload media via v1.1
    media = api_v1.media_upload(path)
    media_id = media.media_id

    print(f"Uploaded media_id = {media_id}")

    # POST TWEET via API v2 with OAuth1.0a
    response = client.create_tweet(
        text="", 
        media_ids=[media_id]
    )

    print("Tweet response:", response)

    # Save new index
    with open("state.txt", "w") as f:
        f.write(str(next_index))

    print(f"Updated index: {next_index}")

if __name__ == "__main__":
    main()
