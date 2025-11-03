interface ImagePlaceholderProps {
  width?: number;
  height?: number;
  text?: string;
}

export default function ImagePlaceholder({
  width = 480,
  height = 270,
  text = "No Image",
}: ImagePlaceholderProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className="w-full h-full"
    >
      <rect width="100%" height="100%" fill="#e5e7eb" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="20"
        fill="#9ca3af"
      >
        {text}
      </text>
    </svg>
  );
}
