import React from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface AddProductModalProps {
  onClose: () => void
  onSuccess: () => void
}

const SELL_CATEGORIES = [
  'Analytical Instruments',
  'Balances and Measuring Equipment',
  'Centrifuges and Spinning Equipment',
  'Electrochemistry and Blood Analyzer',
  'Fermentation and Cell Culture',
  'General Laboratory Equipment',
  'Laboratory Incubators',
  'Liquid Handling and Processing',
  'Medical and Clinical Devices',
  'Mixing and Shaking Equipment',
  'Molecular Biology Equipment',
  'Refrigeration and Cooling System',
  'Specialized Systems',
  'Sterilization Equipment',
  'Tissue Processing and Histology'
];

const BUY_CATEGORIES = [
  'Hygiene',
  'Miscellaneous',
  'Research and Development',
  'Packaging',
  'Pharmaceuticals'
];

export function AddProductModal({ onClose, onSuccess }: AddProductModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [previewUrl, setPreviewUrl] = React.useState<string>('')
  const [selectedType, setSelectedType] = React.useState<'buy' | 'donate'>('buy')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  async function uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    try {
      setIsUploading(true)
      const imageUrl = await uploadImage(file)
      setPreviewUrl(imageUrl)
      if (fileInputRef.current) {
        fileInputRef.current.value = '' // Reset file input
      }
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    if (!previewUrl) {
      toast.error('Please upload a product image')
      return
    }

    try {
      setIsSubmitting(true)

      const { error } = await supabase
        .from('products')
        .insert({
          title: formData.get('title'),
          description: formData.get('description'),
          price: parseFloat(formData.get('price') as string) || 0,
          category: formData.get('category'),
          image_url: previewUrl,
          type: formData.get('type'),
          status: 'pending'
        })

      if (error) throw error

      toast.success('Product added successfully')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image *
              </label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 relative">
                {previewUrl ? (
                  <div className="relative w-full aspect-video">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="rounded-lg object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewUrl('')}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Upload an image
                      </label>
                      <input
                        id="image-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="1"
                    className="pl-7 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select a category</option>
                  {(selectedType === 'buy' ? BUY_CATEGORIES : SELL_CATEGORIES).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type *
              </label>
              <select
                id="type"
                name="type"
                required
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as 'buy' | 'donate')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="buy">For Sale</option>
                <option value="donate">For Donation</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className={cn(
                  'px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md',
                  'bg-indigo-600 hover:bg-indigo-700',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isSubmitting ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}