import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  title?: string
  targetTag?: string 
}

export default ((opts?: Options) => {
  const ActivityHeatmap: QuartzComponent = ({ allFiles, displayClass }: QuartzComponentProps) => {
    const title = opts?.title ?? "Activity Log"
    
    // 1. 오늘 날짜와 1년 전 날짜 계산
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 365)
    
    // ★ 핵심: 시작일을 "그 주의 일요일"로 맞춰야 줄이 안 밀림
    const dayOfWeek = startDate.getDay() // 0(일) ~ 6(토)
    startDate.setDate(startDate.getDate() - dayOfWeek)

    // 2. 데이터 집계
    const dataset: Record<string, number> = {}
    allFiles.forEach((file) => {
      if (opts?.targetTag && !file.frontmatter?.tags?.includes(opts.targetTag)) return
      
      const fileDate = file.dates?.created
      if (fileDate) {
        const dateStr = fileDate.toISOString().split('T')[0]
        dataset[dateStr] = (dataset[dateStr] || 0) + 1
      }
    })

    // 3. 그리드 생성 (시작일 ~ 오늘)
    const squares = []
    const currentDate = new Date(startDate)

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const count = dataset[dateStr] || 0
      
      let level = 0
      if (count > 0) level = 1
      if (count > 2) level = 2
      if (count > 4) level = 3
      if (count > 6) level = 4

      squares.push(
        <div 
          class={`heatmap-square level-${level}`} 
          title={`${dateStr}: ${count} posts`} // 마우스 올리면 날짜/개수 뜸
        ></div>
      )
      
      // 다음 날짜로 이동
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return (
      <div class={`activity-heatmap ${displayClass ?? ""}`}>
        <h3>{title}</h3>
        <div class="heatmap-container">
          {/* 요일 라벨 (월, 수, 금만 표시하거나 생략 가능) */}
          <div class="heatmap-grid">
            {squares}
          </div>
        </div>
      </div>
    )
  }

  ActivityHeatmap.css = `
  .activity-heatmap {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center; /* 가운데 정렬 */
  }
  .activity-heatmap h3 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }
  
  .heatmap-grid {
    display: grid;
    /* ★ 핵심: 세로 7칸(일~토) 고정 */
    grid-template-rows: repeat(7, 10px); 
    /* 데이터가 세로로 먼저 쌓이고 오른쪽으로 이동 */
    grid-auto-flow: column; 
    gap: 3px; /* 칸 간격 */
  }

  .heatmap-square {
    width: 10px;
    height: 10px;
    background-color: rgba(200, 200, 200, 0.2); /* 빈 날짜 (연한 회색) */
    border-radius: 2px;
  }

  /* 다크모드 대응 빈 칸 색상 */
  [saved-theme="dark"] .heatmap-square {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  /* 색상 레벨 (테마의 secondary 색상 활용) */
  .heatmap-square.level-1 { background-color: var(--secondary); opacity: 0.4; }
  .heatmap-square.level-2 { background-color: var(--secondary); opacity: 0.6; }
  .heatmap-square.level-3 { background-color: var(--secondary); opacity: 0.8; }
  .heatmap-square.level-4 { background-color: var(--secondary); opacity: 1.0; }
  `

  return ActivityHeatmap
}) satisfies QuartzComponentConstructor