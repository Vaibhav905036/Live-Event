export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { live_event, backup, start_time } = req.body;

  const newData = {
    pre_event: "https://vaibhav-love-vanshika-and-vishwas.vercel.app/matchkephele.m3u8",
    live_event,
    backup,
    start_time
  };

  const githubToken = process.env.GH_TOKEN; // GitHub token ko environment variable me rakho
  const githubUsername = "Vaibhav905036"; // Apna GitHub username
  const repoName = "Live-Event"; // Repository ka naam
  const filePath = "Stream.json"; // File jise update karna hai

  const apiUrl = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${filePath}`;

  try {
    // GitHub se file ka SHA get karo
    const getRes = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    const getData = await getRes.json();

    if (!getRes.ok || !getData.sha) {
      return res.status(500).json({ error: "Failed to get file SHA" });
    }

    const sha = getData.sha;

    // GitHub par file ko update karo
    const updateRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: "Updated via Rounder TV form",
        content: Buffer.from(JSON.stringify(newData, null, 2)).toString("base64"),
        sha
      })
    });

    if (!updateRes.ok) {
      return res.status(500).json({ error: "GitHub update failed" });
    }

    return res.status(200).json({ message: "JSON updated successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
      }
