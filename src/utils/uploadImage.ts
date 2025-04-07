export async function uploadImageToDiscord(
  imageBuffer: Buffer,
  filename: string
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([imageBuffer], { type: "image/*" }),
      filename
    );

    const response = await fetch(
      `https://discord.com/api/v10/channels/${process.env.DISCORD_CHANNEL_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Discord");
    }

    const data = await response.json();
    const imageUrl = data.attachments[0]?.url;

    if (!imageUrl) {
      throw new Error("Failed to get image URL");
    }

    return imageUrl;
  } catch (error) {
    console.error("Error uploading image to Discord:", error);
    throw error;
  }
}
