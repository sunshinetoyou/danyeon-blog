import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
    // 👇 "index(홈)" 페이지에서만 히트맵 보여주기
    // 👇 1. 전체 활동 (Total)
    Component.ConditionalRender({
      component: Component.ActivityHeatmap({ title: "BLOG" }),
      condition: (page) => page.fileData.slug === "index",
    }),

    // 👇 2. 보안 활동 (Security)
    Component.ConditionalRender({
      component: Component.ActivityHeatmap({ 
        title: "SECURITY", 
        targetTag: "Security" // #AutoEver 태그가 있는 글만 추적
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    // 👇 3. 개발 활동 (DEV)
    Component.ConditionalRender({
      component: Component.ActivityHeatmap({ 
        title: "DEVELOP", 
        targetTag: "Dev" 
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    // 👇 4. PS 활동 (PS)
    Component.ConditionalRender({
      component: Component.ActivityHeatmap({ 
        title: "PS", 
        targetTag: "PS" 
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      title: "카테고리",
      folderClickBehavior: "link",
      folderDefaultState: "collapsed",
      filterFn: (node) => node.displayName !== "assets",
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.RecentNotes({
      title: "최근 작성한 글",
      limit: 3,
    }),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "카테고리",
      folderClickBehavior: "link",
      folderDefaultState: "collapsed",
      filterFn: (node) => node.displayName !== "assets",
    }),
  ],
  right: [],
}
