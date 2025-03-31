const fs = require("fs");
const path = require("path");

/**
 * <img> タグを Markdown 記法に変換
 */
function convertImgTagsToMarkdown(content) {
  return content.replace(
    /<img\s+([^>]*?)\/?>/gi,
    (_, attrs) => {
      const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
      const altMatch = attrs.match(/alt=["']([^"']*)["']/i);

      const src = srcMatch ? srcMatch[1] : '';
      const alt = altMatch ? altMatch[1] : '';

      return `![${alt}](${src})`;
    }
  );
}

/**
 * 指定ディレクトリ内のMarkdownファイルを再帰的に走査して変換
 */
function processMarkdownFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      processMarkdownFiles(fullPath); // 再帰
    } else if (entry.isFile() && fullPath.endsWith(".md")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      const updated = convertImgTagsToMarkdown(content);

      if (content !== updated) {
        fs.writeFileSync(fullPath, updated, "utf-8");
        console.log(`✅ 変換完了: ${fullPath}`);
      }
    }
  }
}

// 実行部分
const targetDir = process.argv[2];
if (!targetDir) {
  console.error("使い方: node replace-img-tags.js <ディレクトリパス>");
  process.exit(1);
}

processMarkdownFiles(path.resolve(targetDir));
