import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

type Items = { [key: string]: any };

function processPost(fullPath: string, realSlug: string, fields: string[]): Items {
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const items: Items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (data[field]) {
      items[field] = data[field];
    }
  });

  return items;
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const isMdx = RegExp(/\.mdx$/).test(slug);
  const realSlug = isMdx ? slug.replace(/\.mdx$/, "") : slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, isMdx ? `${realSlug}.mdx` : `${realSlug}.md`);

  try {
    if (fs.existsSync(fullPath)) {
      return processPost(fullPath, realSlug, fields);
    } else if (fs.existsSync(fullPath + "x")) {
      return processPost(fullPath + "x", realSlug, fields);
    }
  } catch (error) {
    console.error(error);
    return {};
  }
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1!.date > post2!.date ? -1 : 1));
  return posts;
}
