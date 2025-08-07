/* Collection */
export interface Collection {
  id: number
  image: CollectionImage
  title: string
  url: string
}
export interface CollectionImage {
  url: string
  alt: string
}

/* Payment solutions */
export interface PaymentSolution {
  id: string
  url: string
  alt: string
  title: string
}
