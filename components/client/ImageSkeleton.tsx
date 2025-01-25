import { Skeleton } from "@/components/ui/skeleton"

interface ImageSkeletonProps {
  className?: string
}

export function ImageSkeleton({ className }: ImageSkeletonProps) {
  return <Skeleton className={`w-full h-48 ${className}`} />
}

