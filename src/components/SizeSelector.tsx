import { useState } from 'react'

interface Size {
  name: string
  width: number
  height: number
}

interface SizeSelectorProps {
  presetSizes: Size[]
  onSelect: (sizes: Size[]) => void
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ presetSizes, onSelect }) => {
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([])
  const [customName, setCustomName] = useState('')
  const [customWidth, setCustomWidth] = useState('')
  const [customHeight, setCustomHeight] = useState('')

  const handleSizeToggle = (size: Size) => {
    let newSelectedSizes: Size[]
    if (selectedSizes.some(s => s.name === size.name)) {
      newSelectedSizes = selectedSizes.filter(s => s.name !== size.name)
    } else {
      newSelectedSizes = [...selectedSizes, size]
    }
    setSelectedSizes(newSelectedSizes)
    onSelect(newSelectedSizes)
  }

  const handleAddCustomSize = (e: React.FormEvent) => {
    e.preventDefault()
    if (customName && customWidth && customHeight) {
      const width = parseInt(customWidth)
      const height = parseInt(customHeight)
      if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
        const customSize: Size = { name: customName, width, height }
        const newSelectedSizes = [...selectedSizes, customSize]
        setSelectedSizes(newSelectedSizes)
        onSelect(newSelectedSizes)
        // 重置表单
        setCustomName('')
        setCustomWidth('')
        setCustomHeight('')
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">选择尺寸</h2>
      
      {/* 预设尺寸 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">预设尺寸</h3>
        <div className="flex flex-wrap gap-2">
          {presetSizes.map((size) => (
            <button
              key={size.name}
              className={`px-3 py-2 rounded-full text-sm ${selectedSizes.some(s => s.name === size.name)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              onClick={() => handleSizeToggle(size)}
            >
              {size.name} ({size.width}×{size.height})
            </button>
          ))}
        </div>
      </div>

      {/* 自定义尺寸 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">自定义尺寸</h3>
        <form onSubmit={handleAddCustomSize} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="尺寸名称"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="宽度"
            value={customWidth}
            onChange={(e) => setCustomWidth(e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="高度"
            value={customHeight}
            onChange={(e) => setCustomHeight(e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            添加
          </button>
        </form>
      </div>

      {/* 已选尺寸 */}
      {selectedSizes.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">已选尺寸</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSizes.map((size) => (
              <span
                key={size.name}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center gap-1"
              >
                {size.name} ({size.width}×{size.height})
                <button
                  onClick={() => handleSizeToggle(size)}
                  className="hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SizeSelector
