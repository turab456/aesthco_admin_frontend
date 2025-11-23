import React from "react";
import { X } from "lucide-react";
import { ImageState } from "../types";

interface ImagePreviewProps {
  images: ImageState[];
  onRemove?: (index: number) => void;
  isReadOnly?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  images,
  onRemove,
  isReadOnly = false,
}) => {
  const getImageUrl = (image: ImageState): string | null => {
    // If image has a file, create a preview URL
    if (image.file) {
      return URL.createObjectURL(image.file);
    }
    if (image.imageUrl) {
      return image.imageUrl;
    }
    return null;
  };

  if (!images || images.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">No images uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {images.map((image, index) => {
        const imageUrl = getImageUrl(image);

        return (
          <div
            key={`${image.id ?? index}`}
            className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Product image ${index + 1}`}
                className="h-40 w-full object-cover"
              />
            ) : (
              <div className="flex h-40 items-center justify-center bg-gray-100 dark:bg-gray-700">
                <p className="text-xs text-gray-400">No preview</p>
              </div>
            )}

            {/* Primary badge */}
            {image.is_primary && (
              <div className="absolute left-0 top-0 bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
                Primary
              </div>
            )}
            {image.color && (
              <div className="absolute right-1 top-1 rounded bg-gray-900/80 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                Color #{image.color}
              </div>
            )}

            {/* Remove button */}
            {!isReadOnly && onRemove && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <X size={16} />
              </button>
            )}

            {/* Image info */}
            <div className="border-t border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900">
              <p className="truncate text-xs font-medium text-gray-700 dark:text-gray-300">
                {image.file?.name || `Image ${index + 1}`}
              </p>
              {image.file && (
                <p className="text-xs text-gray-500">
                  {(image.file.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImagePreview;
