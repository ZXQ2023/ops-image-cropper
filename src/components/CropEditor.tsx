import { useState, useRef, useEffect, useCallback } from 'react'

interface Size {
  name: string
  width: number
  height: number
}

interface CropEditorProps {
  imageUrl: string
  onCropChange: (area: { x: number; y: number; width: number; height: number }) => void
  size?: Size | undefined
}

const CropEditor: React.FC<CropEditorProps> = ({ imageUrl, onCropChange, size }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const onCropChangeRef = useRef(onCropChange)
  onCropChangeRef.current = onCropChange

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height })
      const cropWidth = size ? Math.min(size.width, img.width) : 200
      const cropHeight = size ? Math.min(size.height, img.height) : 200
      const initialX = (img.width - cropWidth) / 2
      const initialY = (img.height - cropHeight) / 2
      const initialCropArea = {
        x: Math.max(0, initialX),
        y: Math.max(0, initialY),
        width: cropWidth,
        height: cropHeight
      }
      setCropArea(initialCropArea)
      onCropChangeRef.current(initialCropArea)
    }
    img.src = imageUrl
  }, [imageUrl, size])

  // 监听图片显示尺寸变化
  useEffect(() => {
    const updateDisplaySize = () => {
      if (imageRef.current) {
        setDisplaySize({
          width: imageRef.current.offsetWidth,
          height: imageRef.current.offsetHeight
        })
      }
    }

    updateDisplaySize()
    window.addEventListener('resize', updateDisplaySize)
    return () => window.removeEventListener('resize', updateDisplaySize)
  }, [imageUrl])

  // 获取图片缩放比例
  const getScale = () => {
    if (imageSize.width === 0 || imageSize.height === 0) return 1
    return Math.min(displaySize.width / imageSize.width, displaySize.height / imageSize.height)
  }

  // 屏幕坐标转图片坐标
  const screenToImage = (x: number, y: number) => {
    if (!imageRef.current) return { x, y }
    const rect = imageRef.current.getBoundingClientRect()
    const scale = getScale()
    return {
      x: (x - rect.left) / scale,
      y: (y - rect.top) / scale
    }
  }

  // 处理触摸和鼠标事件的通用函数
  const getEventCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }
    } else {
      return {
        x: (e as React.MouseEvent).clientX,
        y: (e as React.MouseEvent).clientY
      }
    }
  }

  // 处理鼠标释放事件
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }, [])

  // 处理鼠标移动事件
  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const rect = imageRef.current?.getBoundingClientRect()
    if (!rect) return

    const coords = getEventCoordinates(e)

    if (isDragging) {
      e.preventDefault()
      // 计算鼠标在图片上的相对位置
      const relativeX = coords.x - rect.left
      const relativeY = coords.y - rect.top
      // 计算缩放比例
      const scale = rect.width / imageSize.width
      
      // 计算位移
      const deltaX = (relativeX - dragStart.x) / scale
      const deltaY = (relativeY - dragStart.y) / scale
      
      // 计算新的裁剪区域位置
      const newX = cropArea.x + deltaX
      const newY = cropArea.y + deltaY
      
      // 限制裁剪区域在图片范围内
      const clampedX = Math.max(0, Math.min(newX, imageSize.width - cropArea.width))
      const clampedY = Math.max(0, Math.min(newY, imageSize.height - cropArea.height))
      
      const newCropArea = { ...cropArea, x: clampedX, y: clampedY }
      setCropArea(newCropArea)
      onCropChange(newCropArea)
      
      // 更新拖拽起始位置
      setDragStart({ x: relativeX, y: relativeY })
      console.log('Dragging:', { newX: clampedX, newY: clampedY })
    } else if (isResizing && resizeHandle) {
      e.preventDefault()
      const scale = rect.width / imageSize.width
      const deltaX = (coords.x - dragStart.x) / scale
      const deltaY = (coords.y - dragStart.y) / scale

      const aspectRatio = cropArea.width / cropArea.height
      const newCropArea = { ...cropArea }

      const isLeft = resizeHandle === 'top-left' || resizeHandle === 'bottom-left'
      const isTop = resizeHandle === 'top-left' || resizeHandle === 'top-right'

      const signedDelta = isLeft ? -deltaX : deltaX
      const signedDeltaY = isTop ? -deltaY : deltaY
      const dominantDelta = (signedDelta + signedDeltaY) / 2

      let newWidth = Math.max(50, cropArea.width + dominantDelta)
      let newHeight = newWidth / aspectRatio

      if (newHeight < 50) {
        newHeight = 50
        newWidth = newHeight * aspectRatio
      }

      if (newWidth > imageSize.width) {
        newWidth = imageSize.width
        newHeight = newWidth / aspectRatio
      }
      if (newHeight > imageSize.height) {
        newHeight = imageSize.height
        newWidth = newHeight * aspectRatio
      }

      newCropArea.width = newWidth
      newCropArea.height = newHeight

      if (isLeft) {
        newCropArea.x = cropArea.x + cropArea.width - newWidth
      }
      if (isTop) {
        newCropArea.y = cropArea.y + cropArea.height - newHeight
      }

      newCropArea.x = Math.max(0, Math.min(newCropArea.x, imageSize.width - newCropArea.width))
      newCropArea.y = Math.max(0, Math.min(newCropArea.y, imageSize.height - newCropArea.height))

      setCropArea(newCropArea)
      onCropChange(newCropArea)
      setDragStart({ x: coords.x, y: coords.y })
    }
  }, [isDragging, isResizing, resizeHandle, dragStart, cropArea, imageSize, onCropChange])

  // 处理鼠标按下事件
  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent, type: 'drag' | 'resize', handle?: string) => {
    e.stopPropagation()
    e.preventDefault()
    console.log('Mouse down:', type, handle)
    
    const coords = getEventCoordinates(e)
    
    if (type === 'drag') {
      const rect = imageRef.current?.getBoundingClientRect()
      if (rect) {
        // 计算鼠标在图片上的相对位置
        const relativeX = coords.x - rect.left
        const relativeY = coords.y - rect.top
        
        // 计算拖拽起始位置
        setIsDragging(true)
        setDragStart({ x: relativeX, y: relativeY })
        console.log('Drag start:', { x: relativeX, y: relativeY })
      }
    } else if (type === 'resize' && handle) {
      setIsResizing(true)
      setResizeHandle(handle)
      setDragStart({ x: coords.x, y: coords.y })
      console.log('Resize start:', handle, { x: coords.x, y: coords.y })
    }
  }, [])

  // 全局鼠标和触摸事件监听
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      // 创建一个模拟的React.MouseEvent
      const mockEvent = {
        clientX: e.clientX,
        clientY: e.clientY,
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation()
      } as unknown as React.MouseEvent
      handleMouseMove(mockEvent)
    }

    const handleGlobalTouchMove = (e: TouchEvent) => {
      // 创建一个模拟的React.TouchEvent
      const mockEvent = {
        touches: e.touches,
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation()
      } as unknown as React.TouchEvent
      handleMouseMove(mockEvent)
    }

    const handleGlobalMouseUp = () => {
      handleMouseUp()
    }

    const handleGlobalTouchEnd = () => {
      handleMouseUp()
    }

    // 无论isDragging或isResizing状态如何，都添加监听器
    // 因为状态更新可能滞后于事件触发
    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
    window.addEventListener('touchend', handleGlobalTouchEnd)

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchmove', handleGlobalTouchMove)
      window.removeEventListener('touchend', handleGlobalTouchEnd)
    }
  }, [handleMouseMove, handleMouseUp])

  // 计算裁剪框的显示位置和大小
  const getCropBoxStyle = () => {
    if (!imageRef.current) return { left: '0px', top: '0px', width: '200px', height: '200px' }
    
    // 获取图片的实际显示尺寸和位置
    const rect = imageRef.current.getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }
    
    // 计算图片在容器内的相对位置
    const imageLeft = rect.left - containerRect.left
    const imageTop = rect.top - containerRect.top
    
    // 计算缩放比例
    const scale = rect.width / imageSize.width
    
    // 确保裁剪框的大小至少为50x50
    const displayWidth = Math.max(50, cropArea.width * scale)
    const displayHeight = Math.max(50, cropArea.height * scale)
    
    return {
      left: `${imageLeft + cropArea.x * scale}px`,
      top: `${imageTop + cropArea.y * scale}px`,
      width: `${displayWidth}px`,
      height: `${displayHeight}px`
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">调整裁剪区域</h2>
      <div className="relative overflow-hidden rounded-lg border border-gray-200">
        <div
          ref={containerRef}
          className="relative"
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="上传的图片"
            className="max-w-full h-auto"
            style={{ maxHeight: '400px' }}
          />
          
          {/* 裁剪框 */}
          <div
            className="absolute border-2 border-blue-500 bg-blue-500/20 cursor-move"
            style={getCropBoxStyle()}
            onMouseDown={(e) => handleMouseDown(e, 'drag')}
            onTouchStart={(e) => handleMouseDown(e, 'drag')}
          >
            {/* 调整手柄 */}
            <div 
              className="absolute top-0 left-0 w-4 h-4 bg-blue-500 cursor-nwse-resize" 
              onMouseDown={(e) => handleMouseDown(e, 'resize', 'top-left')}
              onTouchStart={(e) => handleMouseDown(e, 'resize', 'top-left')}
            />
            <div 
              className="absolute top-0 right-0 w-4 h-4 bg-blue-500 cursor-nesw-resize" 
              onMouseDown={(e) => handleMouseDown(e, 'resize', 'top-right')}
              onTouchStart={(e) => handleMouseDown(e, 'resize', 'top-right')}
            />
            <div 
              className="absolute bottom-0 left-0 w-4 h-4 bg-blue-500 cursor-nesw-resize" 
              onMouseDown={(e) => handleMouseDown(e, 'resize', 'bottom-left')}
              onTouchStart={(e) => handleMouseDown(e, 'resize', 'bottom-left')}
            />
            <div 
              className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-nwse-resize" 
              onMouseDown={(e) => handleMouseDown(e, 'resize', 'bottom-right')}
              onTouchStart={(e) => handleMouseDown(e, 'resize', 'bottom-right')}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        裁剪区域: {Math.round(cropArea.x)}×{Math.round(cropArea.y)} - {Math.round(cropArea.width)}×{Math.round(cropArea.height)}
      </div>
    </div>
  )
}

export default CropEditor
