// api/update-json.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Server side par GitHub token securely store karna
    const githubToken = process.env.GITHUB_TOKEN; // Vercel environment variable se token fetch karo
    const githubUsername = "Vaibhav905036";
    const repoName = "Live-Event";
    const filePath = "Stream.json";

    const { live_event, backup, start_time } = req.body;

    const newData = {
      pre_event: "https://vaibhav-love-vanshika-and-vishwas.vercel.app/matchkephele.m3u8",
      live_event,
      backup,
      start_time
    };

    const apiUrl = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${filePath}`;

    try {
      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json"
        }
      });

      const result = await res.json();
      const sha = result.sha;

      const updateRes = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json"
        },
        body: JSON.stringify({
          message: "Updated via Rounder TV form",
          content: btoa(unescape(encodeURIComponent(JSON.stringify(newData, null, 2)))),
          sha: sha
        })
      });

      if (updateRes.ok) {
        return res.status(200).json({ message: "Successfully updated the JSON!" });
      } else {
        return res.status(400).json({ error: "Error updating the JSON." });
      }

    } catch (error) {
      return res.status(500).json({ error: "Failed to connect to GitHub." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
