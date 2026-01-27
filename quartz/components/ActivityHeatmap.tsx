import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  title?: string
  targetTag?: string 
}

type DailyActivity = {
  title: string
  slug: string
}

export default ((opts?: Options) => {
  const ActivityHeatmap: QuartzComponent = ({ allFiles, displayClass }: QuartzComponentProps) => {
    const title = opts?.title ?? "Activity"
    
    const today = new Date()
    const currentDay = today.getDay() 
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + (6 - currentDay))
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - (52 * 7) + 1) 

    const dataset: Record<string, DailyActivity[]> = {}
    allFiles.forEach((file) => {
      if (opts?.targetTag && !file.frontmatter?.tags?.includes(opts.targetTag)) return
      
      const fileDate = file.dates?.created
      if (fileDate && file.frontmatter?.title && file.slug) {
        const offset = fileDate.getTimezoneOffset() * 60000
        const localDate = new Date(fileDate.getTime() - offset)
        const dateStr = localDate.toISOString().split('T')[0]
        
        if (!dataset[dateStr]) dataset[dateStr] = []
        dataset[dateStr].push({ title: file.frontmatter.title, slug: file.slug })
      }
    })

    const squares = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const offset = currentDate.getTimezoneOffset() * 60000
      const localCurrent = new Date(currentDate.getTime() - offset)
      const dateStr = localCurrent.toISOString().split('T')[0]
      
      const dailyActivities = dataset[dateStr] || []
      const count = dailyActivities.length
      const isFuture = currentDate > today

      let level = 0
      if (!isFuture && count > 0) level = 1
      if (!isFuture && count > 1) level = 2
      if (!isFuture && count > 3) level = 3
      if (!isFuture && count > 5) level = 4

      const tooltipContent = count > 0 ? (
        <ul class="tooltip-list">
          {dailyActivities.map((activity) => (
            <li><a href={`/${activity.slug}`} class="internal">{activity.title}</a></li>
          ))}
        </ul>
      ) : (
        <span class="no-activity">활동 없음</span>
      )

      squares.push(
        <div class={`heatmap-square level-${level} ${isFuture ? "future" : ""}`}>
          <div class="tooltip-container">
            <div class="tooltip-header">{dateStr} ({count}건)</div>
            <div class="tooltip-body">{tooltipContent}</div>
          </div>
        </div>
      )
      
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return (
      <div class={`activity-heatmap-container ${displayClass ?? ""}`}>
        <div class="heatmap-title"><span>{title}</span></div>
        <div class="heatmap-scroll-area">
          <div class="heatmap-grid">{squares}</div>
        </div>
        
        {/* ★ 자동 스크롤 스크립트: 로드 시 스크롤을 맨 오른쪽으로 이동 */}
        <script dangerouslySetInnerHTML={{__html: `
          function scrollHeatmapToRight() {
            const areas = document.querySelectorAll('.heatmap-scroll-area');
            areas.forEach(area => {
              area.scrollLeft = area.scrollWidth;
            });
          }
          // 초기 로드 시 실행
          window.addEventListener('load', scrollHeatmapToRight);
          // Quartz(Swup) 페이지 이동 시 실행
          document.addEventListener('nav', scrollHeatmapToRight);
          // 스크립트가 파싱되는 즉시 실행 (깜빡임 최소화)
          scrollHeatmapToRight();
        `}}></script>
      </div>
    )
  }

  ActivityHeatmap.css = `
  .activity-heatmap-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 1rem;
    padding: 10px;
    background-color: var(--lightgray);
    border-radius: 8px;
    gap: 15px;
    width: 100%;
    max-width: 100%; 
    box-sizing: border-box;
    position: relative;
    z-index: 1;
  }

  .heatmap-title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    min-width: 30px;
    border-right: 2px solid var(--gray);
    padding-right: 10px;
  }

  .heatmap-title span {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-weight: bold;
    font-size: 0.9rem;
    color: var(--dark);
    white-space: nowrap;
    letter-spacing: 2px;
  }

  .heatmap-scroll-area {
    flex-grow: 1;
    overflow-x: auto;
    min-width: 0; 
    width: 100%;
    padding-bottom: 5px;

    /* ★ 스크롤바 숨기기 (기능은 유지) */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
  }
  
  /* ★ Chrome, Safari 스크롤바 숨기기 */
  .heatmap-scroll-area::-webkit-scrollbar {
    display: none;
  }

  .heatmap-grid {
    display: grid;
    grid-template-rows: repeat(7, 10px); 
    grid-auto-flow: column; 
    gap: 3px; 
    width: max-content; 
  }

  .heatmap-square {
    width: 10px;
    height: 10px;
    background-color: rgba(200, 200, 200, 0.2); 
    border-radius: 2px;
    position: relative;
    cursor: pointer;
  }
  
  .heatmap-square.future { opacity: 0.1; pointer-events: none; }
  [saved-theme="dark"] .heatmap-square { background-color: rgba(255, 255, 255, 0.05); }
  [saved-theme="dark"] .activity-heatmap-container { background-color: var(--lightgray); }

  .heatmap-square.level-1 { background-color: var(--secondary); opacity: 0.4; }
  .heatmap-square.level-2 { background-color: var(--secondary); opacity: 0.6; }
  .heatmap-square.level-3 { background-color: var(--secondary); opacity: 0.8; }
  .heatmap-square.level-4 { background-color: var(--secondary); opacity: 1.0; }

  /* --- 툴팁 스타일 --- */
  .tooltip-container {
    display: none;
    position: fixed; 
    z-index: 9999;
    
    /* 위치 조정: 화면 중앙보다 약간 아래 */
    bottom: 15%;
    left: 50%;
    transform: translateX(-50%);
    
    background-color: var(--light);
    border: 1px solid var(--lightgray);
    color: var(--darkgray);
    
    min-width: 200px;
    max-width: 300px;
    width: max-content;
    
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 5px 25px rgba(0,0,0,0.3);
    
    text-align: left;
    white-space: normal;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, 10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }

  .heatmap-square:hover .tooltip-container { display: block; }
  .heatmap-square:hover { z-index: 1000; }
  
  .tooltip-header {
    font-weight: bold;
    border-bottom: 1px solid var(--lightgray);
    margin-bottom: 8px;
    padding-bottom: 5px;
    font-size: 1rem;
  }
  .tooltip-body { font-size: 0.9rem; max-height: 200px; overflow-y: auto; }
  .tooltip-list li a { text-decoration: none; color: var(--secondary); }
  .tooltip-list li a:hover { text-decoration: underline; }
  .no-activity { color: var(--gray); font-style: italic; }

  /* ★ 반응형: 화면이 좁아지면(950px 이하) 왼쪽 사이드바 숨김 */
  @media (max-width: 950px) {
    .sidebar.left {
      display: none !important;
    }
  }
  `

  return ActivityHeatmap
}) satisfies QuartzComponentConstructor