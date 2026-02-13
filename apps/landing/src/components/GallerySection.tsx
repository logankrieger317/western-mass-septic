import { content } from "@western-mass-septic/config";

export default function GallerySection() {
  const { gallery } = content;

  if (gallery.length === 0) return null;

  return (
    <section id="gallery" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading">Our Work</h2>
          <p className="section-subheading">Browse our recent projects</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gallery.map((item, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-xl aspect-square">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {item.caption && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                  <span className="text-white font-medium p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.caption}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
