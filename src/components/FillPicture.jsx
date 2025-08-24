export default function FillPicture({ data, sizes, alt = '', eager = false }) {
  // "data" is the object returned by imagetools ?as=picture import
  return (
    <picture className="absolute inset-0 -z-10 block">
      {data.sources.map((s) => (
        <source key={s.type} srcSet={s.srcset} type={s.type} sizes={sizes} />
      ))}
      <img
        src={data.img.src}
        width={data.img.w}
        height={data.img.h}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="w-full h-full object-cover"
      />
    </picture>
  );
}