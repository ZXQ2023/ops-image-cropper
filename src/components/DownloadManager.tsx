interface Size {
  name: string
  width: number
  height: number
}

interface DownloadManagerProps {
  imageUrl: string
  selectedSizes: Size[]
  cropAreas: Record<string, { x: number; y: number; width: number; height: number }>
}

const DownloadManager: React.FC<DownloadManagerProps> = ({ imageUrl, selectedSizes, cropAreas }) => {
  // 下载单个尺寸的图片
  const downloadSingle = (size: Size) => {
    const cropArea = cropAreas[size.name] || { x: 0, y: 0, width: 200, height: 200 }
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      canvas.width = size.width
      canvas.height = size.height
      
      const img = new Image()
      img.onload = () => {
        // 计算缩放比例
        const scaleX = size.width / cropArea.width
        const scaleY = size.height / cropArea.height
        const scale = Math.min(scaleX, scaleY)
        
        // 计算居中位置
        const offsetX = (size.width - cropArea.width * scale) / 2
        const offsetY = (size.height - cropArea.height * scale) / 2
        
        // 绘制图片
        ctx.drawImage(
          img,
          cropArea.x,
          cropArea.y,
          cropArea.width,
          cropArea.height,
          offsetX,
          offsetY,
          cropArea.width * scale,
          cropArea.height * scale
        )
        
        // 转换为data URL并下载
        const dataUrl = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = `${size.name}_${size.width}x${size.height}.png`
        link.click()
      }
      img.src = imageUrl
    }
  }

  // 批量下载所有尺寸的图片
  const downloadAll = () => {
    selectedSizes.forEach(size => {
      downloadSingle(size)
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">下载图片</h2>
      <div className="space-y-4">
        <button
          className="w-full px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          onClick={downloadAll}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下载所有尺寸
        </button>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {selectedSizes.map((size) => (
            <button
              key={size.name}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-between"
              onClick={() => downloadSingle(size)}
            >
              <span>{size.name} ({size.width}×{size.height})</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DownloadManager
