import { Buckets, Identity, UserAuth } from '@textile/hub'
import { PhotoProps } from 'react-photo-gallery'

export interface Photo {
  cid: string
  fileType: string
  filePreview: string
  FileUrl: string
  name: string
  tags: string
  category: string
}

export interface GalleryIndex {
  author: string
  date: number
  paths: string[]
}

export interface AppState {
  metadata: Array<Photo>
  photos: Array<PhotoProps>
  index: GalleryIndex
  isLoading: boolean
  isDragActive: boolean
  identity?: Identity
  userAuth?: UserAuth
  buckets?: Buckets
  bucketKey?: string
  www?: string
  url?: string
  ipns?: string
}