import { useState, useEffect } from 'react'

interface Size {
  name: string
  width: number
  height: number
}

interface ResultPreviewProps {
  imageUrl: string
  selectedSizes: Size[]
  cropAreas: Record<string, { x: number; y: number; width: number; height: number }>
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ imageUrl, selectedSizes, cropAreas }) => {
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({})

  // 生成预览图片
  useEffect(() => {
    const generatePreviews = async () => {
      const newPreviewUrls: { [key: string]: string } = {}
      
      for (const size of selectedSizes) {
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
            
            // 转换为data URL
            newPreviewUrls[size.name] = canvas.toDataURL('image/png')
            
            // 更新状态
            setPreviewUrls(prev => ({ ...prev, [size.name]: newPreviewUrls[size.name] }))
          }
          img.src = imageUrl
        }
      }
    }

    generatePreviews()
  }, [imageUrl, selectedSizes, cropAreas])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">预览结果</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {selectedSizes.map((size) => (
          <div key={size.name} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">{size.name}</h3>
              <p className="text-xs text-gray-500">{size.width}×{size.height}</p>
            </div>
            <div className="p-2 flex items-center justify-center">
              {previewUrls[size.name] ? (
                <img
                  src={previewUrls[size.name]}
                  alt={`${size.name} 预览`}
                  className="max-w-full max-h-40 object-contain"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">生成中...</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultPreview
