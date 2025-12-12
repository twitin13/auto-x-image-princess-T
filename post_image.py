import os
import tweepy

def main():
    # API keys from GitHub Secrets
    api_key = os.getenv("X_API_KEY")
    api_secret = os.getenv("X_API_SECRET")
    access_token = os.getenv("X_ACCESS_TOKEN")
    access_secret = os.getenv("X_ACCESS_SECRET")

    # Auth
    auth = tweepy.OAuth1UserHandler(api_key, api_secret, access_token, access_secret)
    api = tweepy.API(auth)

    # Load list of images
    images = sorted(os.listdir("images"))
    total = len(images)

    # Load state index
    with open("state.txt", "r") as f:
        index = int(f.read().strip())

    # Next image index
    next_index = (index + 1) % total
    filename = images[next_index]
    path = f"images/{filename}"

    print(f"Posting image: {filename}")

    # Upload and post
    media = api.media_upload(path)
    api.update_status(status="", media_ids=[media.media_id])

    # Save updated index
    with open("state.txt", "w") as f:
        f.write(str(next_index))

    print(f"Updated index -> {next_index}")

if __name__ == "__main__":
    main()
