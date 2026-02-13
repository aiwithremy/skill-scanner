import { NextRequest, NextResponse } from "next/server";

interface GitHubContentItem {
  name: string;
  path: string;
  type: "file" | "dir";
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const cleaned = url.replace(/^https?:\/\//, "");
    const match = cleaned.match(/^github\.com\/([\w.-]+)\/([\w.-]+)/);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid GitHub URL." },
        { status: 400 }
      );
    }

    const [, owner, repo] = match;

    // Search for SKILL.md files using GitHub search API
    const searchUrl = `https://api.github.com/search/code?q=filename:SKILL.md+repo:${owner}/${repo}`;
    const searchResponse = await fetch(searchUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "SkillScanner/1.0",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!searchResponse.ok) {
      // Fallback: check root and common paths
      const skills = await findSkillsFallback(owner, repo);
      return NextResponse.json({ skills });
    }

    const searchResults = await searchResponse.json();

    if (!searchResults.items || searchResults.items.length === 0) {
      return NextResponse.json({
        skills: [],
        message:
          "No skills found in this repository. We looked for SKILL.md files but couldn't find any.",
      });
    }

    const skills = searchResults.items.map(
      (item: { path: string; name: string }) => {
        const dir = item.path.replace("/SKILL.md", "");
        return {
          path: dir === "SKILL.md" ? "" : dir,
          name: dir === "SKILL.md" ? repo : dir.split("/").pop(),
          full_path: item.path,
        };
      }
    );

    return NextResponse.json({ skills });
  } catch (error) {
    console.error("GitHub detect error:", error);
    return NextResponse.json(
      { error: "Failed to search repository." },
      { status: 500 }
    );
  }
}

async function findSkillsFallback(
  owner: string,
  repo: string
): Promise<Array<{ path: string; name: string }>> {
  const skills: Array<{ path: string; name: string }> = [];

  // Check root for SKILL.md
  const rootCheck = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/SKILL.md`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "SkillScanner/1.0",
      },
    }
  );
  if (rootCheck.ok) {
    skills.push({ path: "", name: repo });
  }

  // Check common skill directories
  const rootContents = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "SkillScanner/1.0",
      },
    }
  );

  if (rootContents.ok) {
    const items: GitHubContentItem[] = await rootContents.json();
    const dirs = items.filter((i) => i.type === "dir");

    for (const dir of dirs.slice(0, 10)) {
      const dirCheck = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${dir.path}/SKILL.md`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "SkillScanner/1.0",
          },
        }
      );
      if (dirCheck.ok) {
        skills.push({ path: dir.path, name: dir.name });
      }
    }
  }

  return skills;
}
