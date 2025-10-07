"use client"

import Image from "next/image"

interface PeekGalleryProps {
  images?: { src: string; alt: string }[]
}

export default function PeekGallery({
  images = [
    { src: "/media/hero1.jpg", alt: "Customer Experience" },
    { src: "/media/hero2.jpg", alt: "Admin Experience" },
  ],
}: PeekGalleryProps) {
  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img, idx) => (
          <div key={idx} className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="aspect-[16/9]">
              <Image src={img.src} alt={img.alt} fill priority className="object-cover" />
            </div>
            <div className="p-3 text-sm text-gray-700 border-t">{img.alt}</div>
          </div>
        ))}
      </div>
    </section>
  )
}