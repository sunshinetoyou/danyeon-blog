import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Danyeon Blog",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "ko-KR",
    baseUrl: "sunshinetoyou.github.io/danyeon-blog",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#FBFBF5",      // 배경: 아이보리
          lightgray: "#EAEAE0",  // 테두리
          gray: "#9A9A8E",       // 보조 글씨
          darkgray: "#4E4E48",   // 본문
          dark: "#2B2B28",       // 제목
          secondary: "#5E7C88",  // 강조색 (블루그레이)
          tertiary: "#84A59D",   // 마우스 호버
          highlight: "rgba(94, 124, 136, 0.15)", // 링크 배경
          textHighlight: "#fff23688", // ★ 추가됨: 형광펜 (부드러운 노랑)
        },
        darkMode: {
          light: "#050505",      // 배경: 리얼 블랙
          lightgray: "#1F1F1F",  // 테두리
          gray: "#666666",       // 보조 글씨
          darkgray: "#D4D4D4",   // 본문
          dark: "#00FF41",       // 제목 (네온 그린)
          secondary: "#00FF41",  // 강조색 (네온 그린)
          tertiary: "#008F11",   // 마우스 호버
          highlight: "rgba(0, 255, 65, 0.15)", // 링크 배경
          textHighlight: "#00ff4188", // ★ 추가됨: 형광펜 (투명한 네온 그린)
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
