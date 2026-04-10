import { useState, useCallback } from 'react'
import ImageUploader from './components/ImageUploader'
import SizeSelector from './components/SizeSelector'
import CropEditor from './components/CropEditor'
import ResultPreview from './components/ResultPreview'
import DownloadManager from './components/DownloadManager'

// 预设尺寸
const presetSizes = [
  { name: '微信头像', width: 200, height: 200 },
  { name: '微信封面', width: 900, height: 383 },
  { name: '微博头像', width: 180, height: 180 },
  { name: '微博封面', width: 980, height: 300 },
  { name: '抖音头像', width: 200, height: 200 },
  { name: '抖音视频', width: 1080, height: 1920 },
  { name: 'Instagram头像', width: 320, height: 320 },
  { name: 'Instagram帖子', width: 1080, height: 1080 },
  { name: 'Facebook头像', width: 200, height: 200 },
  { name: 'Facebook封面', width: 820, height: 312 },
]

// 尺寸类型
type Size = typeof presetSizes[0]

// 裁剪区域类型
type CropArea = {
  x: number
  y: number
  width: number
  height: number
}

function App() {
  const [image, setImage] = useState<File | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([])
  const [cropAreas, setCropAreas] = useState<Record<string, CropArea>>({})
  const [activeSize, setActiveSize] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  // 处理图片上传
  const handleImageUpload = (file: File) => {
    setImage(file)
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    // 重置裁剪区域
    setCropAreas({})
    setActiveSize(null)
  }

  // 处理尺寸选择
  const handleSizeSelect = (sizes: Size[]) => {
    setSelectedSizes(sizes)
    // 为新选择的尺寸初始化裁剪区域
    const newCropAreas = { ...cropAreas }
    sizes.forEach(size => {
      if (!newCropAreas[size.name]) {
        // 默认裁剪区域为图片中心
        newCropAreas[size.name] = {
          x: 0,
          y: 0,
          width: Math.min(200, size.width),
          height: Math.min(200, size.height)
        }
      }
    })
    setCropAreas(newCropAreas)
    // 设置第一个尺寸为活动尺寸
    if (sizes.length > 0) {
      setActiveSize(sizes[0].name)
    }
  }

  const handleCropAreaChange = useCallback((area: CropArea) => {
    setActiveSize(prev => {
      if (prev) {
        setCropAreas(areas => ({
          ...areas,
          [prev]: area
        }))
      }
      return prev
    })
  }, [])

  // 获取当前活动尺寸的裁剪区域
  const getActiveCropArea = () => {
    if (activeSize) {
      return cropAreas[activeSize] || { x: 0, y: 0, width: 200, height: 200 }
    }
    return { x: 0, y: 0, width: 200, height: 200 }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">图片快速裁剪工具</h1>
          <p className="mt-1 text-sm text-gray-600">为不同平台生成符合尺寸标准的图片物料</p>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：上传和裁剪区域 */}
          <div className="space-y-6">
            <ImageUploader onUpload={handleImageUpload} />
            
            {image && (
              <div className="space-y-4">
                <SizeSelector 
                  presetSizes={presetSizes} 
                  onSelect={handleSizeSelect} 
                />
                
                {selectedSizes.length > 0 && activeSize && (
                  <div className="space-y-4">
                    {/* 尺寸选择器 */}
                    <div className="flex flex-wrap gap-2">
                      {selectedSizes.map(size => (
                        <button
                          key={size.name}
                          className={`px-3 py-2 rounded-full text-sm ${activeSize === size.name
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          onClick={() => setActiveSize(size.name)}
                        >
                          {size.name} ({size.width}×{size.height})
                        </button>
                      ))}
                    </div>
                    
                    <CropEditor 
                      imageUrl={imageUrl!} 
                      onCropChange={handleCropAreaChange} 
                      size={selectedSizes.find(s => s.name === activeSize)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 右侧：结果预览和下载 */}
          <div className="space-y-6">
            {image && selectedSizes.length > 0 && (
              <>
                <ResultPreview 
                  imageUrl={imageUrl!} 
                  selectedSizes={selectedSizes} 
                  cropAreas={cropAreas} 
                />
                <DownloadManager 
                  imageUrl={imageUrl!} 
                  selectedSizes={selectedSizes} 
                  cropAreas={cropAreas} 
                />
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white shadow-sm mt-auto">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">© 2026 图片快速裁剪工具</p>
        </div>
      </footer>
    </div>
  )
}

export default App
