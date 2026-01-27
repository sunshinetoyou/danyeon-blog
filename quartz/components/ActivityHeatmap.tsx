import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/activityHeatmap.scss"

interface Options {
  title?: string
  targetTag?: string // 특정 태그만 추적 (비워두면 모든 글 추적)
}

export default ((opts?: Options) => {
  const ActivityHeatmap: QuartzComponent = ({ allFiles, displayClass }: QuartzComponentProps) => {
    const title = opts?.title ?? "Activity Log"
    
    // 1. 날짜 데이터 준비 (오늘부터 180일 전까지)
    const today = new Date()
    const daysToShow = 150 // 보여줄 날짜 수
    const dataset: Record<string, number> = {}
    
    // 2. 파일 스캔하여 날짜별 카운트
    allFiles.forEach((file) => {
      // 태그 필터링
      if (opts?.targetTag && !file.frontmatter?.tags?.includes(opts.targetTag)) {
        return
      }
      
      // 날짜 추출 (수정일이 아닌 작성일 date 기준)
      const fileDate = file.dates?.created
      if (fileDate) {
        const dateStr = fileDate.toISOString().split('T')[0] // YYYY-MM-DD
        dataset[dateStr] = (dataset[dateStr] || 0) + 1
      }
    })

    // 3. 그리드 생성
    const squares = []
    for (let i = daysToShow; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const count = dataset[dateStr] || 0
      
      // 색상 레벨 (0~4단계)
      let level = 0
      if (count > 0) level = 1
      if (count > 2) level = 2
      if (count > 4) level = 3
      
      squares.push(
        <div 
          class={`heatmap-square level-${level}`} 
          title={`${dateStr}: ${count} posts`}
        ></div>
      )
    }

    return (
      <div class={`activity-heatmap ${displayClass ?? ""}`}>
        <h3>{title}</h3>
        <div class="heatmap-grid">
          {squares}
        </div>
      </div>
    )
  }

  // CSS 스타일 (GitHub 잔디 스타일)
  ActivityHeatmap.css = `
  .activity-heatmap {
    margin-top: 1.5rem;
  }
  .activity-heatmap h3 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: var(--dark);
  }
  .heatmap-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    max-width: 100%;
  }
  .heatmap-square {
    width: 10px;
    height: 10px;
    background-color: var(--lightgray); /* 레벨 0 (빈 날) */
    border-radius: 2px;
  }
  
  /* 색상 레벨 (테마 색상 활용) */
  .heatmap-square.level-1 { background-color: var(--secondary); opacity: 0.4; }
  .heatmap-square.level-2 { background-color: var(--secondary); opacity: 0.7; }
  .heatmap-square.level-3 { background-color: var(--secondary); opacity: 1.0; }
  `

  return ActivityHeatmap
}) satisfies QuartzComponentConstructor